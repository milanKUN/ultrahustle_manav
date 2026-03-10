<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('mysql:fix-auto-increment-ids {--table=* : Only fix specific tables (repeatable)}', function () {
    if (DB::getDriverName() !== 'mysql') {
        $this->warn('This command only applies to MySQL connections.');
        return self::SUCCESS;
    }

    $onlyTables = array_values(array_filter((array) $this->option('table')));
    $onlyTablesLower = array_map(fn ($t) => strtolower((string) $t), $onlyTables);

    $quote = function (string $identifier): string {
        return '`'.str_replace('`', '``', $identifier).'`';
    };

    $getPrimaryKeyCols = function (string $table) {
        return collect(DB::select(
            'SELECT column_name FROM information_schema.key_column_usage WHERE table_schema = DATABASE() AND table_name = ? AND constraint_name = \'PRIMARY\' ORDER BY ordinal_position',
            [$table]
        ))->map(fn ($r) => $r->column_name)->values()->all();
    };

    $candidates = DB::select(<<<SQL
        SELECT table_name, column_type, is_nullable, column_default, extra
        FROM information_schema.columns
        WHERE table_schema = DATABASE()
          AND column_name = 'id'
        ORDER BY table_name
        SQL);

    if (empty($candidates)) {
        $this->info('No id columns found in the current schema.');
        return self::SUCCESS;
    }

    $fixed = 0;
    $skipped = 0;

    foreach ($candidates as $row) {
        $table = (string) $row->table_name;
        if ($onlyTablesLower && ! in_array(strtolower($table), $onlyTablesLower, true)) {
            continue;
        }

        $columnType = strtolower((string) $row->column_type);
        $nullable = strtoupper((string) $row->is_nullable) === 'YES';
        $default = $row->column_default;
        $extra = strtolower((string) $row->extra);

        if (str_contains($extra, 'auto_increment')) {
            continue;
        }

        if ($nullable || $default !== null) {
            // This isn't the pattern that causes the "Field 'id' doesn't have a default value" error.
            continue;
        }

        // Only attempt on integer-like ids.
        $baseType = null;
        if (str_contains($columnType, 'bigint')) {
            $baseType = 'BIGINT';
        } elseif (str_contains($columnType, 'int')) {
            $baseType = 'INT';
        }

        if (! $baseType) {
            $this->warn("Skipping {$table}.id (non-integer type: {$row->column_type})");
            $skipped++;
            continue;
        }

        $unsigned = str_contains($columnType, 'unsigned');
        $typeSql = $baseType.($unsigned ? ' UNSIGNED' : '');

        $pkCols = $getPrimaryKeyCols($table);
        $hasPk = ! empty($pkCols);
        $pkIsIdOnly = $pkCols === ['id'];

        // For the special case migrations table, we can safely enforce the default Laravel shape.
        if (strtolower($table) === 'migrations' && $hasPk && ! $pkIsIdOnly) {
            $this->warn('migrations table has unexpected PRIMARY KEY; resetting to PRIMARY KEY(id).');
            DB::statement('ALTER TABLE '.$quote($table).' DROP PRIMARY KEY');
            $hasPk = false;
            $pkCols = [];
        }

        // If a table already has a PRIMARY KEY not on id, do not guess.
        if ($hasPk && ! $pkIsIdOnly) {
            $this->warn("Skipping {$table}.id because PRIMARY KEY is on [".implode(', ', $pkCols).']');
            $skipped++;
            continue;
        }

        $this->info("Fixing {$table}.id => {$typeSql} NOT NULL AUTO_INCREMENT");
        DB::statement('ALTER TABLE '.$quote($table).' MODIFY COLUMN '.$quote('id').' '.$typeSql.' NOT NULL AUTO_INCREMENT');

        if (! $hasPk) {
            $this->info("Adding PRIMARY KEY(id) on {$table}");
            DB::statement('ALTER TABLE '.$quote($table).' ADD PRIMARY KEY ('.$quote('id').')');
        }

        $fixed++;
    }

    $this->info("Done. Fixed: {$fixed}. Skipped: {$skipped}.");

    return self::SUCCESS;
})->purpose('Fix MySQL tables where id is not AUTO_INCREMENT (repairs broken migrations table too)');
