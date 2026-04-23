<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DigitalProductOrderTestSeeder extends Seeder
{
    public function run(): void
    {
        DB::beginTransaction();

        try {
            $now = now();

            $pairs = [
                [
                    'client_id' => 98,
                    'creator_id' => 98,
                    'listing_id' => 221,
                    'order_id' => 801,
                    'listing_username' => 'online-course-cover-digital-product-bundle-98',
                    'package_name' => 'Standard',
                ],
                [
                    'client_id' => 69,
                    'creator_id' => 69,
                    'listing_id' => 222,
                    'order_id' => 802,
                    'listing_username' => 'online-course-cover-digital-product-bundle-69',
                    'package_name' => 'Standard',
                ],
            ];

            foreach ($pairs as $pair) {
                $clientId = $pair['client_id'];
                $creatorId = $pair['creator_id'];
                $listingId = $pair['listing_id'];
                $orderId = $pair['order_id'];
                $listingUsername = $pair['listing_username'];
                $packageName = $pair['package_name'];

                if (!DB::table('users')->where('id', $clientId)->exists()) {
                    throw new \Exception("Client user with id {$clientId} does not exist.");
                }

                if (!DB::table('users')->where('id', $creatorId)->exists()) {
                    throw new \Exception("Creator user with id {$creatorId} does not exist.");
                }

                if (Schema::hasTable('listings')) {
                    $listingColumns = Schema::getColumnListing('listings');

                    $listingData = [
                        'id' => $listingId,
                        'user_id' => $creatorId,
                        'listing_type' => 'digital_product',
                        'title' => 'Online Course Cover + Digital Product Mockup Bundle',
                        'username' => $listingUsername,
                        'category' => 'Design',
                        'sub_category' => 'Digital Product',
                        'short_description' => 'Premium cover pack and mockup bundle for digital product creators.',
                        'about' => 'This digital product includes polished visual assets, editable files, and packaged exports for fast publishing.',
                        'ai_powered' => 1,
                        'seller_mode' => 'Solo',
                        'team_name' => null,
                        'cover_media_path' => 'listings/digital-product/covers/product-cover-1.jpg',
                        'status' => 'published',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    if (in_array('tags_json', $listingColumns, true)) {
                        $listingData['tags_json'] = json_encode([
                            'Digital Product',
                            'Mockup Bundle',
                            'Course Cover',
                        ]);
                    }

                    if (in_array('tools_json', $listingColumns, true)) {
                        $listingData['tools_json'] = json_encode([
                            'Figma',
                            'Photoshop',
                            'Illustrator',
                        ]);
                    }

                    $this->upsertById('listings', $listingData);
                }

                if (Schema::hasTable('digital_product_packages')) {
                    DB::table('digital_product_packages')
                        ->where('listing_id', $listingId)
                        ->delete();

                    DB::table('digital_product_packages')->insert([
                        [
                            'id' => ($listingId * 10) + 1,
                            'listing_id' => $listingId,
                            'package_name' => 'Basic',
                            'price' => 49.00,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                        [
                            'id' => ($listingId * 10) + 2,
                            'listing_id' => $listingId,
                            'package_name' => 'Standard',
                            'price' => 399.00,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                        [
                            'id' => ($listingId * 10) + 3,
                            'listing_id' => $listingId,
                            'package_name' => 'Premium',
                            'price' => 799.00,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                    ]);
                }

                if (Schema::hasTable('digital_product_package_items')) {
                    $standardPackageId = ($listingId * 10) + 2;

                    DB::table('digital_product_package_items')
                        ->where('package_id', $standardPackageId)
                        ->delete();

                    DB::table('digital_product_package_items')->insert([
                        [
                            'id' => ($standardPackageId * 10) + 1,
                            'package_id' => $standardPackageId,
                            'item_type' => 'included',
                            'item_value_json' => json_encode([
                                'UI screens',
                                'Organized source file',
                                'Editable layered assets',
                            ]),
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                        [
                            'id' => ($standardPackageId * 10) + 2,
                            'package_id' => $standardPackageId,
                            'item_type' => 'tool',
                            'item_value_json' => json_encode([
                                'Figma',
                                'Photoshop',
                            ]),
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                        [
                            'id' => ($standardPackageId * 10) + 3,
                            'package_id' => $standardPackageId,
                            'item_type' => 'delivery_format',
                            'item_value_json' => json_encode([
                                'ZIP',
                                'PDF',
                                'Figma Link',
                            ]),
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                    ]);
                }

                if (Schema::hasTable('listing_faqs')) {
                    DB::table('listing_faqs')
                        ->where('listing_id', $listingId)
                        ->delete();

                    DB::table('listing_faqs')->insert([
                        [
                            'id' => ($listingId * 10) + 1,
                            'listing_id' => $listingId,
                            'question' => 'Do I get source files?',
                            'answer' => 'Yes, editable source files are included with the delivered package.',
                            'sort_order' => 0,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                        [
                            'id' => ($listingId * 10) + 2,
                            'listing_id' => $listingId,
                            'question' => 'Can I use these commercially?',
                            'answer' => 'Yes, this package is suitable for commercial use unless stated otherwise.',
                            'sort_order' => 1,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ],
                    ]);
                }

                if (Schema::hasTable('orders')) {
                    $orderColumns = Schema::getColumnListing('orders');

                    $orderData = [
                        'id' => $orderId,
                        'user_id' => $clientId,
                        'listing_id' => $listingId,
                        'status' => 'completed',
                        'amount' => 399.00,
                        'payment_details' => json_encode([
                            'gateway' => 'dummy',
                            'transaction_id' => 'TXN-DP-' . $orderId,
                        ]),
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];

                    if (in_array('quantity', $orderColumns, true)) {
                        $orderData['quantity'] = 1;
                    }
                    if (in_array('subtotal', $orderColumns, true)) {
                        $orderData['subtotal'] = 399.00;
                    }
                    if (in_array('service_fee', $orderColumns, true)) {
                        $orderData['service_fee'] = 0.00;
                    }
                    if (in_array('total_amount', $orderColumns, true)) {
                        $orderData['total_amount'] = 399.00;
                    }
                    if (in_array('package_name', $orderColumns, true)) {
                        $orderData['package_name'] = $packageName;
                    }
                    if (in_array('order_type', $orderColumns, true)) {
                        $orderData['order_type'] = 'digital_product';
                    }
                    if (in_array('payment_status', $orderColumns, true)) {
                        $orderData['payment_status'] = 'paid';
                    }

                    $this->upsertById('orders', $orderData);
                }

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
                            'file_path' => 'orders/resources/digital-product-final.zip',
                            'external_url' => null,
                            'file_name' => 'digital-product-final.zip',
                            'mime_type' => 'application/zip',
                            'file_size' => 134217728,
                            'note' => 'Contains final ZIP with source files and exports.',
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
                            'file_path' => 'orders/resources/digital-product-handoff.pdf',
                            'external_url' => null,
                            'file_name' => 'digital-product-handoff.pdf',
                            'mime_type' => 'application/pdf',
                            'file_size' => 7340032,
                            'note' => 'Contains product handoff and usage notes.',
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
                            'external_url' => 'https://www.figma.com/file/example/digital-product-source',
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
                        'comment' => 'Great digital product. Clean files and easy to use.',
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]);
                }
            }

            DB::commit();

            $this->command?->info('DigitalProductOrderTestSeeder completed successfully.');
            $this->command?->info('Order ID: 801 | Client user id: 98 | Creator user id: 98');
            $this->command?->info('Order ID: 802 | Client user id: 69 | Creator user id: 69');
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