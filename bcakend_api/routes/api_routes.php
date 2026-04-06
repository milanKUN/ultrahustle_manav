<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\PublicUserController;

Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login']);
Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);

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

	Route::post('/check-username', [\App\Http\Controllers\Api\OnboardingController::class, 'checkUserName']);
	Route::post('/save-username', [\App\Http\Controllers\Api\OnboardingController::class, 'saveUserName']);

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
	Route::get('/my-activities', [\App\Http\Controllers\Api\PersonalInfoController::class, 'getUserActivities']);
	Route::get('/get-username', [\App\Http\Controllers\Api\PersonalInfoController::class, 'getUserName']);
	Route::get('/my-activity', [\App\Http\Controllers\Api\UserActivityController::class, 'myActivity']);

	Route::delete('/', [\App\Http\Controllers\Api\MeController::class, 'destroy']);

	Route::get('/languages', [\App\Http\Controllers\Api\PersonalInfoController::class, 'getLanguages']);
	Route::get('/countries', [\App\Http\Controllers\Api\PersonalInfoController::class, 'getCountries']);
	Route::get('/states/{country_id}', [\App\Http\Controllers\Api\PersonalInfoController::class, 'getStateByCountryId']);
	Route::get('/cities/{country_id}', [\App\Http\Controllers\Api\PersonalInfoController::class, 'getCityByStateId']);

});

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('v1/me/portfolio')->group(function () {
        Route::get('/', [PortfolioController::class, 'showUser']);
        Route::post('/sync', [PortfolioController::class, 'syncUser']);

        // IMPORTANT: use projectId / mediaId instead of project / media
        Route::delete('/projects/{projectId}', [PortfolioController::class, 'destroyUserProject']);
        Route::delete('/media/{mediaId}', [PortfolioController::class, 'destroyUserMedia']);
    });

    Route::prefix('v1/teams/{team}/portfolio')->group(function () {
        Route::get('/', [PortfolioController::class, 'showTeam']);
        Route::post('/sync', [PortfolioController::class, 'syncTeam']);

        // IMPORTANT: use projectId / mediaId instead of project / media
        Route::delete('/projects/{projectId}', [PortfolioController::class, 'destroyTeamProject']);
        Route::delete('/media/{mediaId}', [PortfolioController::class, 'destroyTeamMedia']);
    });
});

// Public decline endpoint (token-only)
Route::post('/v1/team-invites/{token}/decline', [\App\Http\Controllers\Api\TeamInviteController::class, 'decline']);
    Route::get('/v1/teams/username/{username}', [TeamController::class, 'showByUsername']);

Route::middleware('auth:sanctum')->prefix('v1')->group(function () {
    Route::post('/teams', [TeamController::class, 'store']);


    Route::get('/teams/{team}', [TeamController::class, 'show']);
    Route::patch('/teams/{team}', [TeamController::class, 'update']);

    Route::post('/teams/{team}/avatar', [TeamController::class, 'uploadAvatar']);
    Route::delete('/teams/{team}/avatar', [TeamController::class, 'deleteAvatar']);

    Route::get('/teams/{team}/members', [TeamController::class, 'members']);
    Route::patch('/teams/{team}/members/{member}', [TeamController::class, 'patchMember']);
    Route::delete('/teams/{team}/members/{member}', [TeamController::class, 'deleteMember']);

    Route::get('/my-teams', [TeamController::class, 'manageTeams']);
    Route::patch('/teams/{team}/toggle-status', [TeamController::class, 'toggleStatus']);

	Route::post('/teams/{team}/invites', [\App\Http\Controllers\Api\TeamInviteController::class, 'storeInvite']);
	Route::get('/teams/{team}/invites', [\App\Http\Controllers\Api\TeamInviteController::class, 'listInvites']);
	Route::post('/team-invites/{token}/accept', [\App\Http\Controllers\Api\TeamInviteController::class, 'accept']);

	Route::get('/creators/search', [\App\Http\Controllers\Api\CreatorSearchController::class, 'search'])->middleware('throttle:30,1');

});
Route::get('/v1/teams/username/{username}/portfolio', [PortfolioController::class, 'showTeamPublic']);
Route::get('/v1/users/username/{username}', [PublicUserController::class, 'profile']);
Route::get('/v1/users/username/{username}/portfolio', [PortfolioController::class, 'showUserPublic']);
// Route::get('/v1/users/username/{username}/portfolio', [PublicUserController::class, 'portfolio']);
Route::get('/v1/users/username/{username}/follow-counts', [PublicUserController::class, 'followCounts']);