<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id(); // Integer primary key, auto-incrementing
            $table->text('content');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('chapter_id');
            $table->timestamps(); // Creates 'created_at' and 'updated_at' timestamp columns
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('chapter_id')->references('id')->on('novel_chapters')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('comments');
    }
}