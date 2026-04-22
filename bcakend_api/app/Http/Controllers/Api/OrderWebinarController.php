<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class OrderWebinarController extends Controller
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

        if (!$listing || $listing->listing_type !== 'webinar') {
            return response()->json([
                'message' => 'Webinar order not found.'
            ], 404);
        }

        $creator = DB::table('users')
            ->where('id', $listing->user_id)
            ->first();

        $webinarDetails = Schema::hasTable('webinar_listing_details')
            ? DB::table('webinar_listing_details')->where('listing_id', $listing->id)->first()
            : null;

        $agendaRows = Schema::hasTable('webinar_listing_agendas')
            ? DB::table('webinar_listing_agendas')
                ->where('listing_id', $listing->id)
                ->orderBy('sort_order')
                ->get()
            : collect();

        $progressMap = Schema::hasTable('order_webinar_agenda_progress')
            ? DB::table('order_webinar_agenda_progress')
                ->where('order_id', $order->id)
                ->where('user_id', $user->id)
                ->pluck('watched', 'agenda_item_id')
                ->toArray()
            : [];

        $faqRows = Schema::hasTable('listing_faqs')
            ? DB::table('listing_faqs')->where('listing_id', $listing->id)->orderBy('id')->get()
            : collect();

        $resourceRows = Schema::hasTable('order_resources')
            ? DB::table('order_resources')
                ->where('order_id', $order->id)
                ->orderBy('sort_order')
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
        $keyOutcomes = [];
        $learningPoints = [];

        if ($webinarDetails) {
            $tools = [];
            $languages = json_decode($webinarDetails->languages_json ?? '[]', true) ?: [];
            $keyOutcomes = json_decode($webinarDetails->key_outcomes ?? '[]', true) ?: [];
            $learningPoints = json_decode($webinarDetails->learning_points_json ?? '[]', true) ?: [];
        }

        $agenda = $agendaRows->map(function ($row) use ($progressMap) {
            return [
                'id' => $row->id,
                'time' => $row->time,
                'duration' => $row->time,
                'topic' => $row->topic,
                'description' => $row->description,
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
            'webinar_link' => $webinarDetails->webinar_link ?? null,
            'tools' => $tools,
            'key_outcomes' => $keyOutcomes,
            'learning_points' => $learningPoints,
            'languages' => $languages,
        ];

        $orderPayload = [
            'id' => $order->id,
            'status' => $order->status ?? null,
            'webinar_date' => $webinarDetails->schedule_date ?? null,
            'start_time' => $webinarDetails->schedule_start_time ?? null,
            'timezone' => $webinarDetails->schedule_timezone ?? null,
            'timezone_display' => $webinarDetails->schedule_timezone ?? null,
            'duration_minutes' => $webinarDetails->schedule_duration ?? 60,
            'created_at' => $order->created_at ?? null,
        ];

        $orderDetailsBlocks = [
            [
                'title' => 'Your Order',
                'date' => $order->created_at ?? null,
                'items' => [
                    [
                        'name' => $listing->title,
                        'qty' => $order->quantity ?? 1,
                        'duration' => ($webinarDetails->schedule_duration ?? 60) . ' min',
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
            'agenda' => $agenda,
            'resources' => $resources,
            'faqs' => $faqPayload,
            'review' => $review ? [
                'rating' => $review->rating,
                'comment' => $review->comment,
            ] : null,
            'order_details_blocks' => $orderDetailsBlocks,
        ]);
    }

    public function toggleAgenda(Request $request, int $orderId, int $itemId)
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

        $agendaItem = DB::table('webinar_listing_agendas')
            ->where('id', $itemId)
            ->first();

        if (!$agendaItem) {
            return response()->json([
                'message' => 'Agenda item not found.'
            ], 404);
        }

        $existing = DB::table('order_webinar_agenda_progress')
            ->where('order_id', $order->id)
            ->where('agenda_item_id', $itemId)
            ->where('user_id', $user->id)
            ->first();

        $watched = !$existing || !$existing->watched;

        DB::table('order_webinar_agenda_progress')->updateOrInsert(
            [
                'order_id' => $order->id,
                'agenda_item_id' => $itemId,
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
            'message' => $watched ? 'Agenda marked as watched.' : 'Agenda unmarked.',
            'item' => [
                'id' => $itemId,
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