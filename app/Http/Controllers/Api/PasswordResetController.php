<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class PasswordResetController extends Controller
{
    public function sendResetLink(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email', 'max:255'],
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed.', $validator->errors()->toArray(), 422);
        }

        $email = strtolower(trim((string) $validator->validated()['email']));

        $status = Password::sendResetLink([
            'email' => $email,
        ]);

        Log::info('Forgot password requested.', [
            'email' => $this->maskEmail($email),
            'status' => $status,
        ]);

        // For security, do not reveal whether the email exists.
        if ($status === Password::RESET_LINK_SENT) {
            return $this->successResponse(__($status));
        }

        return $this->successResponse('If this email exists, a reset link has been sent.');
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $payload = $request->all();

        // Support common frontend naming.
        if (! isset($payload['password_confirmation']) && isset($payload['confirmPassword'])) {
            $payload['password_confirmation'] = $payload['confirmPassword'];
        }

        $validator = Validator::make($payload, [
            'token' => ['required', 'string'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'password_confirmation' => ['required', 'string', 'min:8'],
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed.', $validator->errors()->toArray(), 422);
        }

        $validated = $validator->validated();

        $email = strtolower(trim((string) $validated['email']));

        Log::info('Reset password attempted.', [
            'email' => $this->maskEmail($email),
        ]);

        $status = Password::reset(
            [
                'email' => $email,
                'password' => (string) $validated['password'],
                'password_confirmation' => (string) $validated['password_confirmation'],
                'token' => (string) $validated['token'],
            ],
            function ($user, string $password): void {
                $user->forceFill([
                    'password' => $password,
                    'remember_token' => Str::random(60),
                ])->save();

                event(new PasswordReset($user));
            }
        );

        Log::info('Reset password result.', [
            'email' => $this->maskEmail($email),
            'status' => $status,
        ]);

        if ($status === Password::PASSWORD_RESET) {
            return $this->successResponse(__($status));
        }

        return $this->errorResponse(__($status), [], 422);
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

    private function maskEmail(string $email): string
    {
        $parts = explode('@', $email, 2);
        if (count($parts) !== 2) {
            return '***';
        }

        [$local, $domain] = $parts;
        $local = (string) $local;

        if ($local === '') {
            return '***@'.$domain;
        }

        $first = substr($local, 0, 1);
        $last = strlen($local) > 1 ? substr($local, -1) : '';

        return $first.'***'.$last.'@'.$domain;
    }
}
