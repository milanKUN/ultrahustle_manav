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
        Schema::table('course_listing_details', function (Blueprint $table) {
            if (!Schema::hasColumn('course_listing_details', 'product_type')) {
                $table->string('product_type', 150)->nullable()->after('course_level');
            }

            if (!Schema::hasColumn('course_listing_details', 'included_json')) {
                $table->longText('included_json')->nullable()->after('product_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('course_listing_details', function (Blueprint $table) {
            $drop = [];

            if (Schema::hasColumn('course_listing_details', 'included_json')) {
                $drop[] = 'included_json';
            }

            if (Schema::hasColumn('course_listing_details', 'product_type')) {
                $drop[] = 'product_type';
            }

            if (!empty($drop)) {
                $table->dropColumn($drop);
            }
        });
    }
};
