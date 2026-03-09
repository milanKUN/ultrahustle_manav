<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\EmailVerificationOtpMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class EmailVerificationController extends Controller
{
    public function verifyOtp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email'],
            'code' => ['required', 'digits:6'],
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed.', $validator->errors()->toArray(), 422);
        }

        try {
            $validated = $validator->validated();
            $email = strtolower($validated['email']);
            $code = (string) $validated['code'];

            $user = User::where('email', $email)->first();
            if (! $user) {
                return $this->errorResponse('Invalid email or code.', [], 422);
            }

            if (! is_null($user->email_verified_at)) {
                $token = $user->createToken('auth_token')->plainTextToken;

                return $this->successResponse('Email already verified.', [
                    'token' => $token,
                    'user' => $user,
                ]);
            }

            $otp = DB::table('email_verification_otps')
                ->where('user_id', $user->id)
                ->whereNull('consumed_at')
                ->where('expires_at', '>', now())
                ->orderByDesc('id')
                ->first();

            if (! $otp) {
                return $this->errorResponse('Verification code expired or not found. Please resend code.', [], 422);
            }

            if ((int) $otp->attempts >= 5) {
                return $this->errorResponse('Too many attempts. Please resend code.', [], 429);
            }

            if (! Hash::check($code, $otp->code_hash)) {
                DB::table('email_verification_otps')->where('id', $otp->id)->update([
                    'attempts' => (int) $otp->attempts + 1,
                    'updated_at' => now(),
                ]);

                return $this->errorResponse('Invalid verification code.', [], 422);
            }

            DB::transaction(function () use ($user, $otp) {
                $user->forceFill([
                    'email_verified_at' => now(),
                ])->save();

                DB::table('email_verification_otps')->where('id', $otp->id)->update([
                    'consumed_at' => now(),
                    'updated_at' => now(),
                ]);
            });

            $token = $user->createToken('auth_token')->plainTextToken;

            return $this->successResponse('Email verification successful.', [
                'token' => $token,
                'user' => $user,
            ]);
        } catch (\Throwable $e) {
            report($e);

            $errors = [];
            if (config('app.debug')) {
                $errors = [
                    'exception' => class_basename($e),
                    'error' => $e->getMessage(),
                ];
            }

            return $this->errorResponse('Email verification failed. Please try again later.', $errors, 500);
        }
    }

    public function resendOtp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email'],
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed.', $validator->errors()->toArray(), 422);
        }

        try {
            $email = strtolower((string) $validator->validated()['email']);
            $user = User::where('email', $email)->first();

            if (! $user) {
                return $this->successResponse('If this email exists, a code has been sent.', [
                    'resend_available_in_seconds' => 0,
                ]);
            }

            if (! is_null($user->email_verified_at)) {
                return $this->successResponse('Email already verified.', [
                    'verified' => true,
                ]);
            }

            $expiresInMinutes = (int) config('auth.otp_expires_minutes', 10);
            $resendCooldownSeconds = (int) config('auth.otp_resend_cooldown_seconds', 30);

            $latest = DB::table('email_verification_otps')
                ->where('user_id', $user->id)
                ->orderByDesc('id')
                ->first();

            if ($latest && isset($latest->created_at)) {
                $createdAt = \Illuminate\Support\Carbon::parse($latest->created_at);
                $diff = $createdAt->diffInSeconds(now());
                if ($diff < $resendCooldownSeconds) {
                    return $this->errorResponse('Please wait before requesting another code.', [
                        'resend_available_in_seconds' => $resendCooldownSeconds - $diff,
                    ], 429);
                }
            }

            $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            DB::table('email_verification_otps')->insert([
                'user_id' => $user->id,
                'email' => $user->email,
                'code_hash' => Hash::make($code),
                'attempts' => 0,
                'expires_at' => now()->addMinutes($expiresInMinutes),
                'consumed_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            Mail::to($user->email)->send(new EmailVerificationOtpMail(
                fullName: $user->full_name,
                code: $code,
                expiresInMinutes: $expiresInMinutes,
            ));

            return $this->successResponse('Verification code resent.', [
                'resend_available_in_seconds' => $resendCooldownSeconds,
            ]);
        } catch (\Throwable $e) {
            report($e);

            $errors = [];
            if (config('app.debug')) {
                $errors = [
                    'exception' => class_basename($e),
                    'error' => $e->getMessage(),
                ];
            }

            return $this->errorResponse('Failed to resend code. Please try again later.', $errors, 500);
        }
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
