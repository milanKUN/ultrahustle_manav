<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = json_decode(file_get_contents(database_path('data/states.json')), true);
        foreach ($data as $item) {
            foreach($item as $i){
                \App\Models\State::create([
                'name' => $i['name'],
                'country_id' => $i['country_id']
            ]);
            }
            
        }
    }
}
