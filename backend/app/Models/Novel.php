<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Novel extends Model
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
        'status'
    ];

    /**
     * Get the chapters for the novel.
     */
    public function chapters(): HasMany
    {
        return $this->hasMany(NovelChapter::class, 'novel_id');
    }
}