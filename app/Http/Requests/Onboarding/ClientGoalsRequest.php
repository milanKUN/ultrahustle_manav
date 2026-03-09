<?php

namespace App\Http\Requests\Onboarding;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClientGoalsRequest extends FormRequest
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
                'hire-talent',
                'buy-products',
                'join-webinars',
                'team-longterm',
                'explore-ai',
                'take-course',
                'manage-products',
            ])],
        ];
    }
}
