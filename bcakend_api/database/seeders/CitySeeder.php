<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = json_decode(file_get_contents(database_path('data/cities.json')), true);
        foreach ($data as $item) {
            foreach($item as $i){
                \App\Models\City::create([
                'name' => $i['name'],
                'state_id' => $i['state_id']
            ]);
            }
            
        }
    }
}
