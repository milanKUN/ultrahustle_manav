<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Me\UpsertPortfolioRequest;
use App\Models\Portfolio;
use App\Models\PortfolioProject;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MePortfolioController extends Controller
{
	public function show(): JsonResponse
	{
		$user = request()->user();
		if (! $user) {
			return response()->json(['message' => 'Unauthenticated.'], 401);
		}

		$portfolio = $user->portfolio()->firstOrCreate([]);
		$portfolio->load([
			'projects' => function ($query): void {
				$query->orderBy('sort_order')->orderBy('id');
			},
			'projects.media' => function ($query): void {
				$query->orderBy('sort_order')->orderBy('id');
			},
		]);

		return response()->json([
			'portfolio' => [
				'id' => $portfolio->id,
				'user_id' => $portfolio->user_id,
				'created_at' => $portfolio->created_at,
				'updated_at' => $portfolio->updated_at,
			],
			'projects' => $this->projectsPayload($portfolio),
		]);
	}

	public function upsert(UpsertPortfolioRequest $request): JsonResponse
	{
		$user = $request->user();
		if (! $user) {
			return response()->json(['message' => 'Unauthenticated.'], 401);
		}

		$payloadProjects = (array) $request->input('projects', []);
		$deletedIds = (array) $request->input('deleted_project_ids', []);

		$portfolio = $user->portfolio()->firstOrCreate([]);

		DB::transaction(function () use ($portfolio, $payloadProjects, $deletedIds): void {
			$deletedIds = array_values(array_unique(array_map('intval', $deletedIds)));
			if (count($deletedIds) > 0) {
				$projectsToDelete = $portfolio->projects()->with('media')->whereIn('id', $deletedIds)->get();
				foreach ($projectsToDelete as $project) {
					foreach ($project->media as $media) {
						if ($media->disk && $media->path) {
							Storage::disk($media->disk)->delete($media->path);
						}
					}
					$project->delete();
				}
			}

			foreach ($payloadProjects as $item) {
				$item = is_array($item) ? $item : [];
				$projectId = isset($item['id']) ? (int) $item['id'] : null;

				$attributes = [
					'title' => (string) ($item['title'] ?? ''),
					'description' => array_key_exists('description', $item) ? ($item['description'] === null ? null : (string) $item['description']) : null,
					'cost_cents' => array_key_exists('cost_cents', $item) ? ($item['cost_cents'] === null ? null : (int) $item['cost_cents']) : null,
					'currency' => array_key_exists('currency', $item) && $item['currency'] ? strtoupper((string) $item['currency']) : 'INR',
					'sort_order' => array_key_exists('sort_order', $item) && $item['sort_order'] !== null ? (int) $item['sort_order'] : 0,
				];

				if ($projectId) {
					$project = $portfolio->projects()->whereKey($projectId)->first();
					if (! $project) {
						// Should be prevented by request validation, but keep safe.
						continue;
					}
					$project->forceFill($attributes)->save();
				} else {
					$portfolio->projects()->create($attributes);
				}
			}
		});

		$portfolio->load([
			'projects' => function ($query): void {
				$query->orderBy('sort_order')->orderBy('id');
			},
			'projects.media' => function ($query): void {
				$query->orderBy('sort_order')->orderBy('id');
			},
		]);

		return response()->json([
			'message' => 'Portfolio saved.',
			'projects' => $this->projectsPayload($portfolio),
		]);
	}

	private function projectsPayload(Portfolio $portfolio): array
	{
		/** @var \Illuminate\Support\Collection<int, PortfolioProject> $projects */
		$projects = $portfolio->projects;

		return $projects->map(function (PortfolioProject $project): array {
			return [
				'id' => $project->id,
				'portfolio_id' => $project->portfolio_id,
				'title' => $project->title,
				'description' => $project->description,
				'cost_cents' => $project->cost_cents,
				'currency' => $project->currency,
				'cover_media_id' => $project->cover_media_id,
				'sort_order' => $project->sort_order,
				'created_at' => $project->created_at,
				'updated_at' => $project->updated_at,
				'media' => $project->media->map(function ($media): array {
					$url = $media->url;
					if (! $url && $media->disk && $media->path) {
						$url = Storage::disk($media->disk)->url($media->path);
					}

					return [
						'id' => $media->id,
						'project_id' => $media->project_id,
						'type' => $media->type,
						'disk' => $media->disk,
						'path' => $media->path,
						'url' => $url,
						'mime' => $media->mime,
						'size_bytes' => $media->size_bytes,
						'is_cover' => (bool) $media->is_cover,
						'sort_order' => $media->sort_order,
						'created_at' => $media->created_at,
						'updated_at' => $media->updated_at,
					];
				})->values()->all(),
			];
		})->values()->all();
	}
}
