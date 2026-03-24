<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = json_decode(file_get_contents(database_path('data/countries.json')), true);
        foreach ($data as $item) {
            foreach($item as $i){
                \App\Models\Country::create([
                'name' => $i['name'],
                'shortname' => $i['sortname'],
                'phoneCode' => $i['phoneCode'],
            ]);
            }
            
        }
    }
}
