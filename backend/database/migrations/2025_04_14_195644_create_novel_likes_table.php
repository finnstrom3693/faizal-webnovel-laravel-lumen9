<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNovelLikesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('novel_likes', function (Blueprint $table) {
            $table->id(); // Integer primary key, auto-incrementing (Laravel's default 'id')
            $table->unsignedBigInteger('novel_id');
            $table->unsignedBigInteger('user_id');
            $table->timestamp('created_at')->default(\DB::raw('CURRENT_TIMESTAMP'));

            $table->foreign('novel_id')->references('id')->on('novels')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->unique(['novel_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('novel_likes');
    }
}