<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Onboarding\ClientBusinessDetailsRequest;
use App\Http\Requests\Onboarding\ClientGoalsRequest;
use App\Http\Requests\Onboarding\ClientNeedsRequest;
use App\Http\Requests\Onboarding\ClientWorkTypeRequest;
use App\Http\Requests\Onboarding\FreelancerGoalsRequest;
use App\Http\Requests\Onboarding\FreelancerSkillsRequest;
use App\Http\Requests\Onboarding\FreelancerWorkTypeRequest;
use App\Models\UhClientOnboarding;
use App\Models\UhFreelancerOnboarding;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OnboardingController extends Controller
{
    private const CLIENT_FINAL_STEP = 8;
    private const CREATOR_FINAL_STEP = 7;

    public function status(Request $request): JsonResponse
    {
        $user = $request->user();
        [$type, $record] = $this->resolveOnboardingRecord($user);

        return response()->json($this->statusPayload($user, $type, $record));
    }

    public function complete(Request $request): JsonResponse
    {
        $user = $request->user();
        [$type, $record] = $this->resolveOnboardingRecord($user);

        if ($type === 'creator') {
            $model = $record instanceof UhFreelancerOnboarding
                ? $record
                : UhFreelancerOnboarding::updateOrCreate(
                    ['uh_user_id' => $user->uh_user_id],
                    ['onboarding_role' => 'creator']
                );

            $model->current_step = max((int) $model->current_step, self::CREATOR_FINAL_STEP);
            $model->completed_at = now();
            $model->save();

            return response()->json($this->statusPayload($user, 'creator', $model->fresh()));
        }

        $model = $record instanceof UhClientOnboarding
            ? $record
            : UhClientOnboarding::updateOrCreate(
                ['uh_user_id' => $user->uh_user_id],
                ['onboarding_role' => 'client']
            );

        $model->current_step = max((int) $model->current_step, self::CLIENT_FINAL_STEP);
        $model->completed_at = now();
        $model->save();

        return response()->json($this->statusPayload($user, 'client', $model->fresh()));
    }

    public function getClient(Request $request): JsonResponse
    {
        $user = $request->user();
        $record = UhClientOnboarding::where('uh_user_id', $user->uh_user_id)->first();

        return response()->json($this->statusPayload($user, 'client', $record));
    }

    public function clientWorkType(ClientWorkTypeRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        if (($validated['work_type'] ?? null) !== 'team') {
            $validated['team_industry'] = null;
            $validated['team_build_plan'] = null;
        }

        $model = UhClientOnboarding::updateOrCreate(
            ['uh_user_id' => $user->uh_user_id],
            array_merge(['onboarding_role' => 'client'], $validated)
        );

        $model->current_step = max((int) $model->current_step, 2);
        $model->save();

        return response()->json($this->statusPayload($user, 'client', $model->fresh()));
    }

    public function clientGoals(ClientGoalsRequest $request): JsonResponse
    {
        $user = $request->user();

        $model = UhClientOnboarding::updateOrCreate(
            ['uh_user_id' => $user->uh_user_id],
            [
                'onboarding_role' => 'client',
                'goals_json' => $request->validated()['goals'],
            ]
        );

        $model->current_step = max((int) $model->current_step, 3);
        $model->save();

        return response()->json($this->statusPayload($user, 'client', $model->fresh()));
    }

    public function clientNeeds(ClientNeedsRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        if (($validated['hiring_for_team'] ?? null) !== 'yes') {
            $validated['hiring_business_name'] = null;
            $validated['hiring_role'] = null;
        }

        $model = UhClientOnboarding::updateOrCreate(
            ['uh_user_id' => $user->uh_user_id],
            [
                'onboarding_role' => 'client',
                'needs_categories_json' => $validated['categories'],
                'avg_project_budget' => $validated['avg_project_budget'],
                'expected_frequency' => $validated['expected_frequency'],
                'hiring_for_team' => $validated['hiring_for_team'],
                'hiring_business_name' => $validated['hiring_business_name'] ?? null,
                'hiring_role' => $validated['hiring_role'] ?? null,
            ]
        );

        $model->current_step = max((int) $model->current_step, 4);
        $model->save();

        return response()->json($this->statusPayload($user, 'client', $model->fresh()));
    }

    public function clientBusinessDetails(ClientBusinessDetailsRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();
        $isPersonal = (bool) ($validated['is_personal_account'] ?? false);

        if ($isPersonal) {
            $validated['business_name'] = null;
            $validated['employees'] = null;
            $validated['business_industry'] = null;
            $validated['other_industry'] = null;
            $validated['website'] = null;
            $validated['tax_id'] = null;
            $validated['country'] = null;
            $validated['state'] = null;
            $validated['city'] = null;
        } elseif (($validated['business_industry'] ?? null) !== 'Other') {
            $validated['other_industry'] = null;
        }

        $model = UhClientOnboarding::updateOrCreate(
            ['uh_user_id' => $user->uh_user_id],
            array_merge(['onboarding_role' => 'client'], $validated)
        );

        $model->current_step = max((int) $model->current_step, 5);
        $model->save();

        return response()->json($this->statusPayload($user, 'client', $model->fresh()));
    }

    public function getFreelancer(Request $request): JsonResponse
    {
        $user = $request->user();
        $record = UhFreelancerOnboarding::where('uh_user_id', $user->uh_user_id)->first();

        return response()->json($this->statusPayload($user, 'creator', $record));
    }

    public function freelancerWorkType(FreelancerWorkTypeRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        if (($validated['work_type'] ?? null) !== 'team') {
            $validated['team_industry'] = null;
            $validated['team_build_plan'] = null;
        }

        $model = UhFreelancerOnboarding::updateOrCreate(
            ['uh_user_id' => $user->uh_user_id],
            array_merge(['onboarding_role' => 'creator'], $validated)
        );

        $model->current_step = max((int) $model->current_step, 2);
        $model->save();

        return response()->json($this->statusPayload($user, 'creator', $model->fresh()));
    }

    public function freelancerGoals(FreelancerGoalsRequest $request): JsonResponse
    {
        $user = $request->user();

        $model = UhFreelancerOnboarding::updateOrCreate(
            ['uh_user_id' => $user->uh_user_id],
            [
                'onboarding_role' => 'creator',
                'goals_json' => $request->validated()['goals'],
            ]
        );

        $model->current_step = max((int) $model->current_step, 3);
        $model->save();

        return response()->json($this->statusPayload($user, 'creator', $model->fresh()));
    }

    public function freelancerSkills(FreelancerSkillsRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        if (($validated['has_portfolio'] ?? null) !== 'yes') {
            $validated['portfolio_links'] = null;
        }

        $model = UhFreelancerOnboarding::updateOrCreate(
            ['uh_user_id' => $user->uh_user_id],
            [
                'onboarding_role' => 'creator',
                'service_categories_json' => $validated['categories'],
                'primary_skill' => $validated['primary_skill'],
                'experience_level' => $validated['experience_level'],
                'rate_range' => $validated['rate_range'] ?? null,
                'has_portfolio' => $validated['has_portfolio'],
                'portfolio_links' => $validated['portfolio_links'] ?? null,
            ]
        );

        $model->current_step = max((int) $model->current_step, 4);
        $model->save();

        return response()->json($this->statusPayload($user, 'creator', $model->fresh()));
    }

    private function resolveOnboardingRecord(User $user): array
    {
        $clientRecord = UhClientOnboarding::where('uh_user_id', $user->uh_user_id)->first();
        $creatorRecord = UhFreelancerOnboarding::where('uh_user_id', $user->uh_user_id)->first();

        if ($user->role === 'client') {
            return ['client', $clientRecord];
        }

        if ($user->role === 'freelancer') {
            return ['creator', $creatorRecord];
        }

        if ($clientRecord) {
            return ['client', $clientRecord];
        }

        if ($creatorRecord) {
            return ['creator', $creatorRecord];
        }

        return ['client', null];
    }

    private function statusPayload(User $user, string $type, mixed $record): array
    {
        $completed = $record && ! is_null($record->completed_at);
        $currentStep = $record ? (int) $record->current_step : 0;

        return [
            'ok' => true,
            'uh_user_id' => $user->uh_user_id,
            'role' => $user->role,
            'onboarding_type' => $type,
            'onboarding_completed' => $completed,
            'current_step' => $currentStep,
            'next_step_route' => $completed ? '/dashboard' : '/onboarding/'.$type.'/step/'.($currentStep + 1),
            'completed_at' => $record?->completed_at,
            'data' => $record,
        ];
    }
}
