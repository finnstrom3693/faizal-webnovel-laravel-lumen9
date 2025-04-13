<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TranslationNovel extends Model
{
   /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'synopsis',
        'genre',
        'author',
        'cover',
        'status',
        'ratings',
        'featured'
    ];

    protected $table = 'translation_novels'; // Explicit table name


    /**
     * Get the chapters for the novel.
     */
    public function chapters(): HasMany
    {
        return $this->hasMany(TranslationNovelChapter::class, 'novel_id');
    }
}
