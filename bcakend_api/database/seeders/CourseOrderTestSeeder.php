<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CourseOrderTestSeeder extends Seeder
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
            */
            $pairs = [
                [
                    'client_id' => 98,
                    'creator_id' => 98,
                    'listing_id' => 211,
                    'order_id' => 701,
                    'listing_username' => 'online-course-cover-digital-product-mockup-bundle-98',
                ],
                [
                    'client_id' => 69,
                    'creator_id' => 69,
                    'listing_id' => 212,
                    'order_id' => 702,
                    'listing_username' => 'online-course-cover-digital-product-mockup-bundle-69',
                ],
            ];

            foreach ($pairs as $pair) {
                $clientId = $pair['client_id'];
                $creatorId = $pair['creator_id'];
                $listingId = $pair['listing_id'];
                $orderId = $pair['order_id'];
                $listingUsername = $pair['listing_username'];

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
                if (Schema::hasTable('listings')) {
                    $listingData = [
                        'id' => $listingId,
                        'user_id' => $creatorId,
                        'listing_type' => 'course',
                        'title' => 'Online Course Cover + Digital Product Mockup Bundle',
                        'username' => $listingUsername,
                        'category' => 'Design',
                        'sub_category' => 'Course Design',
                        'short_description' => 'Access your delivered files, notes, and project course content.',
                        'about' => 'This course teaches course cover creation, digital mockup design, and product presentation workflow.',
                        'ai_powered' => 1,
                        'seller_mode' => 'Solo',
                        'team_name' => null,
                        'cover_media_path' => 'listings/course/covers/course-cover-1.jpg',
                        'status' => 'published',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    $this->upsertById('listings', $listingData);
                }

                /*
                |--------------------------------------------------------------------------
                | 3) COURSE DETAILS
                |--------------------------------------------------------------------------
                */
                if (Schema::hasTable('course_listing_details')) {
                    $detailsData = [
                        'id' => 300 + $listingId,
                        'listing_id' => $listingId,
                        'price' => 2340.00,
                        'product_type' => 'Recorded Course',
                        'course_level' => 'Intermediate',
                        'tools_json' => json_encode([
                            'Notion',
                            'Tailwind CSS',
                            'Photoshop',
                            'Figma',
                            'Illustrator',
                            'TypeScript',
                            'Webflow',
                        ]),
                        'languages_json' => json_encode([
                            'English',
                            'Hindi',
                            'Tamil',
                        ]),
                        'learning_points_json' => json_encode([
                            'Create premium course covers',
                            'Build digital product mockups',
                            'Package products professionally',
                            'Present work for better conversion',
                        ]),
                        'included_json' => json_encode([
                            'Up to 12 screens',
                            'Interactive prototype',
                            'Advanced wireframing & prototyping',
                            'Source files included',
                            'Custom color scheme & typography',
                            'Commercial use',
                            'Mobile & tablet responsive',
                        ]),
                        'prerequisites_json' => json_encode([
                            'Basic design understanding',
                            'Access to Figma or Photoshop',
                            'Interest in course asset design',
                        ]),
                        'preview_video_path' => null,
                        'preview_video_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    $existing = DB::table('course_listing_details')
                        ->where('listing_id', $listingId)
                        ->first();

                    if ($existing) {
                        DB::table('course_listing_details')
                            ->where('listing_id', $listingId)
                            ->update(collect($detailsData)->except(['id', 'created_at'])->toArray());
                    } else {
                        DB::table('course_listing_details')->insert($detailsData);
                    }
                }

                /*
                |--------------------------------------------------------------------------
                | 4) COURSE LESSONS
                |--------------------------------------------------------------------------
                */
                if (Schema::hasTable('course_listing_lessons')) {
                    DB::table('course_listing_lessons')
                        ->where('listing_id', $listingId)
                        ->delete();

                    DB::table('course_listing_lessons')->insert([
                        [
                            'id' => ($listingId * 10) + 1,
                            'listing_id' => $listingId,
                            'title' => 'Introduction to Course Cover Design',
                            'description' => 'Learn the fundamentals of building premium-looking course cover layouts.',
                            'media_type' => 'video',
                            'media_path' => null,
                            'external_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
                            'sort_order' => 0,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                        [
                            'id' => ($listingId * 10) + 2,
                            'listing_id' => $listingId,
                            'title' => 'Mockup Composition Fundamentals',
                            'description' => 'Build digital product mockups that look clean and conversion-focused.',
                            'media_type' => 'video',
                            'media_path' => null,
                            'external_url' => 'https://www.w3schools.com/html/movie.mp4',
                            'sort_order' => 1,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                        [
                            'id' => ($listingId * 10) + 3,
                            'listing_id' => $listingId,
                            'title' => 'Final Packaging and Delivery',
                            'description' => 'Package files, source assets, and export versions professionally.',
                            'media_type' => 'video',
                            'media_path' => null,
                            'external_url' => 'https://www.w3schools.com/html/mov_bbb.mp4',
                            'sort_order' => 2,
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
                                'id' => ($listingId * 10) + 1,
                                'listing_id' => $listingId,
                                'question' => 'What information do you need to get started?',
                                'answer' => 'I need your idea, target audience, references, and any brand guideline if available.',
                                'created_at' => $now,
                                'updated_at' => $now,
                            ],
                            [
                                'id' => ($listingId * 10) + 2,
                                'listing_id' => $listingId,
                                'question' => 'Do you provide the source files?',
                                'answer' => 'Yes, source files are included in the final delivery package.',
                                'created_at' => $now,
                                'updated_at' => $now,
                            ],
                        ];
                    } elseif (in_array('q', $faqColumns, true) && in_array('a', $faqColumns, true)) {
                        $rows = [
                            [
                                'id' => ($listingId * 10) + 1,
                                'listing_id' => $listingId,
                                'q' => 'What information do you need to get started?',
                                'a' => 'I need your idea, target audience, references, and any brand guideline if available.',
                                'created_at' => $now,
                                'updated_at' => $now,
                            ],
                            [
                                'id' => ($listingId * 10) + 2,
                                'listing_id' => $listingId,
                                'q' => 'Do you provide the source files?',
                                'a' => 'Yes, source files are included in the final delivery package.',
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
                if (Schema::hasTable('orders')) {
                    $orderColumns = Schema::getColumnListing('orders');

                    $orderData = [
                        'id' => $orderId,
                        'user_id' => $clientId,
                        'listing_id' => $listingId,
                        'status' => 'completed',
                        'amount' => 2340.00,
                        'payment_details' => json_encode([
                            'gateway' => 'dummy',
                            'transaction_id' => 'TXN-COURSE-' . $orderId,
                        ]),
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    if (in_array('quantity', $orderColumns, true)) {
                        $orderData['quantity'] = 1;
                    }
                    if (in_array('subtotal', $orderColumns, true)) {
                        $orderData['subtotal'] = 2340.00;
                    }
                    if (in_array('service_fee', $orderColumns, true)) {
                        $orderData['service_fee'] = 0.00;
                    }
                    if (in_array('total_amount', $orderColumns, true)) {
                        $orderData['total_amount'] = 2340.00;
                    }
                    if (in_array('currency', $orderColumns, true)) {
                        $orderData['currency'] = 'USD';
                    }
                    if (in_array('payment_status', $orderColumns, true)) {
                        $orderData['payment_status'] = 'paid';
                    }
                    if (in_array('order_type', $orderColumns, true)) {
                        $orderData['order_type'] = 'course';
                    }
                    if (in_array('completed_at', $orderColumns, true)) {
                        $orderData['completed_at'] = $now;
                    }

                    $this->upsertById('orders', $orderData);
                }

                /*
                |--------------------------------------------------------------------------
                | 7) LESSON PROGRESS
                |--------------------------------------------------------------------------
                */
                if (Schema::hasTable('order_course_lesson_progress')) {
                    DB::table('order_course_lesson_progress')
                        ->where('order_id', $orderId)
                        ->where('user_id', $clientId)
                        ->delete();

                    DB::table('order_course_lesson_progress')->insert([
                        [
                            'id' => ($orderId * 10) + 1,
                            'order_id' => $orderId,
                            'lesson_id' => ($listingId * 10) + 1,
                            'user_id' => $clientId,
                            'watched' => 1,
                            'watched_at' => $now,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                        [
                            'id' => ($orderId * 10) + 2,
                            'order_id' => $orderId,
                            'lesson_id' => ($listingId * 10) + 2,
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
                            'id' => ($orderId * 10) + 1,
                            'order_id' => $orderId,
                            'title' => 'Final Deliverables ZIP',
                            'resource_type' => 'download',
                            'file_path' => 'orders/resources/course-final-deliverables.zip',
                            'external_url' => null,
                            'file_name' => 'course-final-deliverables.zip',
                            'mime_type' => 'application/zip',
                            'file_size' => 134217728,
                            'note' => 'Final ZIP with UI kit, source files, and exports.',
                            'tags_json' => json_encode(['ZIP', 'Final']),
                            'sort_order' => 0,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                        [
                            'id' => ($orderId * 10) + 2,
                            'order_id' => $orderId,
                            'title' => 'Design Handoff PDF',
                            'resource_type' => 'download',
                            'file_path' => 'orders/resources/course-design-handoff.pdf',
                            'external_url' => null,
                            'file_name' => 'course-design-handoff.pdf',
                            'mime_type' => 'application/pdf',
                            'file_size' => 7340032,
                            'note' => 'Contains design instructions and implementation notes.',
                            'tags_json' => json_encode(['PDF', 'Final']),
                            'sort_order' => 1,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                        [
                            'id' => ($orderId * 10) + 3,
                            'order_id' => $orderId,
                            'title' => 'Figma Source Link',
                            'resource_type' => 'link',
                            'file_path' => null,
                            'external_url' => 'https://www.figma.com/file/example/course-source-file',
                            'file_name' => null,
                            'mime_type' => null,
                            'file_size' => null,
                            'note' => 'View-only Figma source file.',
                            'tags_json' => json_encode(['Link', 'Final']),
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
                        'id' => ($orderId * 10) + 9,
                        'order_id' => $orderId,
                        'user_id' => $clientId,
                        'rating' => 4,
                        'comment' => 'Excellent course. Very clear explanation and useful deliverables.',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                }
            }

            DB::commit();

            $this->command?->info('CourseOrderTestSeeder completed successfully.');
            $this->command?->info('Created/updated 2 course orders:');
            $this->command?->info('Order ID: 701 | Client user id: 98 | Creator user id: 98');
            $this->command?->info('Order ID: 702 | Client user id: 69 | Creator user id: 69');
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