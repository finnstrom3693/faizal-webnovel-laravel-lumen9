<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TranslationNovelChapter extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'novel_id',
        'content',
        'chapter_number' // Added if you're using chapter numbers
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'translation_novel_chapters'; // Explicit table name

    /**
     * Get the novel that owns the chapter.
     */
    public function novel(): BelongsTo
    {
        return $this->belongsTo(TranslationNovel::class, 'novel_id');
    }
}