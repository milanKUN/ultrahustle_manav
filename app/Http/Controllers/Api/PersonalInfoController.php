<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PersonalInfo\PatchPersonalInfoRequest;
use App\Http\Requests\PersonalInfo\UpsertPersonalInfoRequest;
use App\Models\User;
use App\Models\UserPersonalInfo;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PersonalInfoController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $info = UserPersonalInfo::where('uh_user_id', $user->uh_user_id)->first();

        return $this->successResponse('Personal info fetched.', $this->payload($user, $info));
    }

    public function upsert(UpsertPersonalInfoRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $uhUserId = $user->uh_user_id;

        $validated = $request->validated();

        $username = $validated['username'] ?? null;
        if (! is_null($username) && $this->usernameTakenByAnotherUser($uhUserId, $username)) {
            return $this->errorResponse('Username already taken.', [
                'username' => ['Username already taken.'],
            ], 409);
        }

        $defaults = [
            'first_name' => null,
            'last_name' => null,
            'username' => null,
            'date_of_birth' => null,
            'contact_email' => null,
            'phone_country' => null,
            'phone_country_code' => null,
            'phone_number' => null,
            'gender' => null,
            'street' => null,
            'city' => null,
            'state' => null,
            'country' => null,
            'pincode' => null,
            'title' => null,
            'short_bio' => null,
            'about' => null,
            'availability' => null,
            'hashtags' => [],
            'skills' => [],
            'tools' => [],
            'languages' => [],
        ];

        $data = array_merge($defaults, $validated);

        try {
            $info = UserPersonalInfo::withTrashed()->firstOrNew(['uh_user_id' => $uhUserId]);

            if ($info->exists && method_exists($info, 'trashed') && $info->trashed()) {
                $info->restore();
            }

            $info->fill($data);
            $info->save();

            return $this->successResponse('Personal info saved.', $this->payload($user, $info->fresh()));
        } catch (QueryException $e) {
            if ($this->isUniqueViolation($e)) {
                return $this->errorResponse('Username already taken.', [
                    'username' => ['Username already taken.'],
                ], 409);
            }

            report($e);

            return $this->errorResponse('Failed to save personal info.', [], 500);
        }
    }

    public function patch(PatchPersonalInfoRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $uhUserId = $user->uh_user_id;

        $validated = $request->validated();

        if (array_key_exists('username', $validated)) {
            $username = $validated['username'];
            if (! is_null($username) && $this->usernameTakenByAnotherUser($uhUserId, $username)) {
                return $this->errorResponse('Username already taken.', [
                    'username' => ['Username already taken.'],
                ], 409);
            }
        }

        try {
            $info = UserPersonalInfo::withTrashed()->firstOrNew(['uh_user_id' => $uhUserId]);

            if ($info->exists && method_exists($info, 'trashed') && $info->trashed()) {
                $info->restore();
            }

            $info->fill($validated);
            $info->save();

            return $this->successResponse('Personal info updated.', $this->payload($user, $info->fresh()));
        } catch (QueryException $e) {
            if ($this->isUniqueViolation($e)) {
                return $this->errorResponse('Username already taken.', [
                    'username' => ['Username already taken.'],
                ], 409);
            }

            report($e);

            return $this->errorResponse('Failed to update personal info.', [], 500);
        }
    }

    public function destroy(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $info = UserPersonalInfo::where('uh_user_id', $user->uh_user_id)->first();
        if ($info) {
            $info->delete();
        }

        return $this->successResponse('Personal info deleted.', $this->payload($user, null));
    }

    public function uploadAvatar(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

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

        $info = UserPersonalInfo::withTrashed()->firstOrNew(['uh_user_id' => $user->uh_user_id]);
        if ($info->exists && method_exists($info, 'trashed') && $info->trashed()) {
            $info->restore();
        }

        $disk = Storage::disk('public');
        $oldPath = $info->avatar_path;

        $mime = (string) ($file->getMimeType() ?: '');
        $ext = $this->avatarExtensionFromMime($mime) ?? $file->extension();
        $ext = strtolower((string) $ext);

        if (! in_array($ext, ['jpg', 'jpeg', 'png', 'webp'], true)) {
            $ext = 'jpg';
        }

        $filename = $user->uh_user_id.'_'.now()->format('YmdHis').'_'.Str::random(8).'.'.$ext;

        $path = $file->storeAs('uploads/avatars', $filename, 'public');

        try {
            DB::transaction(function () use ($info, $path, $filename, $mime, $file): void {
                $info->forceFill([
                    'avatar_path' => $path,
                    'avatar_filename' => $filename,
                    'avatar_mime' => $mime,
                    'avatar_size' => $file->getSize(),
                    'avatar_updated_at' => now(),
                ])->save();
            });
        } catch (\Throwable $e) {
            $disk->delete($path);
            report($e);

            return $this->errorResponse('Failed to upload avatar.', [], 500);
        }

        if ($oldPath && $oldPath !== $path) {
            $disk->delete($oldPath);
        }

        return $this->successResponse('Avatar uploaded.', $this->payload($user, $info->fresh()));
    }

    public function deleteAvatar(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $info = UserPersonalInfo::where('uh_user_id', $user->uh_user_id)->first();
        if (! $info) {
            return $this->successResponse('Avatar removed.', $this->payload($user, null));
        }

        $disk = Storage::disk('public');
        $path = $info->avatar_path;

        DB::transaction(function () use ($info): void {
            $info->forceFill([
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

        return $this->successResponse('Avatar removed.', $this->payload($user, $info->fresh()));
    }

    private function payload(User $user, ?UserPersonalInfo $info): array
    {
        $personalDefaults = [
            'first_name' => null,
            'last_name' => null,
            'username' => null,
            'date_of_birth' => null,
            'contact_email' => null,
            'phone_country' => null,
            'phone_country_code' => null,
            'phone_number' => null,
            'gender' => null,
            'street' => null,
            'city' => null,
            'state' => null,
            'country' => null,
            'pincode' => null,
            'title' => null,
            'short_bio' => null,
            'about' => null,
            'availability' => null,
            'hashtags' => [],
            'skills' => [],
            'tools' => [],
            'languages' => [],

            'avatar_url' => null,
            'avatar_filename' => null,
            'avatar_path' => null,
            'avatar_mime' => null,
            'avatar_size' => null,
            'avatar_updated_at' => null,

            'created_at' => null,
            'updated_at' => null,
        ];

        $personal = $personalDefaults;

        if ($info) {
            $personal = array_merge($personal, $info->only(array_keys($personalDefaults)));

            $personal['avatar_url'] = $this->publicStorageUrl($info->avatar_path);

            foreach (['hashtags', 'skills', 'tools', 'languages'] as $field) {
                if (! is_array($personal[$field] ?? null)) {
                    $personal[$field] = [];
                }
            }
        }

        $displayName = $this->displayName(
            firstName: (string) ($personal['first_name'] ?? ''),
            lastName: (string) ($personal['last_name'] ?? ''),
            username: (string) ($personal['username'] ?? ''),
            email: $user->email,
        );

        return array_merge([
            'uh_user_id' => $user->uh_user_id,
            'email' => $user->email,
            'display_name' => $displayName,
        ], $personal);
    }

    private function publicStorageUrl(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return url('/storage/'.ltrim($path, '/'));
    }

    private function displayName(string $firstName, string $lastName, string $username, string $email): string
    {
        $firstName = trim($firstName);
        $lastName = trim($lastName);
        $username = trim($username);

        $full = trim($firstName.' '.$lastName);
        if ($full !== '') {
            return $full;
        }

        if ($username !== '') {
            return $username;
        }

        return $email;
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

    private function usernameTakenByAnotherUser(string $uhUserId, string $username): bool
    {
        $candidate = strtolower($username);

        return DB::table('user_personal_info')
            ->whereRaw('lower(username) = ?', [$candidate])
            ->where('uh_user_id', '!=', $uhUserId)
            ->exists();
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
            return str_contains($message, 'unique') || str_contains($message, 'user_personal_info_username_uq');
        }

        return false;
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
