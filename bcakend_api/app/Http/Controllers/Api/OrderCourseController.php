<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class OrderCourseController extends Controller
{
    public function show(Request $request, int $orderId)
    {
        $user = $request->user();

        $order = DB::table('orders')
            ->where('id', $orderId)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json([
                'message' => 'Order not found.'
            ], 404);
        }

        $listing = DB::table('listings')
            ->where('id', $order->listing_id)
            ->first();

        if (!$listing || $listing->listing_type !== 'course') {
            return response()->json([
                'message' => 'Course order not found.'
            ], 404);
        }

        $creator = DB::table('users')
            ->where('id', $listing->user_id)
            ->first();

        $courseDetails = Schema::hasTable('course_listing_details')
            ? DB::table('course_listing_details')->where('listing_id', $listing->id)->first()
            : null;

        $lessonRows = Schema::hasTable('course_listing_lessons')
            ? DB::table('course_listing_lessons')
                ->where('listing_id', $listing->id)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
            : collect();

        $progressMap = Schema::hasTable('order_course_lesson_progress')
            ? DB::table('order_course_lesson_progress')
                ->where('order_id', $order->id)
                ->where('user_id', $user->id)
                ->pluck('watched', 'lesson_id')
                ->toArray()
            : [];

        $faqRows = Schema::hasTable('listing_faqs')
            ? DB::table('listing_faqs')
                ->where('listing_id', $listing->id)
                ->orderBy('id')
                ->get()
            : collect();

        $resourceRows = Schema::hasTable('order_resources')
            ? DB::table('order_resources')
                ->where('order_id', $order->id)
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get()
            : collect();

        $review = Schema::hasTable('order_reviews')
            ? DB::table('order_reviews')
                ->where('order_id', $order->id)
                ->where('user_id', $user->id)
                ->first()
            : null;

        $tools = [];
        $languages = [];
        $learningPoints = [];
        $included = [];
        $prerequisites = [];

        if ($courseDetails) {
            $tools = json_decode($courseDetails->tools_json ?? '[]', true) ?: [];
            $languages = json_decode($courseDetails->languages_json ?? '[]', true) ?: [];
            $learningPoints = json_decode($courseDetails->learning_points_json ?? '[]', true) ?: [];
            $included = json_decode($courseDetails->included_json ?? '[]', true) ?: [];
            $prerequisites = json_decode($courseDetails->prerequisites_json ?? '[]', true) ?: [];
        }

        $lessons = $lessonRows->map(function ($row, $index) use ($progressMap) {
            $mediaUrl = null;

            if (!empty($row->external_url)) {
                $mediaUrl = $row->external_url;
            } elseif (!empty($row->media_path)) {
                $mediaUrl = Storage::disk('public')->url($row->media_path);
            }

            return [
                'id' => $row->id,
                'number' => 'Lesson ' . ($index + 1),
                'title' => $row->title,
                'description' => $row->description,
                'media_type' => $row->media_type ?? 'video',
                'media_url' => $mediaUrl,
                'watched' => (bool)($progressMap[$row->id] ?? false),
            ];
        })->values()->all();

        $resources = $resourceRows->map(function ($row) {
            $url = null;

            if ($row->resource_type === 'link') {
                $url = $row->external_url;
            } elseif ($row->file_path) {
                $url = Storage::disk('public')->url($row->file_path);
            }

            return [
                'id' => $row->id,
                'title' => $row->title,
                'type' => $row->resource_type,
                'url' => $url,
                'size_label' => $row->file_size ? $this->formatBytes((int)$row->file_size) : '—',
                'updated_at_display' => $row->updated_at ? date('M d, Y', strtotime($row->updated_at)) : '—',
                'tags' => json_decode($row->tags_json ?? '[]', true) ?: [],
                'note' => $row->note,
            ];
        })->values()->all();

        $previewVideoUrl = null;
        if ($courseDetails) {
            if (!empty($courseDetails->preview_video_url)) {
                $previewVideoUrl = $courseDetails->preview_video_url;
            } elseif (!empty($courseDetails->preview_video_path)) {
                $previewVideoUrl = Storage::disk('public')->url($courseDetails->preview_video_path);
            }
        }

        $creatorPayload = [
            'username' => $creator->username ?? null,
            'full_name' => $creator->full_name ?? $creator->name ?? null,
            'avatar_url' => !empty($creator->avatar) ? Storage::disk('public')->url($creator->avatar) : null,
            'location' => $creator->location ?? null,
            'rating' => $creator->rating ?? 0,
            'review_count' => $creator->review_count ?? 0,
            'bio' => $creator->bio ?? null,
            'about' => $creator->about ?? null,
            'languages' => [],
            'skills' => [],
            'member_since' => $creator->created_at ?? null,
            'karma' => $creator->karma ?? null,
            'projects_completed' => $creator->projects_completed ?? null,
            'avg_response' => $creator->avg_response ?? null,
        ];

        $faqPayload = $faqRows->map(fn ($row) => [
            'id' => $row->id,
            'question' => $row->question ?? $row->q ?? '',
            'answer' => $row->answer ?? $row->a ?? '',
        ])->values()->all();

        $listingPayload = [
            'id' => $listing->id,
            'title' => $listing->title,
            'short_description' => $listing->short_description,
            'about' => $listing->about,
            'preview_video_url' => $previewVideoUrl,
            'tools' => $tools,
            'learning_points' => $learningPoints,
            'included' => $included,
            'prerequisites' => $prerequisites,
            'languages' => $languages,
            'course_level' => $courseDetails->course_level ?? null,
            'price' => $courseDetails->price ?? ($order->amount ?? $order->total_amount ?? 0),
        ];

        $orderPayload = [
            'id' => $order->id,
            'status' => $order->status ?? null,
            'created_at' => $order->created_at ?? null,
            'quantity' => $order->quantity ?? 1,
            'price' => $order->amount ?? $order->total_amount ?? 0,
            'subtotal' => $order->subtotal ?? $order->amount ?? $order->total_amount ?? 0,
            'service_fee' => $order->service_fee ?? 0,
            'total_amount' => $order->total_amount ?? $order->amount ?? 0,
        ];

        $orderDetailsBlocks = [
            [
                'title' => 'Your Order',
                'date' => $order->created_at ?? null,
                'items' => [
                    [
                        'name' => $listing->title,
                        'qty' => $order->quantity ?? 1,
                        'duration' => $courseDetails->course_level ?? 'Course Access',
                        'price' => $order->amount ?? $order->total_amount ?? 0,
                    ],
                ],
                'subtotal' => $order->subtotal ?? $order->amount ?? $order->total_amount ?? 0,
                'fee' => $order->service_fee ?? 0,
                'total' => $order->total_amount ?? $order->amount ?? 0,
            ],
        ];

        return response()->json([
            'order' => $orderPayload,
            'listing' => $listingPayload,
            'creator' => $creatorPayload,
            'lessons' => $lessons,
            'resources' => $resources,
            'faqs' => $faqPayload,
            'review' => $review ? [
                'rating' => $review->rating,
                'comment' => $review->comment,
            ] : null,
            'order_details_blocks' => $orderDetailsBlocks,
        ]);
    }

    public function toggleLesson(Request $request, int $orderId, int $lessonId)
    {
        $user = $request->user();

        $order = DB::table('orders')
            ->where('id', $orderId)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json([
                'message' => 'Order not found.'
            ], 404);
        }

        $lesson = DB::table('course_listing_lessons')
            ->where('id', $lessonId)
            ->first();

        if (!$lesson) {
            return response()->json([
                'message' => 'Lesson not found.'
            ], 404);
        }

        $existing = DB::table('order_course_lesson_progress')
            ->where('order_id', $order->id)
            ->where('lesson_id', $lessonId)
            ->where('user_id', $user->id)
            ->first();

        $watched = !$existing || !$existing->watched;

        DB::table('order_course_lesson_progress')->updateOrInsert(
            [
                'order_id' => $order->id,
                'lesson_id' => $lessonId,
                'user_id' => $user->id,
            ],
            [
                'watched' => $watched,
                'watched_at' => $watched ? now() : null,
                'updated_at' => now(),
                'created_at' => $existing->created_at ?? now(),
            ]
        );

        return response()->json([
            'message' => $watched ? 'Lesson marked as watched.' : 'Lesson unmarked.',
            'item' => [
                'id' => $lessonId,
                'watched' => $watched,
            ],
        ]);
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes <= 0) return '0 B';
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $power = (int) floor(log($bytes, 1024));
        $power = min($power, count($units) - 1);
        return round($bytes / (1024 ** $power), 2) . ' ' . $units[$power];
    }
}