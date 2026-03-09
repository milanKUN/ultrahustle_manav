<?php

namespace App\Http\Requests\PersonalInfo;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class PatchPersonalInfoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $input = $this->all();

        unset($input['uh_user_id']);

        if (array_key_exists('first_name', $input)) {
            $input['first_name'] = $this->normalizeOptionalString($input['first_name']);
        }
        if (array_key_exists('last_name', $input)) {
            $input['last_name'] = $this->normalizeOptionalString($input['last_name']);
        }

        if (array_key_exists('username', $input)) {
            $input['username'] = $this->normalizeOptionalString($input['username']);
            if (! is_null($input['username'])) {
                $input['username'] = strtolower($input['username']);
            }
        }

        if (array_key_exists('contact_email', $input)) {
            $input['contact_email'] = $this->normalizeOptionalString($input['contact_email']);
            if (! is_null($input['contact_email'])) {
                $input['contact_email'] = strtolower($input['contact_email']);
            }
        }

        if (array_key_exists('phone_country', $input)) {
            $input['phone_country'] = $this->normalizeOptionalString($input['phone_country']);
            if (! is_null($input['phone_country'])) {
                $input['phone_country'] = strtoupper($input['phone_country']);
            }
        }
        if (array_key_exists('phone_country_code', $input)) {
            $input['phone_country_code'] = $this->normalizeOptionalString($input['phone_country_code']);
        }
        if (array_key_exists('phone_number', $input)) {
            $input['phone_number'] = $this->normalizeOptionalString($input['phone_number']);
        }

        if (array_key_exists('gender', $input)) {
            $input['gender'] = $this->normalizeOptionalString($input['gender']);
        }
        if (array_key_exists('availability', $input)) {
            $input['availability'] = $this->normalizeOptionalString($input['availability']);
        }

        foreach (['street', 'city', 'state', 'country', 'pincode', 'title', 'short_bio', 'about'] as $field) {
            if (array_key_exists($field, $input)) {
                $input[$field] = $this->normalizeOptionalString($input[$field]);
            }
        }

        if (array_key_exists('date_of_birth', $input)) {
            $input['date_of_birth'] = $this->normalizeOptionalString($input['date_of_birth']);
        }

        if (array_key_exists('hashtags', $input)) {
            $input['hashtags'] = $this->normalizeStringArray($input['hashtags'], 50, 50);
        }
        if (array_key_exists('skills', $input)) {
            $input['skills'] = $this->normalizeStringArray($input['skills'], 50, 50);
        }
        if (array_key_exists('tools', $input)) {
            $input['tools'] = $this->normalizeStringArray($input['tools'], 50, 50);
        }
        if (array_key_exists('languages', $input)) {
            $input['languages'] = $this->normalizeStringArray($input['languages'], 50, 50);
        }

        $this->replace($input);
    }

    public function rules(): array
    {
        return [
            'first_name' => ['sometimes', 'nullable', 'string', 'min:1', 'max:50', 'regex:/^[\pL\s-]+$/u'],
            'last_name' => ['sometimes', 'nullable', 'string', 'min:1', 'max:50', 'regex:/^[\pL\s-]+$/u'],

            'username' => ['sometimes', 'nullable', 'string', 'min:3', 'max:30', 'regex:/^[a-z0-9_]+$/'],

            'date_of_birth' => [
                'sometimes',
                'nullable',
                'date_format:Y-m-d',
                'before:today',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (! $value) {
                        return;
                    }

                    try {
                        $dob = Carbon::createFromFormat('Y-m-d', (string) $value)->startOfDay();
                    } catch (\Throwable) {
                        return;
                    }

                    $minDob = now()->subYears(13)->startOfDay();
                    if ($dob->greaterThan($minDob)) {
                        $fail('Must be at least 13 years old.');
                    }
                },
            ],

            'contact_email' => ['sometimes', 'nullable', 'string', 'email', 'max:254'],

            'phone_country' => ['sometimes', 'nullable', 'string', 'size:2', 'regex:/^[A-Z]{2}$/'],
            'phone_country_code' => ['sometimes', 'nullable', 'string', 'max:8', 'regex:/^\+\d{1,7}$/'],
            'phone_number' => ['sometimes', 'nullable', 'string', 'max:20', 'regex:/^\d{7,15}$/'],

            'gender' => ['sometimes', 'nullable', 'in:male,female,other'],

            'street' => ['sometimes', 'nullable', 'string', 'max:120'],
            'city' => ['sometimes', 'nullable', 'string', 'max:80'],
            'state' => ['sometimes', 'nullable', 'string', 'max:80'],
            'country' => ['sometimes', 'nullable', 'string', 'max:80'],
            'pincode' => ['sometimes', 'nullable', 'string', 'max:12', 'regex:/^\d{4,12}$/'],

            'title' => ['sometimes', 'nullable', 'string', 'max:40'],
            'short_bio' => ['sometimes', 'nullable', 'string', 'max:160'],
            'about' => ['sometimes', 'nullable', 'string', 'max:700'],

            'availability' => ['sometimes', 'nullable', 'in:available,unavailable,working_on_a_project'],

            'hashtags' => ['sometimes', 'array', 'max:50'],
            'hashtags.*' => ['string', 'min:1', 'max:50'],
            'skills' => ['sometimes', 'array', 'max:50'],
            'skills.*' => ['string', 'min:1', 'max:50'],
            'tools' => ['sometimes', 'array', 'max:50'],
            'tools.*' => ['string', 'min:1', 'max:50'],
            'languages' => ['sometimes', 'array', 'max:50'],
            'languages.*' => ['string', 'min:1', 'max:50'],
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

    /**
     * @return list<string>
     */
    private function normalizeStringArray(mixed $value, int $maxItems, int $maxLen): array
    {
        if (is_null($value)) {
            return [];
        }

        if (! is_array($value)) {
            return [];
        }

        $result = [];
        $seen = [];

        foreach ($value as $item) {
            if (! is_string($item)) {
                continue;
            }

            $trimmed = trim($item);
            if ($trimmed === '') {
                continue;
            }

            if (mb_strlen($trimmed) > $maxLen) {
                $trimmed = mb_substr($trimmed, 0, $maxLen);
            }

            $key = mb_strtolower($trimmed);
            if (isset($seen[$key])) {
                continue;
            }

            $seen[$key] = true;
            $result[] = $trimmed;

            if (count($result) >= $maxItems) {
                break;
            }
        }

        return $result;
    }
}
