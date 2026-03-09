<?php

namespace App\Http\Requests\Onboarding;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FreelancerGoalsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'goals' => ['required', 'array', 'min:1'],
            'goals.*' => ['required', 'string', Rule::in([
                'earn-services',
                'sell-digital',
                'host-webinars',
                'launch-course',
                'build-team',
                'promote-listings',
                'build-client-base',
                'ai-match',
            ])],
        ];
    }
}
