<?php

namespace App\Http\Requests\Teams;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class StoreTeamInviteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $input = $this->all();

        if (array_key_exists('email', $input)) {
            $email = $input['email'];
            if (is_string($email)) {
                $email = trim($email);
                $input['email'] = strtolower($email);
            }
        }
        if (array_key_exists('role', $input) && is_string($input['role'])) {
            $input['role'] = trim($input['role']);
        }
        if (array_key_exists('member_title', $input)) {
            $input['member_title'] = $this->normalizeOptionalString($input['member_title']);
        }
        if (array_key_exists('action', $input) && is_string($input['action'])) {
            $input['action'] = strtolower(trim($input['action']));
        }

        $this->replace($input);
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email', 'max:254'],
            'role' => ['required', Rule::in(['Owner', 'Contributor', 'Lead', 'Assistant', 'Manager'])],
            'member_title' => ['nullable', 'string', 'max:60'],
            'action' => ['sometimes', 'nullable', Rule::in(['send', 'resend', 'revoke'])],
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
