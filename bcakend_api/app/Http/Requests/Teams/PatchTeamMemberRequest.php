<?php

namespace App\Http\Requests\Teams;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class PatchTeamMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $input = $this->all();

        if (array_key_exists('role', $input) && is_string($input['role'])) {
            $input['role'] = trim($input['role']);
        }
        if (array_key_exists('member_title', $input)) {
            $input['member_title'] = $this->normalizeOptionalString($input['member_title']);
        }

        $this->replace($input);
    }

    public function rules(): array
    {
        return [
            'role' => ['sometimes', 'required', Rule::in(['Owner', 'Contributor', 'Lead', 'Assistant', 'Manager'])],
            'member_title' => ['sometimes', 'nullable', 'string', 'max:60'],
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'status' => false,
            'message' => 'Validation failed.',
            'errors' => $validator->errors()->toArray(),
        ], 400));
    }

    private function normalizeOptionalString(mixed $value): ?string
    {
        if (is_null($value)) {
            return null;
        }

        if (! is_string($value)) {
            return null;
        }

        $trimmed = trim($value);

        return $trimmed === '' ? null : $trimmed;
    }
}
