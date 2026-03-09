<?php

namespace App\Http\Requests\Onboarding;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClientNeedsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'categories' => ['required', 'array', 'min:1'],
            'categories.*' => ['required', 'string', Rule::in([
                'design',
                'development',
                'marketing',
                'writing',
                'illustration',
                'video',
                'data-ai',
                'music',
            ])],
            'avg_project_budget' => ['required', 'string', 'max:50'],
            'expected_frequency' => ['required', Rule::in(['once', 'monthly', 'weekly'])],
            'hiring_for_team' => ['required', Rule::in(['yes', 'no'])],
            'hiring_business_name' => ['required_if:hiring_for_team,yes', 'nullable', 'string', 'max:191'],
            'hiring_role' => ['required_if:hiring_for_team,yes', 'nullable', 'string', 'max:191'],
        ];
    }
}
