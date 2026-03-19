<?php


use Illuminate\Support\Facades\Route;

Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);

// Forgot password
Route::post('/forgot-password', [\App\Http\Controllers\Api\PasswordResetController::class, 'sendResetLink']);
Route::post('/reset-password', [\App\Http\Controllers\Api\PasswordResetController::class, 'resetPassword']);

Route::get('/auth/google/redirect', [\App\Http\Controllers\Api\AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [\App\Http\Controllers\Api\AuthController::class, 'handleGoogleCallback']);

Route::get('/auth/facebook/redirect', [\App\Http\Controllers\Api\AuthController::class, 'redirectToFacebook']);
Route::get('/auth/facebook/callback', [\App\Http\Controllers\Api\AuthController::class, 'handleFacebookCallback']);

// Convenience aliases (keep existing /email/* endpoints too)
Route::post('/verify-otp', [\App\Http\Controllers\Api\EmailVerificationController::class, 'verifyOtp']);
Route::post('/resend-otp', [\App\Http\Controllers\Api\EmailVerificationController::class, 'resendOtp']);

Route::post('/email/verify-otp', [\App\Http\Controllers\Api\EmailVerificationController::class, 'verifyOtp']);
Route::post('/email/resend-otp', [\App\Http\Controllers\Api\EmailVerificationController::class, 'resendOtp']);

Route::middleware('auth:sanctum')->group(function (): void {
	Route::post('/follow/{id}', [\App\Http\Controllers\Api\FollowController::class, 'follow']);
	Route::delete('/unfollow/{id}', [\App\Http\Controllers\Api\FollowController::class, 'unfollow']);
	Route::get('/users/{id}/followers', [\App\Http\Controllers\Api\FollowController::class, 'followers']);
	Route::get('/users/{id}/following', [\App\Http\Controllers\Api\FollowController::class, 'following']);
	Route::delete('/followers/{id}', [\App\Http\Controllers\Api\FollowController::class, 'removeFollower']);
	Route::get('/users/{id}/follow-counts', [\App\Http\Controllers\Api\FollowController::class, 'counts']);
});

Route::middleware('auth:sanctum')->prefix('/onboarding')->group(function (): void {
	Route::get('/status', [\App\Http\Controllers\Api\OnboardingController::class, 'status']);
	Route::post('/complete', [\App\Http\Controllers\Api\OnboardingController::class, 'complete']);

	Route::get('/client', [\App\Http\Controllers\Api\OnboardingController::class, 'getClient']);
	Route::patch('/client/work-type', [\App\Http\Controllers\Api\OnboardingController::class, 'clientWorkType']);
	Route::patch('/client/goals', [\App\Http\Controllers\Api\OnboardingController::class, 'clientGoals']);
	Route::patch('/client/needs', [\App\Http\Controllers\Api\OnboardingController::class, 'clientNeeds']);
	Route::patch('/client/business-details', [\App\Http\Controllers\Api\OnboardingController::class, 'clientBusinessDetails']);

	Route::get('/freelancer', [\App\Http\Controllers\Api\OnboardingController::class, 'getFreelancer']);
	Route::patch('/freelancer/work-type', [\App\Http\Controllers\Api\OnboardingController::class, 'freelancerWorkType']);
	Route::patch('/freelancer/goals', [\App\Http\Controllers\Api\OnboardingController::class, 'freelancerGoals']);
	Route::patch('/freelancer/skills', [\App\Http\Controllers\Api\OnboardingController::class, 'freelancerSkills']);
});

Route::middleware('auth:sanctum')->prefix('/v1/me')->group(function (): void {
	Route::get('/personal-info', [\App\Http\Controllers\Api\PersonalInfoController::class, 'show']);
	Route::put('/personal-info', [\App\Http\Controllers\Api\PersonalInfoController::class, 'upsert']);
	Route::patch('/personal-info', [\App\Http\Controllers\Api\PersonalInfoController::class, 'patch']);
	Route::delete('/personal-info', [\App\Http\Controllers\Api\PersonalInfoController::class, 'destroy']);

	Route::put('/password', [\App\Http\Controllers\Api\MePasswordController::class, 'update'])->middleware('throttle:5,1');

	Route::get('/portfolio', [\App\Http\Controllers\Api\MePortfolioController::class, 'show']);
	Route::put('/portfolio', [\App\Http\Controllers\Api\MePortfolioController::class, 'upsert'])->middleware('throttle:10,1');
	Route::post('/portfolio/projects/{projectId}/media', [\App\Http\Controllers\Api\MePortfolioMediaController::class, 'store'])->middleware('throttle:10,1');
	Route::delete('/portfolio/projects/{projectId}', [\App\Http\Controllers\Api\MePortfolioProjectController::class, 'destroy']);
	Route::delete('/portfolio/media/{mediaId}', [\App\Http\Controllers\Api\MePortfolioMediaController::class, 'destroy']);

	Route::post('/personal-info/avatar', [\App\Http\Controllers\Api\PersonalInfoController::class, 'uploadAvatar']);
	Route::delete('/personal-info/avatar', [\App\Http\Controllers\Api\PersonalInfoController::class, 'deleteAvatar']);

	Route::get('/user-notification', [\App\Http\Controllers\Api\MeNotificationController::class, 'get']);
	Route::put('/user-notification', [\App\Http\Controllers\Api\MeNotificationController::class, 'update']);

	Route::delete('/', [\App\Http\Controllers\Api\MeController::class, 'destroy']);
});

// Public decline endpoint (token-only)
Route::post('/v1/team-invites/{token}/decline', [\App\Http\Controllers\Api\TeamInviteController::class, 'decline']);

Route::middleware('auth:sanctum')->prefix('/v1')->group(function (): void {
	Route::post('/teams', [\App\Http\Controllers\Api\TeamController::class, 'store']);
	Route::get('/teams/{team}', [\App\Http\Controllers\Api\TeamController::class, 'show']);
	Route::patch('/teams/{team}', [\App\Http\Controllers\Api\TeamController::class, 'update']);

	Route::post('/teams/{team}/avatar', [\App\Http\Controllers\Api\TeamController::class, 'uploadAvatar']);
	Route::delete('/teams/{team}/avatar', [\App\Http\Controllers\Api\TeamController::class, 'deleteAvatar']);

	Route::get('/teams/{team}/members', [\App\Http\Controllers\Api\TeamController::class, 'members']);
	Route::patch('/teams/{team}/members/{member}', [\App\Http\Controllers\Api\TeamController::class, 'patchMember']);
	Route::delete('/teams/{team}/members/{member}', [\App\Http\Controllers\Api\TeamController::class, 'deleteMember']);

	Route::post('/teams/{team}/invites', [\App\Http\Controllers\Api\TeamInviteController::class, 'storeInvite']);
	Route::get('/teams/{team}/invites', [\App\Http\Controllers\Api\TeamInviteController::class, 'listInvites']);
	Route::post('/team-invites/{token}/accept', [\App\Http\Controllers\Api\TeamInviteController::class, 'accept']);

	Route::get('/creators/search', [\App\Http\Controllers\Api\CreatorSearchController::class, 'search'])->middleware('throttle:30,1');
});
