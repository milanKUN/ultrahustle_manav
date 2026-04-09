<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\StoreTeamInviteRequest;
use App\Mail\TeamInvitationMail;
use App\Models\Team;
use App\Models\TeamInvitation;
use App\Models\TeamMembership;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class TeamInviteController extends Controller
{
    public function storeInvite(StoreTeamInviteRequest $request, Team $team): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ((int) $team->owner_user_id !== (int) $user->id) {
            return $this->errorResponse('Forbidden.', [], 403);
        }

        $validated = $request->validated();

        $email = strtolower((string) $validated['email']);
        $role = (string) $validated['role'];
        $memberTitle = $validated['member_title'] ?? null;
        $action = $validated['action'] ?? 'send';

        if ($email === strtolower((string) $user->email)) {
            return $this->errorResponse('You are already the team owner.', [
                'email' => ['You are already part of the team.'],
            ], 422);
        }

        $existingMembership = TeamMembership::where('team_id', $team->id)
            ->whereHas('user', fn ($q) => $q->where('email', $email))
            ->whereNull('left_at')
            ->exists();

        if ($existingMembership) {
            return $this->errorResponse('User is already a member.', [
                'email' => ['User is already a member.'],
            ], 422);
        }

        /** @var User|null $invitedUser */
        $invitedUser = User::where('email', $email)->first();

        /** @var TeamInvitation|null $invite */
        $invite = TeamInvitation::where('team_id', $team->id)
            ->where('email', $email)
            ->orderByDesc('id')
            ->first();

        if ($action === 'revoke') {
            if (! $invite || $invite->accepted_at || $invite->declined_at || $invite->revoked_at) {
                return $this->errorResponse('No active invite to revoke.', [], 404);
            }

            $invite->forceFill([
                'revoked_at' => now(),
            ])->save();

            return $this->successResponse('Invite revoked.', [
                'invitation' => $this->invitationPayload($invite->fresh()),
            ]);
        }

        $cooldownSeconds = 60;
        $maxSendCount = 10;

        if ($invite && $invite->last_sent_at) {
            $lastSent = Carbon::parse($invite->last_sent_at);
            if ($lastSent->diffInSeconds(now()) < $cooldownSeconds) {
                return $this->errorResponse('Please wait before resending the invite.', [], 429);
            }
        }

        if ($invite && (int) $invite->send_count >= $maxSendCount) {
            return $this->errorResponse('Invite send limit reached.', [], 429);
        }

        $plainToken = Str::random(64);
        $tokenHash = hash('sha256', $plainToken);
        $expiresAt = now()->addDays(7);

        $invite = DB::transaction(function () use ($invite, $team, $email, $invitedUser, $user, $role, $memberTitle, $tokenHash, $expiresAt): TeamInvitation {
            if (! $invite || $invite->accepted_at || $invite->declined_at || $invite->revoked_at) {
                $invite = new TeamInvitation();
                $invite->team_id = $team->id;
                $invite->email = $email;
                $invite->invited_by_user_id = $user->id;
                $invite->send_count = 0;
            }

            $invite->forceFill([
                'email' => $email,
                'invited_user_id' => $invitedUser?->id,
                'invited_by_user_id' => $user->id,
                'role' => $role,
                'member_title' => $memberTitle,
                'token_hash' => $tokenHash,
                'expires_at' => $expiresAt,
                'accepted_at' => null,
                'declined_at' => null,
                'revoked_at' => null,
                'last_sent_at' => now(),
                'send_count' => (int) ($invite->send_count ?? 0) + 1,
            ])->save();

            return $invite;
        });

        $frontendUrl = rtrim((string) (config('app.frontend_url') ?: config('app.url')), '/');
        $inviteLink = $frontendUrl . '/team-invite?token=' . $plainToken;

        Mail::to($email)->send(new TeamInvitationMail(
            teamName: (string) $team->name,
            inviterName: (string) $user->full_name,
            role: $role,
            inviteLink: $inviteLink,
        ));

        return $this->successResponse('Invite sent.', [
            'invitation' => $this->invitationPayload($invite->fresh()),
        ], 201);
    }

    public function listInvites(Request $request, Team $team): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if ((int) $team->owner_user_id !== (int) $user->id) {
            return $this->errorResponse('Forbidden.', [], 403);
        }

        $invites = $team->invitations()
            ->with('invitedUser:id,full_name,email', 'invitedBy:id,full_name,email')
            ->orderByDesc('id')
            ->get();

        return $this->successResponse('Invites fetched.', [
            'invitations' => $invites->map(fn ($inv) => $this->invitationPayload($inv))->values()->all(),
        ]);
    }

    public function accept(Request $request, string $token): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $tokenHash = hash('sha256', $token);

        /** @var TeamInvitation|null $invite */
        $invite = TeamInvitation::where('token_hash', $tokenHash)->first();

        if (! $invite) {
            return $this->errorResponse('Invalid invite token.', [], 404);
        }

        if ($invite->revoked_at) {
            return $this->errorResponse('Invite has been revoked.', [], 410);
        }

        if ($invite->accepted_at) {
            return $this->successResponse('Invite already accepted.', []);
        }

        if ($invite->declined_at) {
            return $this->errorResponse('Invite was declined.', [], 410);
        }

        if ($invite->expires_at && $invite->expires_at->isPast()) {
            return $this->errorResponse('Invite has expired.', [], 410);
        }

        $emailMatches = strtolower((string) $user->email) === strtolower((string) $invite->email);
        $idMatches = $invite->invited_user_id
            ? ((int) $invite->invited_user_id === (int) $user->id)
            : false;

        if (! $emailMatches && ! $idMatches) {
            return $this->errorResponse('This invite is not for your account.', [], 403);
        }

        DB::transaction(function () use ($invite, $user): void {
            TeamMembership::updateOrCreate(
                [
                    'team_id' => $invite->team_id,
                    'user_id' => $user->id,
                ],
                [
                    'role' => $invite->role,
                    'member_title' => $invite->member_title,
                    'joined_at' => now(),
                    'left_at' => null,
                ]
            );

            $invite->forceFill([
                'invited_user_id' => $user->id,
                'accepted_at' => now(),
                'declined_at' => null,
                'revoked_at' => null,
            ])->save();
        });

        return $this->successResponse('Invite accepted.', []);
    }

    public function decline(Request $request, string $token): JsonResponse
    {
        $tokenHash = hash('sha256', $token);

        /** @var TeamInvitation|null $invite */
        $invite = TeamInvitation::where('token_hash', $tokenHash)->first();

        if (! $invite) {
            return $this->errorResponse('Invalid invite token.', [], 404);
        }

        if ($invite->accepted_at) {
            return $this->errorResponse('Invite already accepted.', [], 409);
        }

        if ($invite->revoked_at) {
            return $this->errorResponse('Invite has been revoked.', [], 410);
        }

        if ($invite->declined_at) {
            return $this->successResponse('Invite already declined.', []);
        }

        $invite->forceFill([
            'declined_at' => now(),
        ])->save();

        return $this->successResponse('Invite declined.', []);
    }

    private function invitationPayload(TeamInvitation $invitation): array
    {
        $status = 'pending';
        if ($invitation->revoked_at) {
            $status = 'revoked';
        } elseif ($invitation->accepted_at) {
            $status = 'accepted';
        } elseif ($invitation->declined_at) {
            $status = 'declined';
        } elseif ($invitation->expires_at && $invitation->expires_at->isPast()) {
            $status = 'expired';
        }

        return [
            'id' => $invitation->id,
            'team_id' => $invitation->team_id,
            'email' => $invitation->email,
            'invited_user_id' => $invitation->invited_user_id,
            'invited_by_user_id' => $invitation->invited_by_user_id,
            'role' => $invitation->role,
            'member_title' => $invitation->member_title,
            'status' => $status,
            'expires_at' => $invitation->expires_at,
            'accepted_at' => $invitation->accepted_at,
            'declined_at' => $invitation->declined_at,
            'revoked_at' => $invitation->revoked_at,
            'last_sent_at' => $invitation->last_sent_at,
            'send_count' => $invitation->send_count,
            'invited_user' => $invitation->relationLoaded('invitedUser') && $invitation->invitedUser ? [
                'id' => $invitation->invitedUser->id,
                'full_name' => $invitation->invitedUser->full_name,
                'email' => $invitation->invitedUser->email,
            ] : null,
            'invited_by' => $invitation->relationLoaded('invitedBy') && $invitation->invitedBy ? [
                'id' => $invitation->invitedBy->id,
                'full_name' => $invitation->invitedBy->full_name,
                'email' => $invitation->invitedBy->email,
            ] : null,
            'created_at' => $invitation->created_at,
            'updated_at' => $invitation->updated_at,
        ];
    }

    private function successResponse(string $message, array $data = [], int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    private function errorResponse(string $message, array $errors = [], int $statusCode = 400): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }
}