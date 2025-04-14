<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // Integer primary key, auto-incrementing
            $table->string('username', 50)->unique();
            $table->string('email', 100)->unique();
            $table->string('password_hash'); // Typically stores the hashed password
            $table->string('display_name', 100)->nullable();
            $table->string('profile_picture')->nullable();
            $table->text('bio')->nullable();
            $table->timestamp('join_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('last_login')->nullable();
            $table->enum('account_status', ['active', 'suspended', 'banned'])->default('active');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}