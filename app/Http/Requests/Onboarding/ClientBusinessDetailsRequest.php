<?php

namespace App\Http\Requests\Onboarding;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClientBusinessDetailsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $requiresBusiness = ! $this->boolean('is_personal_account');

        return [
            'is_personal_account' => ['required', 'boolean'],
            'business_name' => [Rule::requiredIf($requiresBusiness), 'nullable', 'string', 'max:191'],
            'employees' => [Rule::requiredIf($requiresBusiness), 'nullable', 'integer', 'min:0'],
            'business_industry' => [Rule::requiredIf($requiresBusiness), 'nullable', Rule::in([
                'Technology',
                'Marketing',
                'Design',
                'Education',
                'Healthcare',
                'Finance',
                'Ecommerce',
                'Media',
                'Other',
            ])],
            'other_industry' => ['required_if:business_industry,Other', 'nullable', 'string', 'max:191'],
            'website' => ['nullable', 'url', 'max:255'],
            'tax_id' => ['nullable', 'string', 'max:64'],
            'country' => [Rule::requiredIf($requiresBusiness), 'nullable', 'string', 'max:64'],
            'state' => [Rule::requiredIf($requiresBusiness), 'nullable', 'string', 'max:64'],
            'city' => [Rule::requiredIf($requiresBusiness), 'nullable', 'string', 'max:64'],
        ];
    }
}
