<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

class WebinarOrderTestSeeder extends Seeder
{
    public function run(): void
    {
        DB::beginTransaction();

        try {
            $now = now();

            /*
            |--------------------------------------------------------------------------
            | 1) USE EXISTING USERS ONLY
            |--------------------------------------------------------------------------
            | IMPORTANT:
            | Set these to real existing user IDs from your database.
            | Do NOT use non-existing IDs.
            |--------------------------------------------------------------------------
            */
            $clientId = 98;   // change this to your logged-in client user id
            $creatorId = 98;  // change this to an existing creator user id

            $clientExists = DB::table('users')->where('id', $clientId)->exists();
            $creatorExists = DB::table('users')->where('id', $creatorId)->exists();

            if (!$clientExists) {
                throw new \Exception("Client user with id {$clientId} does not exist.");
            }

            if (!$creatorExists) {
                throw new \Exception("Creator user with id {$creatorId} does not exist.");
            }

            /*
            |--------------------------------------------------------------------------
            | 2) LISTING
            |--------------------------------------------------------------------------
            */
            $listingId = 201;

            if (Schema::hasTable('listings')) {
                $listingData = [
                    'id' => $listingId,
                    'user_id' => $creatorId,
                    'listing_type' => 'webinar',
                    'title' => 'Advanced Product Design Webinar',
                    'username' => 'advanced-product-design-webinar',
                    'category' => 'Design',
                    'sub_category' => 'UI/UX',
                    'short_description' => 'Live webinar on advanced product design systems and workflows.',
                    'about' => 'This webinar covers product design systems, workflow optimization, collaboration methods, and practical design decision making.',
                    'ai_powered' => 1,
                    'seller_mode' => 'Solo',
                    'team_name' => null,
                    'cover_media_path' => 'listings/webinar/covers/webinar-cover-1.jpg',
                    'status' => 'published',
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                $this->upsertById('listings', $listingData);
            }

            /*
            |--------------------------------------------------------------------------
            | 3) WEBINAR DETAILS
            |--------------------------------------------------------------------------
            | Change date for testing:
            | - future date => upcoming webinar state
            | - past date   => delivered session state
            |--------------------------------------------------------------------------
            */
            $webinarDate = Carbon::now()->addDays(5)->format('Y-m-d');
            // $webinarDate = Carbon::now()->subDays(5)->format('Y-m-d');

            if (Schema::hasTable('webinar_listing_details')) {
                $detailsData = [
                    'id' => 301,
                    'listing_id' => $listingId,
                    'ticket_price' => 49.00,
                    'product_type' => 'Live Webinar',
                    'schedule_date' => $webinarDate,
                    'schedule_start_time' => '18:00:00',
                    'schedule_duration' => 90,
                    'schedule_timezone' => 'UTC',
                    'webinar_link' => 'https://meet.google.com/example-webinar-room',
                    'learning_points_json' => json_encode([
                        'Build scalable design systems',
                        'Improve UI workflow',
                        'Understand team collaboration',
                        'Create better design handoff',
                    ]),
                    'languages_json' => json_encode([
                        'English',
                        'Hindi',
                    ]),
                    'key_outcomes' => json_encode([
                        'Clear design framework',
                        'Reusable workflow',
                        'Better design reviews',
                    ]),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                $existing = DB::table('webinar_listing_details')
                    ->where('listing_id', $listingId)
                    ->first();

                if ($existing) {
                    DB::table('webinar_listing_details')
                        ->where('listing_id', $listingId)
                        ->update(collect($detailsData)->except(['id', 'created_at'])->toArray());
                } else {
                    DB::table('webinar_listing_details')->insert($detailsData);
                }
            }

            /*
            |--------------------------------------------------------------------------
            | 4) WEBINAR AGENDA
            |--------------------------------------------------------------------------
            */
            if (Schema::hasTable('webinar_listing_agendas')) {
                DB::table('webinar_listing_agendas')
                    ->where('listing_id', $listingId)
                    ->delete();

                DB::table('webinar_listing_agendas')->insert([
                    [
                        'id' => 401,
                        'listing_id' => $listingId,
                        'time' => '10 min',
                        'topic' => 'Welcome + setup',
                        'description' => 'Introduction, webinar goals, and setup steps.',
                        'sort_order' => 0,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                    [
                        'id' => 402,
                        'listing_id' => $listingId,
                        'time' => '25 min',
                        'topic' => 'Design workflow breakdown',
                        'description' => 'Understanding how to structure product design workflow from scratch.',
                        'sort_order' => 1,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                    [
                        'id' => 403,
                        'listing_id' => $listingId,
                        'time' => '20 min',
                        'topic' => 'Review and critique process',
                        'description' => 'How to run effective reviews and collect actionable feedback.',
                        'sort_order' => 2,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                    [
                        'id' => 404,
                        'listing_id' => $listingId,
                        'time' => '35 min',
                        'topic' => 'Q&A + wrap up',
                        'description' => 'Audience questions and final recommendations.',
                        'sort_order' => 3,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | 5) FAQS
            |--------------------------------------------------------------------------
            */
            if (Schema::hasTable('listing_faqs')) {
                DB::table('listing_faqs')
                    ->where('listing_id', $listingId)
                    ->delete();

                $faqColumns = Schema::getColumnListing('listing_faqs');
                $rows = [];

                if (in_array('question', $faqColumns, true) && in_array('answer', $faqColumns, true)) {
                    $rows = [
                        [
                            'id' => 501,
                            'listing_id' => $listingId,
                            'question' => 'What do I need before joining?',
                            'answer' => 'You only need a stable internet connection and basic familiarity with design tools.',
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                        [
                            'id' => 502,
                            'listing_id' => $listingId,
                            'question' => 'Will I get access to resources after the webinar?',
                            'answer' => 'Yes, ordered users can access the resources and session tracking page.',
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                    ];
                } elseif (in_array('q', $faqColumns, true) && in_array('a', $faqColumns, true)) {
                    $rows = [
                        [
                            'id' => 501,
                            'listing_id' => $listingId,
                            'q' => 'What do I need before joining?',
                            'a' => 'You only need a stable internet connection and basic familiarity with design tools.',
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                        [
                            'id' => 502,
                            'listing_id' => $listingId,
                            'q' => 'Will I get access to resources after the webinar?',
                            'a' => 'Yes, ordered users can access the resources and session tracking page.',
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                    ];
                }

                if (!empty($rows)) {
                    DB::table('listing_faqs')->insert($rows);
                }
            }

            /*
            |--------------------------------------------------------------------------
            | 6) ORDER
            |--------------------------------------------------------------------------
            */
            $orderId = 601;

            if (Schema::hasTable('orders')) {
                $orderColumns = Schema::getColumnListing('orders');

                $orderData = [
                    'id' => $orderId,
                    'user_id' => $clientId,
                    'listing_id' => $listingId,
                    'status' => 'completed',
                    'amount' => 49.00,
                    'payment_details' => json_encode([
                        'gateway' => 'dummy',
                        'transaction_id' => 'TXN-WEBINAR-001',
                    ]),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];

                if (in_array('quantity', $orderColumns, true)) {
                    $orderData['quantity'] = 1;
                }
                if (in_array('subtotal', $orderColumns, true)) {
                    $orderData['subtotal'] = 49.00;
                }
                if (in_array('service_fee', $orderColumns, true)) {
                    $orderData['service_fee'] = 2.00;
                }
                if (in_array('total_amount', $orderColumns, true)) {
                    $orderData['total_amount'] = 51.00;
                }
                if (in_array('currency', $orderColumns, true)) {
                    $orderData['currency'] = 'USD';
                }
                if (in_array('payment_status', $orderColumns, true)) {
                    $orderData['payment_status'] = 'paid';
                }
                if (in_array('order_type', $orderColumns, true)) {
                    $orderData['order_type'] = 'webinar';
                }
                if (in_array('completed_at', $orderColumns, true)) {
                    $orderData['completed_at'] = $now;
                }

                $this->upsertById('orders', $orderData);
            }

            /*
            |--------------------------------------------------------------------------
            | 7) AGENDA PROGRESS
            |--------------------------------------------------------------------------
            */
            if (Schema::hasTable('order_webinar_agenda_progress')) {
                DB::table('order_webinar_agenda_progress')
                    ->where('order_id', $orderId)
                    ->where('user_id', $clientId)
                    ->delete();

                DB::table('order_webinar_agenda_progress')->insert([
                    [
                        'id' => 789,
                        'order_id' => $orderId,
                        'agenda_item_id' => 401,
                        'user_id' => $clientId,
                        'watched' => 1,
                        'watched_at' => $now,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                    [
                        'id' => 741,
                        'order_id' => $orderId,
                        'agenda_item_id' => 402,
                        'user_id' => $clientId,
                        'watched' => 0,
                        'watched_at' => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | 8) ORDER RESOURCES
            |--------------------------------------------------------------------------
            */
            if (Schema::hasTable('order_resources')) {
                DB::table('order_resources')
                    ->where('order_id', $orderId)
                    ->delete();

                DB::table('order_resources')->insert([
                    [
                        'id' => 501,
                        'order_id' => $orderId,
                        'title' => 'Webinar Slides PDF',
                        'resource_type' => 'download',
                        'file_path' => 'orders/resources/webinar-slides.pdf',
                        'external_url' => null,
                        'file_name' => 'webinar-slides.pdf',
                        'mime_type' => 'application/pdf',
                        'file_size' => 2457600,
                        'note' => 'These are the final webinar slides in PDF format.',
                        'tags_json' => json_encode(['PDF', 'Final']),
                        'sort_order' => 0,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                    [
                        'id' => 204,
                        'order_id' => $orderId,
                        'title' => 'Design Checklist',
                        'resource_type' => 'download',
                        'file_path' => 'orders/resources/design-checklist.zip',
                        'external_url' => null,
                        'file_name' => 'design-checklist.zip',
                        'mime_type' => 'application/zip',
                        'file_size' => 3145728,
                        'note' => 'ZIP containing the design checklist and worksheet.',
                        'tags_json' => json_encode(['ZIP', 'Checklist']),
                        'sort_order' => 1,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                    [
                        'id' => 502,
                        'order_id' => $orderId,
                        'title' => 'Reference Figma File',
                        'resource_type' => 'link',
                        'file_path' => null,
                        'external_url' => 'https://www.figma.com/file/example/reference-file',
                        'file_name' => null,
                        'mime_type' => null,
                        'file_size' => null,
                        'note' => 'Open the shared Figma reference file here.',
                        'tags_json' => json_encode(['Link', 'Figma']),
                        'sort_order' => 2,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ],
                ]);
            }

            /*
            |--------------------------------------------------------------------------
            | 9) ORDER REVIEW
            |--------------------------------------------------------------------------
            */
            if (Schema::hasTable('order_reviews')) {
                DB::table('order_reviews')
                    ->where('order_id', $orderId)
                    ->where('user_id', $clientId)
                    ->delete();

                DB::table('order_reviews')->insert([
                    'id' => 564,
                    'order_id' => $orderId,
                    'user_id' => $clientId,
                    'rating' => 5,
                    'comment' => 'Excellent webinar. Clear presentation, useful examples, and practical workflow tips.',
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }

            DB::commit();

            $this->command?->info('WebinarOrderTestSeeder completed successfully.');
            $this->command?->info("Client user id: {$clientId}");
            $this->command?->info("Creator user id: {$creatorId}");
            $this->command?->info('Order ID: 601');
            $this->command?->info('Listing username: advanced-product-design-webinar');
        } catch (\Throwable $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function upsertById(string $table, array $data): void
    {
        $exists = DB::table($table)->where('id', $data['id'])->exists();

        if ($exists) {
            $updateData = $data;
            unset($updateData['id']);
            DB::table($table)->where('id', $data['id'])->update($updateData);
        } else {
            DB::table($table)->insert($data);
        }
    }
}