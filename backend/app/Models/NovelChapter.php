<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NovelChapter extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'novel_id',
        'content',
    ];

     /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'novel_chapters'; // Explicit table name


    /**
     * Get the novel that owns the chapter.
     */
    public function novel(): BelongsTo
    {
        return $this->belongsTo(Novel::class, 'novel_id');
    }
}