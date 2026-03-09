<?php

namespace Tests\Feature;

use App\Models\Portfolio;
use App\Models\PortfolioMedia;
use App\Models\PortfolioProject;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MePortfolioTest extends TestCase
{
	use RefreshDatabase;

	public function test_auth_required_returns_401(): void
	{
		$this->getJson('/api/v1/me/portfolio')
			->assertStatus(401)
			->assertJson(['message' => 'Unauthenticated.']);

		$this->putJson('/api/v1/me/portfolio', [
			'projects' => [],
		])
			->assertStatus(401)
			->assertJson(['message' => 'Unauthenticated.']);
	}

	public function test_save_portfolio_creates_updates_and_deletes_projects(): void
	{
		$user = User::factory()->create();
		Sanctum::actingAs($user);

		$response = $this->putJson('/api/v1/me/portfolio', [
			'projects' => [
				[
					'title' => 'Project A',
					'description' => 'Desc A',
					'cost_cents' => 2500,
					'currency' => 'INR',
					'sort_order' => 0,
				],
				[
					'title' => 'Project B',
					'description' => 'Desc B',
					'cost_cents' => null,
					'currency' => 'INR',
					'sort_order' => 1,
				],
			],
		]);

		$response
			->assertOk()
			->assertJson(['message' => 'Portfolio saved.'])
			->assertJsonCount(2, 'projects');

		$projectIds = collect($response->json('projects'))->pluck('id')->all();
		$this->assertCount(2, $projectIds);

		$this->assertDatabaseHas('portfolios', ['user_id' => $user->id]);
		$this->assertDatabaseHas('portfolio_projects', ['id' => $projectIds[0], 'title' => 'Project A']);
		$this->assertDatabaseHas('portfolio_projects', ['id' => $projectIds[1], 'title' => 'Project B']);

		$updateResponse = $this->putJson('/api/v1/me/portfolio', [
			'projects' => [
				[
					'id' => $projectIds[0],
					'title' => 'Project A (Updated)',
					'description' => 'Desc A2',
					'cost_cents' => 999,
					'currency' => 'INR',
					'sort_order' => 0,
				],
			],
			'deleted_project_ids' => [$projectIds[1]],
		]);

		$updateResponse
			->assertOk()
			->assertJson(['message' => 'Portfolio saved.'])
			->assertJsonCount(1, 'projects');

		$this->assertDatabaseHas('portfolio_projects', ['id' => $projectIds[0], 'title' => 'Project A (Updated)']);
		$this->assertDatabaseMissing('portfolio_projects', ['id' => $projectIds[1]]);
	}

	public function test_upload_media_attaches_to_project_and_sets_cover(): void
	{
		Storage::fake('public');

		$user = User::factory()->create();
		$portfolio = Portfolio::create(['user_id' => $user->id]);
		$project = PortfolioProject::create([
			'portfolio_id' => $portfolio->id,
			'title' => 'Project',
			'description' => null,
			'cost_cents' => null,
			'currency' => 'INR',
			'sort_order' => 0,
		]);

		Sanctum::actingAs($user);

		$file1 = UploadedFile::fake()->create('one.jpg', 10, 'image/jpeg');
		$file2 = UploadedFile::fake()->create('two.jpg', 10, 'image/jpeg');

		$response = $this->postJson("/api/v1/me/portfolio/projects/{$project->id}/media", [
			'files' => [$file1, $file2],
			'cover_index' => 1,
		]);

		$response
			->assertOk()
			->assertJson(['message' => 'Media uploaded.'])
			->assertJsonCount(2, 'media');

		$media = PortfolioMedia::where('project_id', $project->id)->orderBy('id')->get();
		$this->assertCount(2, $media);

		$project->refresh();
		$this->assertNotNull($project->cover_media_id);
		$this->assertSame($media[1]->id, $project->cover_media_id);
		$this->assertTrue((bool) $media[1]->fresh()->is_cover);

		Storage::disk('public')->assertExists($media[0]->path);
		Storage::disk('public')->assertExists($media[1]->path);
	}

	public function test_user_cannot_modify_another_users_project_or_media(): void
	{
		Storage::fake('public');

		$owner = User::factory()->create();
		$attacker = User::factory()->create();

		$portfolio = Portfolio::create(['user_id' => $owner->id]);
		$project = PortfolioProject::create([
			'portfolio_id' => $portfolio->id,
			'title' => 'Owners Project',
			'description' => null,
			'cost_cents' => null,
			'currency' => 'INR',
			'sort_order' => 0,
		]);

		$media = PortfolioMedia::create([
			'project_id' => $project->id,
			'type' => 'image',
			'disk' => 'public',
			'path' => 'portfolio/test.jpg',
			'url' => null,
			'mime' => 'image/jpeg',
			'size_bytes' => 123,
			'is_cover' => false,
			'sort_order' => 0,
		]);

		Sanctum::actingAs($attacker);

		$this->deleteJson("/api/v1/me/portfolio/projects/{$project->id}")
			->assertStatus(404);

		$this->deleteJson("/api/v1/me/portfolio/media/{$media->id}")
			->assertStatus(404);
	}
}
