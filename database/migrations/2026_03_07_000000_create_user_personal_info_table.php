<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_personal_info', function (Blueprint $table) {
            $table->string('uh_user_id')->primary();
            $table->foreign('uh_user_id')
                ->references('uh_user_id')
                ->on('users')
                ->cascadeOnDelete();

            $table->string('first_name', 50)->nullable();
            $table->string('last_name', 50)->nullable();

            $table->string('username', 30)->nullable();

            $table->date('date_of_birth')->nullable();
            $table->string('contact_email', 254)->nullable();

            $table->char('phone_country', 2)->nullable();
            $table->string('phone_country_code', 8)->nullable();
            $table->string('phone_number', 20)->nullable();

            $table->string('gender', 16)->nullable();

            $table->string('street', 120)->nullable();
            $table->string('city', 80)->nullable();
            $table->string('state', 80)->nullable();
            $table->string('country', 80)->nullable();
            $table->string('pincode', 12)->nullable();

            $table->string('title', 40)->nullable();
            $table->string('short_bio', 160)->nullable();
            $table->string('about', 700)->nullable();

            $table->string('availability', 32)->nullable();

            $table->json('hashtags')->default('[]');
            $table->json('skills')->default('[]');
            $table->json('tools')->default('[]');
            $table->json('languages')->default('[]');

            $table->timestampsTz();

            $table->index('country', 'user_personal_info_country_idx');
            $table->index('availability', 'user_personal_info_availability_idx');
        });

        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("create unique index if not exists user_personal_info_username_uq on user_personal_info (lower(username)) where username is not null");

            DB::statement("alter table user_personal_info add constraint user_personal_info_gender_chk check (gender in ('male','female','other') or gender is null)");
            DB::statement("alter table user_personal_info add constraint user_personal_info_availability_chk check (availability in ('available','unavailable','working_on_a_project') or availability is null)");

            DB::statement(<<<'SQL'
create or replace function set_updated_at_user_personal_info()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
SQL);

            DB::statement(<<<'SQL'
drop trigger if exists user_personal_info_set_updated_at on user_personal_info;
create trigger user_personal_info_set_updated_at
before update on user_personal_info
for each row
execute function set_updated_at_user_personal_info();
SQL);
        } elseif ($driver === 'sqlite') {
            DB::statement("create unique index if not exists user_personal_info_username_uq on user_personal_info(username collate nocase) where username is not null");
        } else {
            Schema::table('user_personal_info', function (Blueprint $table) {
                $table->unique('username', 'user_personal_info_username_uq');
            });
        }
    }

    public function down(): void
    {
        $driver = DB::getDriverName();
        if ($driver === 'pgsql') {
            DB::statement('drop trigger if exists user_personal_info_set_updated_at on user_personal_info');
            DB::statement('drop function if exists set_updated_at_user_personal_info');
        }

        Schema::dropIfExists('user_personal_info');
    }
};
