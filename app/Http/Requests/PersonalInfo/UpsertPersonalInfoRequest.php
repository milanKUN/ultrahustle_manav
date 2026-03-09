<?php

namespace App\Http\Requests\PersonalInfo;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpsertPersonalInfoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $input = $this->all();

        unset($input['uh_user_id']);

        $input['first_name'] = $this->normalizeOptionalString($input['first_name'] ?? null);
        $input['last_name'] = $this->normalizeOptionalString($input['last_name'] ?? null);

        $input['username'] = $this->normalizeOptionalString($input['username'] ?? null);
        if (! is_null($input['username'])) {
            $input['username'] = strtolower($input['username']);
        }

        $input['contact_email'] = $this->normalizeOptionalString($input['contact_email'] ?? null);
        if (! is_null($input['contact_email'])) {
            $input['contact_email'] = strtolower($input['contact_email']);
        }

        $input['phone_country'] = $this->normalizeOptionalString($input['phone_country'] ?? null);
        if (! is_null($input['phone_country'])) {
            $input['phone_country'] = strtoupper($input['phone_country']);
        }

        $input['phone_country_code'] = $this->normalizeOptionalString($input['phone_country_code'] ?? null);
        $input['phone_number'] = $this->normalizeOptionalString($input['phone_number'] ?? null);

        $input['gender'] = $this->normalizeOptionalString($input['gender'] ?? null);
        $input['availability'] = $this->normalizeOptionalString($input['availability'] ?? null);

        $input['street'] = $this->normalizeOptionalString($input['street'] ?? null);
        $input['city'] = $this->normalizeOptionalString($input['city'] ?? null);
        $input['state'] = $this->normalizeOptionalString($input['state'] ?? null);
        $input['country'] = $this->normalizeOptionalString($input['country'] ?? null);
        $input['pincode'] = $this->normalizeOptionalString($input['pincode'] ?? null);

        $input['title'] = $this->normalizeOptionalString($input['title'] ?? null);
        $input['short_bio'] = $this->normalizeOptionalString($input['short_bio'] ?? null);
        $input['about'] = $this->normalizeOptionalString($input['about'] ?? null);

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
            'first_name' => ['nullable', 'string', 'min:1', 'max:50', 'regex:/^[\pL\s-]+$/u'],
            'last_name' => ['nullable', 'string', 'min:1', 'max:50', 'regex:/^[\pL\s-]+$/u'],

            'username' => ['nullable', 'string', 'min:3', 'max:30', 'regex:/^[a-z0-9_]+$/'],

            'date_of_birth' => [
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

            'contact_email' => ['nullable', 'string', 'email', 'max:254'],

            'phone_country' => ['nullable', 'string', 'size:2', 'regex:/^[A-Z]{2}$/'],
            'phone_country_code' => ['nullable', 'string', 'max:8', 'regex:/^\+\d{1,7}$/'],
            'phone_number' => ['nullable', 'string', 'max:20', 'regex:/^\d{7,15}$/'],

            'gender' => ['nullable', 'in:male,female,other'],

            'street' => ['nullable', 'string', 'max:120'],
            'city' => ['nullable', 'string', 'max:80'],
            'state' => ['nullable', 'string', 'max:80'],
            'country' => ['nullable', 'string', 'max:80'],
            'pincode' => ['nullable', 'string', 'max:12', 'regex:/^\d{4,12}$/'],

            'title' => ['nullable', 'string', 'max:40'],
            'short_bio' => ['nullable', 'string', 'max:160'],
            'about' => ['nullable', 'string', 'max:700'],

            'availability' => ['nullable', 'in:available,unavailable,working_on_a_project'],

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
