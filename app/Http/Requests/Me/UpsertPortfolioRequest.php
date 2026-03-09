<?php

namespace App\Http\Requests\Me;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\DB;

class UpsertPortfolioRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		$userId = $this->user()?->id;

		return [
			'projects' => ['required', 'array', 'max:20'],
			'projects.*.id' => [
				'nullable',
				'integer',
				function (string $attribute, mixed $value, \Closure $fail) use ($userId): void {
					if (! $value || ! $userId) {
						return;
					}

					$exists = DB::table('portfolio_projects')
						->join('portfolios', 'portfolio_projects.portfolio_id', '=', 'portfolios.id')
						->where('portfolio_projects.id', (int) $value)
						->where('portfolios.user_id', (int) $userId)
						->exists();

					if (! $exists) {
						$fail('The selected project is invalid.');
					}
				},
			],
			'projects.*.title' => ['required', 'string', 'max:120'],
			'projects.*.description' => ['nullable', 'string', 'max:150'],
			'projects.*.cost_cents' => ['nullable', 'integer', 'min:0'],
			'projects.*.currency' => ['nullable', 'string', 'size:3'],
			'projects.*.sort_order' => ['nullable', 'integer', 'min:0'],

			'deleted_project_ids' => ['sometimes', 'array'],
			'deleted_project_ids.*' => [
				'integer',
				function (string $attribute, mixed $value, \Closure $fail) use ($userId): void {
					if (! $userId) {
						$fail('Unauthenticated.');
						return;
					}

					$exists = DB::table('portfolio_projects')
						->join('portfolios', 'portfolio_projects.portfolio_id', '=', 'portfolios.id')
						->where('portfolio_projects.id', (int) $value)
						->where('portfolios.user_id', (int) $userId)
						->exists();

					if (! $exists) {
						$fail('The selected project is invalid.');
					}
				},
			],
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
