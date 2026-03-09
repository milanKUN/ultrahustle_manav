<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Me\UpdatePasswordRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class MePasswordController extends Controller
{
	public function update(UpdatePasswordRequest $request): JsonResponse
	{
		$user = $request->user();
		if (! $user) {
			return response()->json(['message' => 'Unauthenticated.'], 401);
		}

		$currentPassword = (string) $request->input('current_password');
		if (! $user->password || ! Hash::check($currentPassword, $user->password)) {
			return response()->json([
				'errors' => [
					'current_password' => ['Current password is incorrect.'],
				],
			], 422);
		}

		$user->forceFill([
			'password' => Hash::make((string) $request->input('password')),
		])->save();

		// Revoke other tokens (keep current token, if any)
		$currentToken = $user->currentAccessToken();
		if ($currentToken) {
			$user->tokens()->where('id', '!=', $currentToken->id)->delete();
		} else {
			$user->tokens()->delete();
		}

		return response()->json([
			'message' => 'Password updated successfully.',
		]);
	}
}
