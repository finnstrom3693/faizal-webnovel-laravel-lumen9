<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Bookmarks extends Model
{
    // Specify table name if it's not the plural of the model (optional)
    protected $table = 'bookmarks';

    // If you're using guarded or fillable
    protected $fillable = [
        'user_id',
        'bookmarkable_id',
        'bookmarkable_type',
        'notes',
    ];

    /**
     * Polymorphic relationship to either Novel or TranslationNovel
     */
    public function bookmarkable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * The user who created the bookmark
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
