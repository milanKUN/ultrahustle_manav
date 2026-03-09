<?php

namespace App\Http\Requests\Me;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rules\Password;

class UpdatePasswordRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'current_password' => ['required', 'string'],
			'password' => [
				'required',
				'string',
				Password::min(8),
				'confirmed',
				'different:current_password',
			],
			'password_confirmation' => ['required', 'string'],
		];
	}

	protected function failedValidation(Validator $validator): void
	{
		throw new HttpResponseException(response()->json([
			'message' => 'The given data was invalid.',
			'errors' => $validator->errors()->toArray(),
		], 422));
	}
}
