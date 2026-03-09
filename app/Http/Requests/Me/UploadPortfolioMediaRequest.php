<?php

namespace App\Http\Requests\Me;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UploadPortfolioMediaRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'files' => ['required', 'array', 'min:1', 'max:9'],
			'files.*' => [
				'required',
				'file',
				'mimes:jpg,jpeg,png,webp,gif,mp4,mov,webm',
				'max:51200',
			],
			'cover_index' => ['nullable', 'integer', 'min:0'],
			'sort_orders' => ['nullable', 'array'],
			'sort_orders.*' => ['integer', 'min:0'],
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
