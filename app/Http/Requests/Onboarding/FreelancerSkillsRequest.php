<?php

namespace App\Http\Requests\Onboarding;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class FreelancerSkillsRequest extends FormRequest
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
            'primary_skill' => ['required', 'string', 'max:191'],
            'experience_level' => ['required', Rule::in(['beginner', 'intermediate', 'pro', 'expert'])],
            'rate_range' => ['nullable', 'string', 'max:50'],
            'has_portfolio' => ['required', Rule::in(['yes', 'no'])],
            'portfolio_links' => ['required_if:has_portfolio,yes', 'nullable', 'string'],
        ];
    }
}
