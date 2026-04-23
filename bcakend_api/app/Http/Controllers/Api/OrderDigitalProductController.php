<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class OrderDigitalProductController extends Controller
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

        if (!$listing || $listing->listing_type !== 'digital_product') {
            return response()->json([
                'message' => 'Digital product order not found.'
            ], 404);
        }

        $creator = DB::table('users')
            ->where('id', $listing->user_id)
            ->first();

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

        $package = Schema::hasTable('digital_product_packages')
            ? DB::table('digital_product_packages')
                ->where('listing_id', $listing->id)
                ->when(
                    !empty($order->package_name),
                    fn ($q) => $q->where('package_name', $order->package_name)
                )
                ->orderByRaw("FIELD(package_name, 'Basic', 'Standard', 'Premium')")
                ->first()
            : null;

        $packageItems = ($package && Schema::hasTable('digital_product_package_items'))
            ? DB::table('digital_product_package_items')
                ->where('package_id', $package->id)
                ->get()
            : collect();

        $packageSummary = null;
        if ($package) {
            $included = [];
            $tools = [];
            $deliveryFormat = [];

            foreach ($packageItems as $item) {
                $values = $this->decodeJsonArray($item->item_value_json ?? null);

                if ($item->item_type === 'included') {
                    $included = array_merge($included, $values);
                } elseif ($item->item_type === 'tool') {
                    $tools = array_merge($tools, $values);
                } elseif ($item->item_type === 'delivery_format') {
                    $deliveryFormat = array_merge($deliveryFormat, $values);
                }
            }

            $packageSummary = [
                'package_name' => $package->package_name,
                'price' => $package->price,
                'included' => array_values(array_unique(array_filter($included))),
                'tools' => array_values(array_unique(array_filter($tools))),
                'delivery_format' => array_values(array_unique(array_filter($deliveryFormat))),
            ];
        }

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

        $faqPayload = $faqRows->map(function ($row) {
            return [
                'id' => $row->id,
                'question' => $row->question ?? $row->q ?? '',
                'answer' => $row->answer ?? $row->a ?? '',
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

        $listingPayload = [
            'id' => $listing->id,
            'title' => $listing->title,
            'username' => $listing->username ?? null,
            'category' => $listing->category ?? null,
            'sub_category' => $listing->sub_category ?? null,
            'short_description' => $listing->short_description,
            'about' => $listing->about,
            'tags' => $this->decodeJsonArray($listing->tags_json ?? null),
            'tools' => $this->decodeJsonArray($listing->tools_json ?? null),
            'price' => $package?->price ?? ($order->amount ?? $order->total_amount ?? 0),
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
            'package_name' => $order->package_name ?? $package?->package_name,
        ];

        $orderDetailsBlocks = [
            [
                'title' => 'Your Order',
                'date' => $order->created_at ?? null,
                'items' => [
                    [
                        'name' => $listing->title,
                        'qty' => $order->quantity ?? 1,
                        'duration' => $order->package_name ?? $package?->package_name ?? 'Digital Product',
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
            'package_summary' => $packageSummary,
            'resources' => $resources,
            'faqs' => $faqPayload,
            'review' => $review ? [
                'rating' => $review->rating,
                'comment' => $review->comment,
            ] : null,
            'order_details_blocks' => $orderDetailsBlocks,
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