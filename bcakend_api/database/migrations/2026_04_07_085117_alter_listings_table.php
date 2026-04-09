<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('listings', function (Blueprint $table) {
            $table->json('tags_json')->nullable()->after('team_name');
            $table->json('tools_json')->nullable()->after('tags_json');
        });

        /* Schema::table('digital_product_package_items', function (Blueprint $table) {
            
            $table->enum('item_type', ['included','delivery_format'])->change();

        }); */
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
