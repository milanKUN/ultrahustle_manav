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
            ? DB::table('course_listing_details')
                ->where('listing_id', $listing->id)
                ->first()
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
                ->orderBy('sort_order')
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

        $tools = $this->decodeJsonArray($listing->tools_json ?? null);
        $languages = $this->decodeJsonArray($courseDetails->languages_json ?? null);
        $learningPoints = $this->decodeJsonArray($courseDetails->learning_points_json ?? null);
        $included = $this->decodeJsonArray($courseDetails->included_json ?? null);
        $prerequisites = $this->decodeJsonArray($courseDetails->prerequisites_json ?? null);

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
                'media_name' => $row->media_name ?? null,
                'media_mime' => $row->media_mime ?? null,
                'media_size' => $row->media_size ?? null,
                'watched' => (bool)($progressMap[$row->id] ?? false),
            ];
        })->values()->all();

        $resources = $resourceRows->map(function ($row) {
            $url = null;

            if ($row->resource_type === 'link') {
                $url = $row->external_url;
            } elseif (!empty($row->file_path)) {
                $url = Storage::disk('public')->url($row->file_path);
            }

            return [
                'id' => $row->id,
                'title' => $row->title,
                'type' => $row->resource_type,
                'url' => $url,
                'file_name' => $row->file_name,
                'mime_type' => $row->mime_type,
                'size_label' => $row->file_size ? $this->formatBytes((int) $row->file_size) : '—',
                'updated_at_display' => $row->updated_at ? date('M d, Y', strtotime($row->updated_at)) : '—',
                'tags' => $this->decodeJsonArray($row->tags_json ?? null),
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

        $faqPayload = $faqRows->map(function ($row) {
            return [
                'id' => $row->id,
                'question' => $row->question ?? $row->q ?? '',
                'answer' => $row->answer ?? $row->a ?? '',
            ];
        })->values()->all();

        $listingPayload = [
            'id' => $listing->id,
            'title' => $listing->title,
            'username' => $listing->username ?? null,
            'category' => $listing->category ?? null,
            'sub_category' => $listing->sub_category ?? null,
            'short_description' => $listing->short_description,
            'about' => $listing->about,
            'tags' => $this->decodeJsonArray($listing->tags_json ?? null),
            'tools' => $tools,
            'preview_video_url' => $previewVideoUrl,
            'learning_points' => $learningPoints,
            'included' => $included,
            'prerequisites' => $prerequisites,
            'languages' => $languages,
            'course_level' => $courseDetails->course_level ?? null,
            'product_type' => $courseDetails->product_type ?? null,
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

        if ((int) $lesson->listing_id !== (int) $order->listing_id) {
            return response()->json([
                'message' => 'Lesson does not belong to this order listing.'
            ], 422);
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

    private function decodeJsonArray($value): array
    {
        if (is_array($value)) {
            return array_values(array_filter($value, fn ($item) => $item !== null && $item !== ''));
        }

        if (is_string($value) && $value !== '') {
            $decoded = json_decode($value, true);
            if (is_array($decoded)) {
                return array_values(array_filter($decoded, fn ($item) => $item !== null && $item !== ''));
            }
        }

        return [];
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes <= 0) {
            return '0 B';
        }

        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $power = (int) floor(log($bytes, 1024));
        $power = min($power, count($units) - 1);

        return round($bytes / (1024 ** $power), 2) . ' ' . $units[$power];
    }
}