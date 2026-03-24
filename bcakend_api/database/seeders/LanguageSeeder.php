<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = json_decode(file_get_contents(database_path('data/language.json')), true);
        foreach ($data as $item) {
            \App\Models\Language::create([
                'value' => $item,
            ]);  
        }
    }
}
