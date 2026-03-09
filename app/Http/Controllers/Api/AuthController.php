<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\EmailVerificationOtpMail;
use App\Models\UhClientOnboarding;
use App\Models\UhFreelancerOnboarding;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'fullName' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role' => ['required', 'in:freelancer,client'],
            'agreedToTerms' => ['required', 'accepted'],
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed.', $validator->errors()->toArray(), 422);
        }

        try {
            $validated = $validator->validated();

            $user = User::create([
                'uh_user_id' => User::generateUniqueUhUserId(),
                'full_name' => $validated['fullName'],
                'email' => strtolower($validated['email']),
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
                'provider' => null,
                'provider_id' => null,
                'agreed_to_terms' => true,
            ]);

            $this->sendEmailVerificationOtp($user);

            return $this->successResponse('Registration successful. Verification code sent to email.', [
                'verification_required' => true,
                'user' => $user,
            ], 201);
        } catch (\Throwable $e) {
            report($e);

            return $this->errorResponse('Registration failed. Please try again later.', [], 500);
        }
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return $this->errorResponse('Validation failed.', $validator->errors()->toArray(), 422);
        }

        try {
            $validated = $validator->validated();

            $user = User::where('email', strtolower($validated['email']))->first();

            if (! $user || ! $user->password || ! Hash::check($validated['password'], $user->password)) {
                return $this->errorResponse('Invalid credentials.', [], 401);
            }

            if (is_null($user->email_verified_at)) {
                return $this->errorResponse('Email not verified.', [
                    'verification_required' => true,
                    'email' => $user->email,
                ], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            $onboarding = $this->onboardingStatus($user);

            return $this->successResponse('Login successful.', [
                'token' => $token,
                'user' => $user,
                'uh_user_id' => $user->uh_user_id,
                'role' => $user->role,
                'onboarding_completed' => $onboarding['onboarding_completed'],
                'onboarding_type' => $onboarding['onboarding_type'],
                'current_step' => $onboarding['current_step'],
            ]);
        } catch (\Throwable $e) {
            report($e);

            return $this->errorResponse('Login failed. Please try again later.', [], 500);
        }
    }

    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback(Request $request): Response
    {
        try {
            if ($request->filled('error')) {
                return $this->errorResponse('Google authorization was not completed.', [
                    'provider_error' => $request->query('error'),
                    'provider_error_description' => $request->query('error_description'),
                ], 422);
            }

            if (! $request->filled('code')) {
                return $this->errorResponse('Missing authorization code.', [], 422);
            }

            $socialUser = Socialite::driver('google')->stateless()->user();

            $email = $socialUser->getEmail();
            if (! $email) {
                return $this->errorResponse('Google account did not provide an email address.', [], 422);
            }

            $user = User::where('email', strtolower($email))->first();

            if (! $user) {
                $user = User::create([
                    'uh_user_id' => User::generateUniqueUhUserId(),
                    'full_name' => $socialUser->getName() ?: 'Google User',
                    'email' => strtolower($email),
                    'password' => null,
                    'role' => 'client',
                    'provider' => 'google',
                    'provider_id' => (string) $socialUser->getId(),
                    'agreed_to_terms' => false,
                    'email_verified_at' => now(),
                ]);
            } else {
                $user->forceFill([
                    'provider' => $user->provider ?: 'google',
                    'provider_id' => $user->provider_id ?: (string) $socialUser->getId(),
                    'email_verified_at' => $user->email_verified_at ?: now(),
                ])->save();
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            $onboarding = $this->onboardingStatus($user);

            if ($request->expectsJson()) {
                return $this->successResponse('Google login successful.', [
                    'token' => $token,
                    'user' => $user,
                    'uh_user_id' => $user->uh_user_id,
                    'role' => $user->role,
                    'onboarding_completed' => $onboarding['onboarding_completed'],
                    'onboarding_type' => $onboarding['onboarding_type'],
                    'current_step' => $onboarding['current_step'],
                ]);
            }

            $frontendUrl = rtrim((string) (config('app.frontend_url') ?: config('app.url')), '/');
            $fragment = http_build_query([
                'token' => $token,
                'uh_user_id' => $user->uh_user_id,
                'role' => $user->role,
                'onboarding_completed' => $onboarding['onboarding_completed'] ? '1' : '0',
                'onboarding_type' => $onboarding['onboarding_type'],
                'current_step' => $onboarding['current_step'],
            ]);

            return redirect()->away($frontendUrl.'/oauth/success#'.$fragment);
        } catch (\Throwable $e) {
            report($e);

            $errors = [];
            if (config('app.debug')) {
                $errors = [
                    'exception' => class_basename($e),
                    'error' => $e->getMessage(),
                ];
            }

            return $this->errorResponse('Google login failed. Please try again later.', $errors, 500);
        }
    }

    public function redirectToFacebook()
    {
        return Socialite::driver('facebook')->stateless()->redirect();
    }

    public function handleFacebookCallback(Request $request): Response
    {
        try {
            if ($request->filled('error')) {
                return $this->errorResponse('Facebook authorization was not completed.', [
                    'provider_error' => $request->query('error'),
                    'provider_error_description' => $request->query('error_description'),
                ], 422);
            }

            if (! $request->filled('code')) {
                return $this->errorResponse('Missing authorization code.', [], 422);
            }

            $socialUser = Socialite::driver('facebook')->stateless()->user();

            $email = $socialUser->getEmail();
            if (! $email) {
                return $this->errorResponse('Facebook account did not provide an email address.', [], 422);
            }

            $user = User::where('email', strtolower($email))->first();

            if (! $user) {
                $user = User::create([
                    'uh_user_id' => User::generateUniqueUhUserId(),
                    'full_name' => $socialUser->getName() ?: 'Facebook User',
                    'email' => strtolower($email),
                    'password' => null,
                    'role' => 'client',
                    'provider' => 'facebook',
                    'provider_id' => (string) $socialUser->getId(),
                    'agreed_to_terms' => false,
                    'email_verified_at' => now(),
                ]);
            } else {
                $user->forceFill([
                    'provider' => $user->provider ?: 'facebook',
                    'provider_id' => $user->provider_id ?: (string) $socialUser->getId(),
                    'email_verified_at' => $user->email_verified_at ?: now(),
                ])->save();
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            $onboarding = $this->onboardingStatus($user);

            if ($request->expectsJson()) {
                return $this->successResponse('Facebook login successful.', [
                    'token' => $token,
                    'user' => $user,
                    'uh_user_id' => $user->uh_user_id,
                    'role' => $user->role,
                    'onboarding_completed' => $onboarding['onboarding_completed'],
                    'onboarding_type' => $onboarding['onboarding_type'],
                    'current_step' => $onboarding['current_step'],
                ]);
            }

            $frontendUrl = rtrim((string) (config('app.frontend_url') ?: config('app.url')), '/');
            $fragment = http_build_query([
                'token' => $token,
                'uh_user_id' => $user->uh_user_id,
                'role' => $user->role,
                'onboarding_completed' => $onboarding['onboarding_completed'] ? '1' : '0',
                'onboarding_type' => $onboarding['onboarding_type'],
                'current_step' => $onboarding['current_step'],
            ]);

            return redirect()->away($frontendUrl.'/oauth/success#'.$fragment);
        } catch (\Throwable $e) {
            report($e);

            $errors = [];
            if (config('app.debug')) {
                $errors = [
                    'exception' => class_basename($e),
                    'error' => $e->getMessage(),
                ];
            }

            return $this->errorResponse('Facebook login failed. Please try again later.', $errors, 500);
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

    private function sendEmailVerificationOtp(User $user): void
    {
        $expiresInMinutes = (int) config('auth.otp_expires_minutes', 10);
        $resendCooldownSeconds = (int) config('auth.otp_resend_cooldown_seconds', 30);

        $latest = DB::table('email_verification_otps')
            ->where('user_id', $user->id)
            ->orderByDesc('id')
            ->first();

        if ($latest && isset($latest->created_at)) {
            $createdAt = \Illuminate\Support\Carbon::parse($latest->created_at);
            if ($createdAt->diffInSeconds(now()) < $resendCooldownSeconds) {
                return;
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
    }

    private function onboardingStatus(User $user): array
    {
        $client = UhClientOnboarding::where('uh_user_id', $user->uh_user_id)->first();
        $creator = UhFreelancerOnboarding::where('uh_user_id', $user->uh_user_id)->first();

        if ($user->role === 'freelancer') {
            return [
                'onboarding_type' => 'creator',
                'onboarding_completed' => (bool) ($creator && $creator->completed_at),
                'current_step' => $creator ? (int) $creator->current_step : 0,
            ];
        }

        if ($user->role === 'client') {
            return [
                'onboarding_type' => 'client',
                'onboarding_completed' => (bool) ($client && $client->completed_at),
                'current_step' => $client ? (int) $client->current_step : 0,
            ];
        }

        if ($client) {
            return [
                'onboarding_type' => 'client',
                'onboarding_completed' => (bool) $client->completed_at,
                'current_step' => (int) $client->current_step,
            ];
        }

        if ($creator) {
            return [
                'onboarding_type' => 'creator',
                'onboarding_completed' => (bool) $creator->completed_at,
                'current_step' => (int) $creator->current_step,
            ];
        }

        return [
            'onboarding_type' => 'client',
            'onboarding_completed' => false,
            'current_step' => 0,
        ];
    }
}
