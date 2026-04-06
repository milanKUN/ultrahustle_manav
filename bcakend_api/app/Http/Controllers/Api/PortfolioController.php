<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Portfolio;
use App\Models\PortfolioProject;
use App\Models\PortfolioMedia;
use App\Models\Team;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class PortfolioController extends Controller
{
    /* =========================================================
     |  USER PORTFOLIO
     * ========================================================= */

    public function showUser(Request $request)
    {
        $user = $request->user();

        return $this->showPortfolio('user', $user->id);
    }

    public function syncUser(Request $request)
    {
        $user = $request->user();

        return $this->syncPortfolio($request, 'user', $user->id);
    }

    public function destroyUserProject(Request $request, $project)
    {
        $user = $request->user();

        $project = PortfolioProject::with('media')->findOrFail($project);

        return $this->destroyProjectForOwner('user', $user->id, $project);
    }

    public function destroyUserMedia(Request $request, $media)
    {
        $user = $request->user();

        $media = PortfolioMedia::with('project.media')->findOrFail($media);

        return $this->destroyMediaForOwner('user', $user->id, $media);
    }


    /* =========================================================
     |  TEAM PORTFOLIO
     * ========================================================= */

    public function showTeam(Request $request, Team $team)
    {
        $this->authorizeTeamAccess($request->user(), $team);

        return $this->showPortfolio('team', $team->id);
    }

    public function syncTeam(Request $request, Team $team)
    {
        $this->authorizeTeamAccess($request->user(), $team);

        return $this->syncPortfolio($request, 'team', $team->id);
    }

    public function destroyTeamProject(Request $request, Team $team, $projectId)
    {
        $this->authorizeTeamAccess($request->user(), $team);

        $project = PortfolioProject::with('media')->findOrFail($projectId);

        return $this->destroyProjectForOwner('team', $team->id, $project);
    }

    public function destroyTeamMedia(Request $request, Team $team, $mediaId)
    {
        $this->authorizeTeamAccess($request->user(), $team);

        $media = PortfolioMedia::with('project.media')->findOrFail($mediaId);

        return $this->destroyMediaForOwner('team', $team->id, $media);
    }

    /* =========================================================
     |  SHARED LOGIC
     * ========================================================= */

    protected function getOrCreatePortfolio(string $ownerType, int $ownerId): Portfolio
    {
        return Portfolio::firstOrCreate([
            'owner_type' => $ownerType,
            'owner_id'   => $ownerId,
        ]);
    }

    protected function showPortfolio(string $ownerType, int $ownerId)
    {
        $portfolio = $this->getOrCreatePortfolio($ownerType, $ownerId);

        $projects = PortfolioProject::with(['media', 'coverMedia'])
            ->where('portfolio_id', $portfolio->id)
            ->orderBy('sort_order')
            ->get()
            ->map(function ($project) {
                return $this->transformProject($project);
            });

        return response()->json([
            'portfolio' => $portfolio,
            'projects'  => $projects,
        ]);
    }

    public function showTeamPublic(string $username)
    {
        $team = Team::where('username', $username)->firstOrFail();

        return $this->showPortfolio('team', $team->id);
    }

    public function showUserPublic(string $username)
    {
        $user = User::whereRaw('LOWER(username) = ?', [strtolower($username)])
            ->firstOrFail();

        return $this->showPortfolio('user', $user->id);
    }

    protected function syncPortfolio(Request $request, string $ownerType, int $ownerId)
    {
        $portfolio = $this->getOrCreatePortfolio($ownerType, $ownerId);

        $projects = $request->input('projects', []);

        DB::beginTransaction();

        try {
            $existingIds = PortfolioProject::where('portfolio_id', $portfolio->id)
                ->pluck('id')
                ->toArray();

            $submittedIds = [];
            $sortOrder = 0;

            foreach ($projects as $index => $item) {
                $incomingProjectId = $item['id'] ?? $item['serverId'] ?? null;

                $title = trim($item['title'] ?? '');
                $description = trim($item['description'] ?? ($item['desc'] ?? ''));
                $costRaw = $item['cost_cents'] ?? ($item['cost'] ?? null);
                $currency = $item['currency'] ?? 'USD';

                $hasTextData = $title !== '' || $description !== '' || ($costRaw !== null && $costRaw !== '');

                // Check if frontend sent any new uploaded files for this card
                $hasUploadedFiles = $request->hasFile("projects.$index.files") &&
                    count($request->file("projects.$index.files")) > 0;

                // Check if existing project already has saved media in DB
                $existingMediaCount = 0;
                if (!empty($incomingProjectId)) {
                    $existingMediaCount = PortfolioMedia::where('project_id', $incomingProjectId)->count();
                }

                $hasAnyMedia = $hasUploadedFiles || $existingMediaCount > 0;

                // FINAL RULE:
                // Skip this card completely if it has no data and no media
                if (!$hasTextData && !$hasAnyMedia) {
                    continue;
                }

                $project = null;

                if (!empty($incomingProjectId)) {
                    $project = PortfolioProject::where('portfolio_id', $portfolio->id)
                        ->where('id', $incomingProjectId)
                        ->first();
                }

                if (!$project) {
                    $project = new PortfolioProject();
                    $project->portfolio_id = $portfolio->id;
                }

                $project->title = $title;
                $project->description = $description !== '' ? $description : null;
                $project->cost_cents = ($costRaw !== null && $costRaw !== '') ? (int) $costRaw : null;
                $project->currency = $currency;
                $project->sort_order = $sortOrder;
                $project->save();

                $submittedIds[] = $project->id;

                /* -----------------------------
                | Upload files for this project
                | projects.{index}.files[]
                * ----------------------------- */
                if ($request->hasFile("projects.$index.files")) {
                    $files = $request->file("projects.$index.files");
                    $coverMediaId = $project->cover_media_id;

                    $existingMediaCountForSort = PortfolioMedia::where('project_id', $project->id)->count();

                    foreach ($files as $fileIndex => $file) {
                        $path = $file->store("portfolio/{$ownerType}/{$ownerId}", 'public');

                        $media = PortfolioMedia::create([
                            'project_id' => $project->id,
                            'path'       => $path,
                            'disk'       => 'public',
                            'type'       => str_starts_with($file->getMimeType(), 'video/') ? 'video' : 'image',
                            'sort_order' => $existingMediaCountForSort + $fileIndex,
                        ]);

                        if (!$coverMediaId) {
                            $coverMediaId = $media->id;
                        }
                    }

                    if ($coverMediaId) {
                        $project->cover_media_id = $coverMediaId;
                        $project->save();
                    }
                }

                $sortOrder++;
            }

            /* -----------------------------
            | Delete removed projects
            * ----------------------------- */
            $toDelete = array_diff($existingIds, $submittedIds);

            if (!empty($toDelete)) {
                $projectsToDelete = PortfolioProject::with('media')
                    ->whereIn('id', $toDelete)
                    ->get();

                foreach ($projectsToDelete as $projectToDelete) {
                    $this->deleteProjectWithMedia($projectToDelete);
                }
            }

            DB::commit();

            $freshProjects = PortfolioProject::with(['media', 'coverMedia'])
                ->where('portfolio_id', $portfolio->id)
                ->orderBy('sort_order')
                ->get()
                ->map(function ($project) {
                    return $this->transformProject($project);
                });

            return response()->json([
                'message'   => ucfirst($ownerType) . ' portfolio updated successfully',
                'portfolio' => $portfolio,
                'projects'  => $freshProjects,
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);

            return response()->json([
                'message' => 'Failed to save portfolio',
                'error'   => $e->getMessage(),
            ], 422);
        }
    }

    protected function destroyProjectForOwner(string $ownerType, int $ownerId, PortfolioProject $project)
    {
        $portfolio = Portfolio::where('owner_type', $ownerType)
            ->where('owner_id', $ownerId)
            ->firstOrFail();

        abort_if((int) $project->portfolio_id !== (int) $portfolio->id, 403, 'Unauthorized project access.');

        $this->deleteProjectWithMedia($project);

        return response()->json([
            'message' => 'Project deleted successfully',
        ]);
    }

    protected function destroyMediaForOwner(string $ownerType, int $ownerId, PortfolioMedia $media)
    {
        $portfolio = Portfolio::where('owner_type', $ownerType)
            ->where('owner_id', $ownerId)
            ->firstOrFail();

        $project = $media->project;

        abort_if(!$project || (int) $project->portfolio_id !== (int) $portfolio->id, 403, 'Unauthorized media access.');

        $wasCover = (int) $project->cover_media_id === (int) $media->id;

        if ($media->path) {
            Storage::disk($media->disk ?: 'public')->delete($media->path);
        }

        $media->delete();

        if ($wasCover) {
            $newCover = $project->media()->orderBy('sort_order')->first();
            $project->cover_media_id = $newCover?->id;
            $project->save();
        }

        return response()->json([
            'message' => 'Media deleted successfully',
        ]);
    }

    protected function deleteProjectWithMedia(PortfolioProject $project): void
    {
        $project->loadMissing('media');

        foreach ($project->media as $media) {
            if ($media->path) {
                Storage::disk($media->disk ?: 'public')->delete($media->path);
            }

            $media->delete();
        }

        $project->delete();
    }

    protected function transformProject(PortfolioProject $project): array
    {
        $project->loadMissing(['media', 'coverMedia']);

        return [
            'id' => $project->id,
            'portfolio_id' => $project->portfolio_id,
            'title' => $project->title,
            'description' => $project->description,
            'cost_cents' => $project->cost_cents,
            'currency' => $project->currency,
            'sort_order' => $project->sort_order,
            'cover_media_id' => $project->cover_media_id,
            'cover_media' => $project->coverMedia ? [
                'id'   => $project->coverMedia->id,
                'path' => $project->coverMedia->path,
                'url'  => $this->storageUrl($project->coverMedia->path),
                'type' => $project->coverMedia->type,
            ] : null,
            'media' => $project->media->map(function ($media) {
                return [
                    'id'   => $media->id,
                    'path' => $media->path,
                    'url'  => $this->storageUrl($media->path),
                    'type' => $media->type,
                    'sort_order' => $media->sort_order,
                ];
            })->values(),
        ];
    }

    protected function storageUrl(?string $path): ?string
    {
        if (!$path) return null;
        return asset('storage/' . ltrim($path, '/'));
    }

    /**
     * Adjust this if your Team model uses a different ownership relation.
     */
    protected function authorizeTeamAccess($user, Team $team): void
    {
        if ((int) $team->owner_user_id === (int) $user->id) {
            return;
        }

        abort(403, 'You are not allowed to manage this team portfolio.');
    }
}