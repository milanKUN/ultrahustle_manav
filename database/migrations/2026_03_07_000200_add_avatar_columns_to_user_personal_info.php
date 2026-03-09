<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_personal_info', function (Blueprint $table) {
            $table->string('avatar_filename', 255)->nullable();
            $table->string('avatar_path', 255)->nullable();
            $table->string('avatar_mime', 100)->nullable();
            $table->unsignedBigInteger('avatar_size')->nullable();
            $table->timestampTz('avatar_updated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('user_personal_info', function (Blueprint $table) {
            $table->dropColumn([
                'avatar_filename',
                'avatar_path',
                'avatar_mime',
                'avatar_size',
                'avatar_updated_at',
            ]);
        });
    }
};
