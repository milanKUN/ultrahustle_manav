<?php

namespace App\Http\Requests\Onboarding;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FreelancerWorkTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'work_type' => ['required', Rule::in(['solo', 'team'])],
            'team_industry' => ['required_if:work_type,team', 'nullable', Rule::in([
                'technology',
                'marketing',
                'design',
                'education',
                'healthcare',
                'finance',
                'ecommerce',
                'media',
                'other',
            ])],
            'team_build_plan' => ['required_if:work_type,team', 'nullable', Rule::in(['yes', 'no', 'maybe later'])],
        ];
    }
}
