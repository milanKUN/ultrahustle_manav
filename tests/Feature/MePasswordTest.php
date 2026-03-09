<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MePasswordTest extends TestCase
{
	use RefreshDatabase;

	public function test_succeeds_with_correct_current_password(): void
	{
		$user = User::factory()->create([
			'password' => Hash::make('OldPassword123!'),
		]);

		Sanctum::actingAs($user);

		$response = $this->putJson('/api/v1/me/password', [
			'current_password' => 'OldPassword123!',
			'password' => 'NewPassword123!',
			'password_confirmation' => 'NewPassword123!',
		]);

		$response
			->assertOk()
			->assertJson([
				'message' => 'Password updated successfully.',
			]);

		$this->assertTrue(Hash::check('NewPassword123!', (string) $user->fresh()->password));
	}

	public function test_fails_with_wrong_current_password_and_returns_422_errors_shape(): void
	{
		$user = User::factory()->create([
			'password' => Hash::make('OldPassword123!'),
		]);

		Sanctum::actingAs($user);

		$response = $this->putJson('/api/v1/me/password', [
			'current_password' => 'WrongPassword123!',
			'password' => 'NewPassword123!',
			'password_confirmation' => 'NewPassword123!',
		]);

		$response
			->assertStatus(422)
			->assertJson([
				'errors' => [
					'current_password' => ['Current password is incorrect.'],
				],
			]);
	}
}
