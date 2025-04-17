<?php

namespace App\Http\Controllers;

use App\Models\TranslationNovel;
use App\Models\TranslationNovelChapter;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class TranslationNovelChapterController extends Controller
{
    /**
     * Display a listing of chapters for a specific novel.
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'novel_id' => 'required|integer|exists:translation_novels,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $chapters = TranslationNovelChapter::where('novel_id', $request->novel_id)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Chapters retrieved successfully',
                'data' => $chapters
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve chapters',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created chapter for a specific novel.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'novel_id' => 'required|integer|exists:translation_novels,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'chapter_number' => 'sometimes|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $chapterData = [
                'novel_id' => $request->novel_id,
                'title' => $request->title,
                'content' => $request->content,
            ];

            if ($request->has('chapter_number')) {
                $chapterData['chapter_number'] = $request->chapter_number;
            }

            $chapter = TranslationNovelChapter::create($chapterData);

            return response()->json([
                'success' => true,
                'message' => 'Chapter created successfully',
                'data' => [
                    'id' => $chapter->id,
                    'novel_id' => $chapter->novel_id,
                    'title' => $chapter->title,
                    'content' => $chapter->content,
                    'chapter_number' => $chapter->chapter_number,
                    'created_at' => $chapter->created_at,
                    'updated_at' => $chapter->updated_at
                ]
            ], Response::HTTP_CREATED);            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create chapter',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified chapter.
     */
    public function show($novelId, $chapterId)
    {
        try {
            $chapter = TranslationNovelChapter::where('id', $chapterId)
                ->where('novel_id', $novelId)
                ->first();

            if (!$chapter) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chapter not found for this novel'
                ], Response::HTTP_NOT_FOUND);
            }

            // Get previous and next chapters
            $previousChapter = TranslationNovelChapter::where('novel_id', $novelId)
                ->where('id', '<', $chapter->id)
                ->orderBy('id', 'desc')
                ->first();

            $nextChapter = TranslationNovelChapter::where('novel_id', $novelId)
                ->where('id', '>', $chapter->id)
                ->orderBy('id', 'asc')
                ->first();

            return response()->json([
                'success' => true,
                'message' => 'Chapter retrieved successfully',
                'data' => [
                    'chapter' => $chapter,
                    'previousChapter' => $previousChapter ?? null,
                    'nextChapter' => $nextChapter ?? null
                ]
            ], Response::HTTP_OK);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve chapter: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified chapter.
     */
    public function update(Request $request, $novelId, $chapterId)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'chapter_number' => 'sometimes|integer'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        try {
            $chapter = TranslationNovelChapter::where('id', $chapterId)
                ->where('novel_id', $novelId)
                ->first();

            if (!TranslationNovel::where('id', $novelId)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Novel not found'
                ], Response::HTTP_NOT_FOUND);
            }

            if (!$chapter) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chapter not found for this novel'
                ], Response::HTTP_NOT_FOUND);
            }

            $updateData = $request->only(['title', 'content', 'chapter_number']);
            $chapter->update($updateData);

            return response()->json([
                'success' => true,
                'message' => 'Chapter updated successfully',
                'data' => $chapter
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update chapter',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified chapter.
     */
    public function destroy($novelId, $chapterId)
    {
        try {
            $chapter = TranslationNovelChapter::where('id', $chapterId)
                ->where('novel_id', $novelId)
                ->first();

            if (!$chapter) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chapter not found for this novel'
                ], Response::HTTP_NOT_FOUND);
            }

            $chapter->delete();

            return response()->json([
                'success' => true,
                'message' => 'Chapter deleted successfully'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete chapter',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}