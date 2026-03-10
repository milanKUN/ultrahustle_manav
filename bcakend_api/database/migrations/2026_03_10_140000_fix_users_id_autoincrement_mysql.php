<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        // Ensure the `users.id` column behaves like Laravel's default: BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY.
        // This fixes production schemas where `id` exists but isn't AUTO_INCREMENT, causing inserts to fail.

        $columns = DB::select("SHOW COLUMNS FROM `users` LIKE 'id'");
        if (empty($columns)) {
            return;
        }

        $idColumn = (array) $columns[0];
        $extra = strtolower((string) ($idColumn['Extra'] ?? $idColumn['extra'] ?? ''));

        if (! str_contains($extra, 'auto_increment')) {
            DB::statement('ALTER TABLE `users` MODIFY COLUMN `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT');
        }

        $primaryKey = DB::select("SHOW KEYS FROM `users` WHERE Key_name = 'PRIMARY'");
        if (empty($primaryKey)) {
            DB::statement('ALTER TABLE `users` ADD PRIMARY KEY (`id`)');
        }
    }

    public function down(): void
    {
        // No safe automatic rollback for production schema fixes.
    }
};
