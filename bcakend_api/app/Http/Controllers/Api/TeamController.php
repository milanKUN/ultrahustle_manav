<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teams\PatchTeamMemberRequest;
use App\Http\Requests\Teams\PatchTeamRequest;
use App\Http\Requests\Teams\StoreTeamRequest;
use App\Models\Team;
use App\Models\TeamMembership;
use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;
use App\Models\Portfolio;
use App\Models\PortfolioProject;
class TeamController extends Controller
{
    public function store(StoreTeamRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validated();

        $username = (string) ($validated['username'] ?? '');
        if ($this->usernameTakenByAnotherTeam(null, $username)) {
            return $this->errorResponse('Username already taken.', [
                'username' => ['Username already taken.'],
            ], 409);
        }

        $defaults = [
            'title' => null,
            'bio' => null,
            'about' => null,
            'what_we_do' => null,
            'availability' => null,
            'terms' => null,
            'hashtags' => [],
            'skills' => [],
            'tools' => [],
            'languages' => [],
            'rules' => [],
        ];

        $data = array_merge($defaults, $validated);
        $data['owner_user_id'] = $user->id;
        $data['username'] = strtolower((string) $data['username']);

        try {
            /** @var Team $team */
            $team = DB::transaction(function () use ($data, $user): Team {
                $team = Team::create($data);

                TeamMembership::create([
                    'team_id' => $team->id,
                    'user_id' => $user->id,
                    'role' => 'Owner',
                    'member_title' => null,
                    'joined_at' => now(),
                    'left_at' => null,
                ]);

                return $team;
            });

            return $this->successResponse('Team created.', $this->teamPayload($team->fresh()), 201);
        } catch (QueryException $e) {
            if ($this->isUniqueViolation($e)) {
                return $this->errorResponse('Username already taken.', [
                    'username' => ['Username already taken.'],
                ], 409);
            }

            report($e);

            return $this->errorResponse('Failed to create team.', $this->exceptionPayload($e, $this->queryHint($e)), 500);
        }
    }

    public function show(Request $request, Team $team): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! $this->canViewTeam($user, $team)) {
            return $this->errorResponse('Forbidden.', [], 403);
        }

        $team = $team->fresh();

        $memberships = $team
            ->memberships()
            ->with('user:id,full_name,email')
            ->orderByDesc('id')
            ->get();

        $invitations = [];
        if ($this->isOwner($user, $team)) {
            $invitations = $team
                ->invitations()
                ->with('invitedUser:id,full_name,email', 'invitedBy:id,full_name,email')
                ->orderByDesc('id')
                ->get()
                ->map(fn ($inv) => $this->invitationPayload($inv))
                ->values()
                ->all();
        }

        return $this->successResponse('Team fetched.', [
            'team' => $this->teamPayload($team),
            'memberships' => $memberships->map(fn ($m) => $this->membershipPayload($m))->values()->all(),
            'invitations' => $invitations,
        ]);
    }

    public function update(PatchTeamRequest $request, Team $team): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! $this->isOwner($user, $team)) {
            return $this->errorResponse('Forbidden.', [], 403);
        }

        $validated = $request->validated();

        if (array_key_exists('username', $validated)) {
            $username = $validated['username'];
            if (! is_null($username) && $this->usernameTakenByAnotherTeam($team->id, (string) $username)) {
                return $this->errorResponse('Username already taken.', [
                    'username' => ['Username already taken.'],
                ], 409);
            }

            if (! is_null($username)) {
                $validated['username'] = strtolower((string) $username);
            }
        }

        try {
            $team->fill($validated);
            $team->save();

            return $this->successResponse('Team updated.', $this->teamPayload($team->fresh()));
        } catch (QueryException $e) {
            if ($this->isUniqueViolation($e)) {
                return $this->errorResponse('Username already taken.', [
                    'username' => ['Username already taken.'],
                ], 409);
            }

            report($e);

            return $this->errorResponse('Failed to update team.', $this->exceptionPayload($e, $this->queryHint($e)), 500);
        }
    }

    public function uploadAvatar(Request $request, Team $team): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! $this->isOwner($user, $team)) {
            return $this->errorResponse('Forbidden.', [], 403);
        }

        $validated = $request->validate([
            'avatar' => [
                'required',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
                'dimensions:max_width=2000,max_height=2000',
            ],
        ]);

        /** @var UploadedFile $file */
        $file = $validated['avatar'];

        $disk = Storage::disk('public');
        $oldPath = $team->avatar_path;

        $mime = (string) ($file->getMimeType() ?: '');
        $ext = $this->avatarExtensionFromMime($mime) ?? $file->extension();
        $ext = strtolower((string) $ext);
        if (! in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
            $ext = 'jpg';
        }

        $filename = 'team_'.$team->id.'_'.now()->format('YmdHis').'_'.Str::random(8).'.'.$ext;

        try {
            $path = $file->storeAs('uploads/team-avatars', $filename, 'public');
        } catch (Throwable $e) {
            report($e);

            return $this->errorResponse('Failed to upload avatar.', $this->exceptionPayload($e, [
                'hint' => 'Storage write failed. Ensure storage/app/public is writable and run php artisan storage:link on the server.',
            ]), 500);
        }

        try {
            DB::transaction(function () use ($team, $path, $filename, $mime, $file): void {
                $team->forceFill([
                    'avatar_path' => $path,
                    'avatar_filename' => $filename,
                    'avatar_mime' => $mime,
                    'avatar_size' => $file->getSize(),
                    'avatar_updated_at' => now(),
                ])->save();
            });
        } catch (Throwable $e) {
            $disk->delete($path);
            report($e);

            $hint = [];
            if ($e instanceof QueryException) {
                $hint = $this->queryHint($e);
            }

            return $this->errorResponse('Failed to upload avatar.', $this->exceptionPayload($e, $hint), 500);
        }

        if ($oldPath && $oldPath !== $path) {
            $disk->delete($oldPath);
        }

        return $this->successResponse('Avatar uploaded.', $this->teamPayload($team->fresh()));
    }

    public function deleteAvatar(Request $request, Team $team): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! $this->isOwner($user, $team)) {
            return $this->errorResponse('Forbidden.', [], 403);
        }

        $disk = Storage::disk('public');
        $path = $team->avatar_path;

        DB::transaction(function () use ($team): void {
            $team->forceFill([
                'avatar_filename' => null,
                'avatar_path' => null,
                'avatar_mime' => null,
                'avatar_size' => null,
                'avatar_updated_at' => now(),
            ])->save();
        });

        if ($path) {
            $disk->delete($path);
        }

        return $this->successResponse('Avatar removed.', $this->teamPayload($team->fresh()));
    }

    public function members(Request $request, Team $team): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! $this->canViewTeam($user, $team)) {
            return $this->errorResponse('Forbidden.', [], 403);
        }

        $memberships = $team
            ->memberships()
            ->with('user:id,full_name,email')
            ->orderByDesc('id')
            ->get();

        return $this->successResponse('Members fetched.', [
            'memberships' => $memberships->map(fn ($m) => $this->membershipPayload($m))->values()->all(),
        ]);
    }

    public function patchMember(PatchTeamMemberRequest $request, Team $team, TeamMembership $member): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! $this->isOwner($user, $team)) {
            return $this->errorResponse('Forbidden.', [], 403);
        }

        if ((int) $member->team_id !== (int) $team->id) {
            return $this->errorResponse('Member not found.', [], 404);
        }

        if ((int) $member->user_id === (int) $team->owner_user_id) {
            return $this->errorResponse('Cannot modify the owner membership.', [], 422);
        }

        $member->fill($request->validated());
        $member->save();

        return $this->successResponse('Member updated.', [
            'membership' => $this->membershipPayload($member->fresh(['user:id,full_name,email'])),
        ]);
    }

    public function deleteMember(Request $request, Team $team, TeamMembership $member): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (! $this->isOwner($user, $team)) {
            return $this->errorResponse('Forbidden.', [], 403);
        }

        if ((int) $member->team_id !== (int) $team->id) {
            return $this->errorResponse('Member not found.', [], 404);
        }

        if ((int) $member->user_id === (int) $team->owner_user_id) {
            return $this->errorResponse('Cannot remove the team owner.', [], 422);
        }

        $member->forceFill([
            'left_at' => now(),
        ])->save();

        return $this->successResponse('Member removed.', [
            'membership' => $this->membershipPayload($member->fresh(['user:id,full_name,email'])),
        ]);
    }

    private function canViewTeam(User $user, Team $team): bool
    {
        if ($this->isOwner($user, $team)) {
            return true;
        }

        return TeamMembership::where('team_id', $team->id)
            ->where('user_id', $user->id)
            ->whereNull('left_at')
            ->exists();
    }

    private function isOwner(User $user, Team $team): bool
    {
        return (int) $team->owner_user_id === (int) $user->id;
    }

    private function teamPayload(Team $team): array
    {
        $defaults = [
            'id' => null,
            'owner_user_id' => null,
            'name' => null,
            'username' => null,
            'title' => null,
            'bio' => null,
            'about' => null,
            'what_we_do' => null,
            'category' => null,
            'availability' => null,
            'terms' => null,
            'hashtags' => [],
            'skills' => [],
            'tools' => [],
            'languages' => [],
            'rules' => [],

            'avatar_url' => null,
            'avatar_filename' => null,
            'avatar_path' => null,
            'avatar_mime' => null,
            'avatar_size' => null,
            'avatar_updated_at' => null,

            'created_at' => null,
            'updated_at' => null,
            'deleted_at' => null,
        ];

        $data = array_merge($defaults, $team->only(array_keys($defaults)));

        $data['avatar_url'] = $this->publicStorageUrl($team->avatar_path);

        foreach (['hashtags', 'skills', 'tools', 'languages', 'rules'] as $field) {
            if (! is_array($data[$field] ?? null)) {
                $data[$field] = [];
            }
        }

        return $data;
    }

    private function membershipPayload(TeamMembership $membership): array
    {
        $user = $membership->relationLoaded('user') ? $membership->user : null;

        return [
            'id' => $membership->id,
            'team_id' => $membership->team_id,
            'user_id' => $membership->user_id,
            'role' => $membership->role,
            'member_title' => $membership->member_title,
            'joined_at' => $membership->joined_at,
            'left_at' => $membership->left_at,
            'user' => $user ? [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
            ] : null,
            'created_at' => $membership->created_at,
            'updated_at' => $membership->updated_at,
        ];
    }

    private function invitationPayload($invitation): array
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

    private function publicStorageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return url('/storage/'.ltrim($path, '/'));
    }

    private function avatarExtensionFromMime(string $mime): ?string
    {
        return match (strtolower($mime)) {
            'image/jpeg', 'image/jpg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            default => null,
        };
    }

    private function usernameTakenByAnotherTeam(?int $currentTeamId, string $username): bool
    {
        $candidate = strtolower($username);

        $query = DB::table('teams')
            ->whereRaw('lower(username) = ?', [$candidate]);

        if (! is_null($currentTeamId)) {
            $query->where('id', '!=', $currentTeamId);
        }

        return $query->exists();
    }

    private function isUniqueViolation(QueryException $e): bool
    {
        $sqlState = $e->errorInfo[0] ?? null;
        $driverCode = $e->errorInfo[1] ?? null;
        $message = strtolower((string) $e->getMessage());

        if ($sqlState === '23505') {
            return true;
        }

        if ($sqlState === '23000' && (string) $driverCode === '1062') {
            return true;
        }

        if ($sqlState === '23000') {
            return str_contains($message, 'unique') || str_contains($message, 'teams_username_uq');
        }

        return false;
    }

    private function queryHint(QueryException $e): array
    {
        $message = strtolower((string) $e->getMessage());

        if (
            str_contains($message, 'base table')
            || str_contains($message, 'doesn\'t exist')
            || str_contains($message, 'no such table')
            || str_contains($message, 'unknown column')
        ) {
            return ['hint' => 'Database schema looks out of date. Run php artisan migrate --force on the server.'];
        }

        if (str_contains($message, 'foreign key constraint fails')) {
            return ['hint' => 'Foreign key constraint failed. Ensure the authenticated user exists in the users table and migrations ran cleanly.'];
        }

        if (str_contains($message, "field 'id' doesn't have a default value")) {
            return ['hint' => 'A table has an id column without AUTO_INCREMENT. Run php artisan mysql:fix-auto-increment-ids then rerun migrations.'];
        }

        return [];
    }

    private function exceptionPayload(Throwable $e, array $extra = []): array
    {
        if (config('app.debug')) {
            return array_merge($extra, [
                'exception' => class_basename($e),
                'error' => $e->getMessage(),
            ]);
        }

        return $extra;
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

    //manage teams
    public function manageTeams(Request $request)
    {
        $user = $request->user();

        $teams = Team::query()
            ->where('owner_user_id', $user->id)
            ->withCount('memberships as members_count')
            ->orderByDesc('id')
            ->get()
            ->map(function ($team) {
                // Team portfolio
                $portfolio = Portfolio::where('owner_type', 'team')
                    ->where('owner_id', $team->id)
                    ->first();

                $projectsCount = 0;

                if ($portfolio) {
                    $projectsCount = PortfolioProject::where('portfolio_id', $portfolio->id)->count();
                }

                // If you have listings/services/gigs table later, replace this
                $listingsCount = 0;

                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'username' => $team->username,
                    'title' => $team->title,
                    'bio' => $team->bio,
                    'avatar' => $team->avatar_path
                        ? asset('storage/' . ltrim($team->avatar_path, '/'))
                        : null,
                    'members' => (int) $team->members_count,
                    'listings' => (int) $listingsCount,
                    'projects' => (int) $projectsCount,
                    'isActive' => (bool) $team->is_active,
                ];
            });

        return response()->json([
            'teams' => $teams,
        ]);
    }

    public function showByUsername(string $username): JsonResponse
{
    $team = Team::query()
        ->whereRaw('LOWER(username) = ?', [strtolower($username)])
        ->first();

    if (! $team) {
        return $this->errorResponse('Team not found.', [], 404);
    }

    $memberships = $team
        ->memberships()
        ->with('user:id,full_name,email')
        ->whereNull('left_at')
        ->orderByDesc('id')
        ->get();

    return $this->successResponse('Team fetched.', [
        'team' => $this->teamPayload($team->fresh()),
        'memberships' => $memberships->map(fn ($m) => $this->membershipPayload($m))->values()->all(),
    ]);
}
}