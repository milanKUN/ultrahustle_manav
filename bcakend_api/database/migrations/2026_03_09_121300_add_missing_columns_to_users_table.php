<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'uh_user_id')) {
                $table->string('uh_user_id')->nullable()->unique()->after('id');
            }

            if (! Schema::hasColumn('users', 'full_name')) {
                $table->string('full_name')->nullable()->after('uh_user_id');
            }

            if (! Schema::hasColumn('users', 'role')) {
                // Use string for broad DB compatibility (sqlite/mysql).
                $table->string('role')->nullable()->after('password');
            }

            if (! Schema::hasColumn('users', 'provider')) {
                $table->string('provider')->nullable()->after('role');
            }

            if (! Schema::hasColumn('users', 'provider_id')) {
                $table->string('provider_id')->nullable()->after('provider');
            }

            if (! Schema::hasColumn('users', 'agreed_to_terms')) {
                $table->boolean('agreed_to_terms')->default(false)->after('provider_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = [
                'uh_user_id',
                'full_name',
                'role',
                'provider',
                'provider_id',
                'agreed_to_terms',
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
