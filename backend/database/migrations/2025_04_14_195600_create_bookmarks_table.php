<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookmarksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('bookmarks', function (Blueprint $table) {
            $table->id();
        
            $table->unsignedBigInteger('user_id');
            
            // Polymorphic columns
            $table->unsignedBigInteger('bookmarkable_id');
            $table->string('bookmarkable_type');
            $table->text('notes')->nullable();
            $table->timestamps();
        
            // Foreign key for user
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        
            // Optional: prevent duplicate bookmarks
            $table->unique(['user_id', 'bookmarkable_id', 'bookmarkable_type']);
        });
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('bookmarks');
    }
}