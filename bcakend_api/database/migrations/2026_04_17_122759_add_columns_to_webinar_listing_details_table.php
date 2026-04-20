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
        Schema::table('webinar_listing_details', function (Blueprint $table) {

            // Product Type (string)
            if (!Schema::hasColumn('webinar_listing_details', 'product_type')) {
                $table->string('product_type')->nullable()->after('listing_id');
            }

            // Key Outcomes (JSON array)
            if (!Schema::hasColumn('webinar_listing_details', 'key_outcomes')) {
                $table->json('key_outcomes')->nullable()->after('languages_json');
            }

            if (Schema::hasColumn('webinar_listing_details', 'webinar_level')) {
                $table->dropColumn('webinar_level');
            }

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('webinar_listing_details', function (Blueprint $table) {

            if (Schema::hasColumn('webinar_listing_details', 'product_type')) {
                $table->dropColumn('product_type');
            }

            if (Schema::hasColumn('webinar_listing_details', 'key_outcomes')) {
                $table->dropColumn('key_outcomes');
            }
            if (Schema::hasColumn('webinar_listing_details', 'webinar_level')) {
                $table->dropColumn('webinar_level');
            }
        });
    }
};
