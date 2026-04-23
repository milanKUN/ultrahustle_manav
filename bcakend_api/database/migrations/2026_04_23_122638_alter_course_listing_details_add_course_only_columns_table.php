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
            if (!Schema::hasColumn('course_listing_details', 'price')) {
                $table->decimal('price', 15, 2)->nullable()->after('listing_id');
            }

            if (!Schema::hasColumn('course_listing_details', 'product_type')) {
                $table->string('product_type')->nullable()->after('price');
            }

            if (!Schema::hasColumn('course_listing_details', 'included_json')) {
                $table->json('included_json')->nullable()->after('languages_json');
            }

            if (!Schema::hasColumn('course_listing_details', 'prerequisites_json')) {
                $table->json('prerequisites_json')->nullable()->after('included_json');
            }

            if (!Schema::hasColumn('course_listing_details', 'preview_video_url')) {
                $table->text('preview_video_url')->nullable()->after('preview_video_path');
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

            foreach ([
                'price',
                'product_type',
                'included_json',
                'prerequisites_json',
                'preview_video_url',
            ] as $column) {
                if (Schema::hasColumn('course_listing_details', $column)) {
                    $drop[] = $column;
                }
            }

            if (!empty($drop)) {
                $table->dropColumn($drop);
            }
        });
    }
};
