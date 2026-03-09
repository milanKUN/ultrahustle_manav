<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PortfolioProject;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class MePortfolioProjectController extends Controller
{
	public function destroy(int $projectId): JsonResponse
	{
		$user = request()->user();
		if (! $user) {
			return response()->json(['message' => 'Unauthenticated.'], 401);
		}

		$project = PortfolioProject::query()
			->whereKey($projectId)
			->whereHas('portfolio', fn ($q) => $q->where('user_id', $user->id))
			->with('media')
			->first();

		if (! $project) {
			return response()->json(['message' => 'Not found.'], 404);
		}

		foreach ($project->media as $media) {
			if ($media->disk && $media->path) {
				Storage::disk($media->disk)->delete($media->path);
			}
		}

		$project->delete();

		return response()->json([
			'message' => 'Project deleted.',
		]);
	}
}
