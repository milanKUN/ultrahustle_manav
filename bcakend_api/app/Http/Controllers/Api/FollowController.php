<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FollowController extends Controller
{
    public function follow(Request $request, int $id): JsonResponse
    {
        /** @var User $authUser */
        $authUser = $request->user();

        if ((int) $authUser->id === (int) $id) {
            return $this->errorResponse('You cannot follow yourself.', [], 422);
        }

        $target = User::query()->select('id')->find($id);
        if (! $target) {
            return $this->errorResponse('User not found.', [], 404);
        }

        $exists = DB::table('user_follows')
            ->where('follower_id', $authUser->id)
            ->where('following_id', $id)
            ->exists();

        if ($exists) {
            return $this->errorResponse('Already following this user.', [], 409);
        }

        try {
            DB::table('user_follows')->insert([
                'follower_id' => $authUser->id,
                'following_id' => $id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } catch (\Throwable $e) {
            // Unique constraint can still be hit under concurrent requests.
            report($e);

            return $this->errorResponse('Unable to follow right now.', $this->exceptionPayload($e), 500);
        }

        return $this->successResponse('Followed successfully.', [
            'follower_id' => $authUser->id,
            'following_id' => $id,
        ]);
    }

    public function unfollow(Request $request, int $id): JsonResponse
    {
        /** @var User $authUser */
        $authUser = $request->user();

        if ((int) $authUser->id === (int) $id) {
            return $this->successResponse('You are not following yourself.', [
                'unfollowed' => false,
            ]);
        }

        $target = User::query()->select('id')->find($id);
        if (! $target) {
            return $this->errorResponse('User not found.', [], 404);
        }

        $deleted = DB::table('user_follows')
            ->where('follower_id', $authUser->id)
            ->where('following_id', $id)
            ->delete();

        return $this->successResponse($deleted ? 'Unfollowed successfully.' : 'You were not following this user.', [
            'unfollowed' => (bool) $deleted,
            'follower_id' => $authUser->id,
            'following_id' => $id,
        ]);
    }

    public function removeFollower(Request $request, int $id): JsonResponse
    {
        /** @var User $authUser */
        $authUser = $request->user();

        if ((int) $authUser->id === (int) $id) {
            return $this->successResponse('Nothing to remove.', [
                'removed' => false,
            ]);
        }

        $target = User::query()->select('id')->find($id);
        if (! $target) {
            return $this->errorResponse('User not found.', [], 404);
        }

        $deleted = DB::table('user_follows')
            ->where('follower_id', $id)
            ->where('following_id', $authUser->id)
            ->delete();

        return $this->successResponse($deleted ? 'Follower removed.' : 'This user is not in your followers list.', [
            'removed' => (bool) $deleted,
            'follower_id' => $id,
            'following_id' => $authUser->id,
        ]);
    }

    public function followers(Request $request, int $id): JsonResponse
    {
        $authId = (int) $request->user()->id;

        $target = User::query()->select('id', 'uh_user_id')->find($id);
        if (! $target) {
            return $this->errorResponse('User not found.', [], 404);
        }

        $perPage = (int) $request->integer('per_page', 20);
        if ($perPage < 1) {
            $perPage = 1;
        }
        if ($perPage > 50) {
            $perPage = 50;
        }

        $search = trim((string) $request->query('search', ''));

        $query = User::query()
            ->join('user_follows', 'user_follows.follower_id', '=', 'users.id')
            ->leftJoin('user_personal_info as upi', function ($join) {
                $join->on('upi.uh_user_id', '=', 'users.uh_user_id')
                    ->whereNull('upi.deleted_at');
            })
            ->where('user_follows.following_id', $id)
            ->select([
                'users.id',
                'users.full_name',
                'users.uh_user_id',
                'upi.username as username',
                'upi.avatar_path as avatar_path',
            ])
            ->selectRaw(
                'exists(select 1 from user_follows uf2 where uf2.follower_id = ? and uf2.following_id = users.id) as is_following_back',
                [$authId]
            )
            ->orderByDesc('user_follows.id');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $like = '%'.$search.'%';
                $q->where('users.full_name', 'like', $like)
                    ->orWhere('upi.username', 'like', $like);
            });
        }

        $paginator = $query->paginate($perPage);

        $items = collect($paginator->items())->map(function ($row) {
            $avatar = null;
            if (! empty($row->avatar_path)) {
                $avatar = url('/storage/'.ltrim((string) $row->avatar_path, '/'));
            }

            return [
                'id' => (int) $row->id,
                'name' => $row->full_name,
                'username' => $row->username,
                'avatar' => $avatar,
                'is_following_back' => (bool) $row->is_following_back,
            ];
        })->values()->all();

        $totalFollowers = DB::table('user_follows')->where('following_id', $id)->count();

        return $this->successResponse('Followers fetched.', [
            'total' => (int) $totalFollowers,
            'items' => $items,
            'pagination' => $this->paginationPayload($paginator),
        ]);
    }

    public function following(Request $request, int $id): JsonResponse
    {
        $authId = (int) $request->user()->id;

        $target = User::query()->select('id', 'uh_user_id')->find($id);
        if (! $target) {
            return $this->errorResponse('User not found.', [], 404);
        }

        $perPage = (int) $request->integer('per_page', 20);
        if ($perPage < 1) {
            $perPage = 1;
        }
        if ($perPage > 50) {
            $perPage = 50;
        }

        $search = trim((string) $request->query('search', ''));

        $query = User::query()
            ->join('user_follows', 'user_follows.following_id', '=', 'users.id')
            ->leftJoin('user_personal_info as upi', function ($join) {
                $join->on('upi.uh_user_id', '=', 'users.uh_user_id')
                    ->whereNull('upi.deleted_at');
            })
            ->where('user_follows.follower_id', $id)
            ->select([
                'users.id',
                'users.full_name',
                'users.uh_user_id',
                'upi.username as username',
                'upi.avatar_path as avatar_path',
            ])
            ->selectRaw(
                'exists(select 1 from user_follows uf2 where uf2.follower_id = ? and uf2.following_id = users.id) as is_followed_by_auth_user',
                [$authId]
            )
            ->orderByDesc('user_follows.id');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $like = '%'.$search.'%';
                $q->where('users.full_name', 'like', $like)
                    ->orWhere('upi.username', 'like', $like);
            });
        }

        $paginator = $query->paginate($perPage);

        $items = collect($paginator->items())->map(function ($row) {
            $avatar = null;
            if (! empty($row->avatar_path)) {
                $avatar = url('/storage/'.ltrim((string) $row->avatar_path, '/'));
            }

            return [
                'id' => (int) $row->id,
                'name' => $row->full_name,
                'username' => $row->username,
                'avatar' => $avatar,
                'is_followed_by_auth_user' => (bool) $row->is_followed_by_auth_user,
            ];
        })->values()->all();

        $totalFollowing = DB::table('user_follows')->where('follower_id', $id)->count();

        return $this->successResponse('Following fetched.', [
            'total' => (int) $totalFollowing,
            'items' => $items,
            'pagination' => $this->paginationPayload($paginator),
        ]);
    }

    public function counts(Request $request, int $id): JsonResponse
    {
        $target = User::query()->select('id')->find($id);
        if (! $target) {
            return $this->errorResponse('User not found.', [], 404);
        }

        $followersCount = DB::table('user_follows')->where('following_id', $id)->count();
        $followingCount = DB::table('user_follows')->where('follower_id', $id)->count();

        return $this->successResponse('Follow counts fetched.', [
            'followers_count' => (int) $followersCount,
            'following_count' => (int) $followingCount,
        ]);
    }

    private function successResponse(string $message, array $data = [], int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    private function errorResponse(string $message, array $errors = [], int $statusCode = 400): JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }

    private function paginationPayload($paginator): array
    {
        return [
            'current_page' => $paginator->currentPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
            'last_page' => $paginator->lastPage(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
        ];
    }

    private function exceptionPayload(\Throwable $e): array
    {
        if (! config('app.debug')) {
            return [];
        }

        return [
            'exception' => class_basename($e),
            'error' => $e->getMessage(),
        ];
    }
}
