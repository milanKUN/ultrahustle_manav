<?php

namespace App\Http\Requests\Teams;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

class StoreTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $input = $this->all();

        if (! array_key_exists('name', $input) && array_key_exists('teamName', $input)) {
            $input['name'] = $input['teamName'];
        }
        if (! array_key_exists('username', $input) && array_key_exists('teamUsername', $input)) {
            $input['username'] = $input['teamUsername'];
        }
        if (! array_key_exists('what_we_do', $input) && array_key_exists('whatWeDo', $input)) {
            $input['what_we_do'] = $input['whatWeDo'];
        }

        foreach (['name', 'username', 'title', 'bio', 'about', 'what_we_do', 'category', 'availability', 'terms'] as $field) {
            if (array_key_exists($field, $input)) {
                $input[$field] = $this->normalizeOptionalString($input[$field]);
            }
        }

        if (! is_null($input['username'] ?? null)) {
            $username = (string) $input['username'];
            $username = ltrim($username, "@ \t\n\r\0\x0B");
            $input['username'] = strtolower($username);
        }

        foreach (['hashtags' => 15, 'skills' => 16, 'tools' => 10, 'languages' => 10, 'rules' => 16] as $field => $max) {
            if (array_key_exists($field, $input)) {
                $input[$field] = $this->normalizeStringArray($input[$field], $max, 50);
            }
        }

        $this->replace($input);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'min:1', 'max:50'],
            'username' => ['required', 'string', 'min:3', 'max:30', 'regex:/^[a-z0-9_]+$/'],
            'title' => ['nullable', 'string', 'max:40'],
            'bio' => ['nullable', 'string', 'max:160'],
            'about' => ['nullable', 'string', 'max:700'],
            'what_we_do' => ['nullable', 'string', 'max:700'],

            'category' => ['required', Rule::in(['Design', 'Development', 'Marketing', 'Content', 'Sales'])],
            'availability' => ['nullable', Rule::in(['Full-time', 'Part-time', 'Contract'])],
            'terms' => ['nullable', 'string'],

            'hashtags' => ['sometimes', 'array', 'max:15'],
            'hashtags.*' => ['string', 'min:1', 'max:50'],
            'skills' => ['sometimes', 'array', 'max:16'],
            'skills.*' => ['string', 'min:1', 'max:50'],
            'tools' => ['sometimes', 'array', 'max:10'],
            'tools.*' => ['string', 'min:1', 'max:50'],
            'languages' => ['sometimes', 'array', 'max:10'],
            'languages.*' => ['string', 'min:1', 'max:50'],
            'rules' => ['sometimes', 'array', 'max:16'],
            'rules.*' => ['string', 'min:1', 'max:50'],
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
