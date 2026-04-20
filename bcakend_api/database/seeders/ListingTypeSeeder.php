<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ListingTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            ['name' => 'Course', 'code' => 'course'],
            ['name' => 'Digital Product', 'code' => 'digital_product'],
            ['name' => 'Webinar', 'code' => 'webinar'],
            ['name' => 'Service', 'code' => 'service'],
        ];

        foreach ($items as $index => $item) {
            ListingType::updateOrCreate(
                ['code' => $item['code']],
                [
                    'name' => $item['name'],
                    'slug' => Str::slug($item['name']),
                    'is_active' => true,
                    'sort_order' => $index + 1,
                ]
            );
        }
    }
}
