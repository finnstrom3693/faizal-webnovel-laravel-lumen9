<?php

namespace App\Http\Controllers;

use App\Models\NovelChapter;
use App\Models\Novel;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;

class NovelChapterController extends Controller
{
    /**
     * Display a listing of chapters for a specific novel.
     */
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'novel_id' => 'required|exists:novels,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $novel = Novel::find($request->novel_id);
        return response()->json([
            'success' => true,
            'data' => $novel->chapters()->orderBy('created_at', 'desc')->get()
        ], Response::HTTP_OK);
    }

    /**
     * Store a newly created chapter for a specific novel.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'novel_id' => 'required|exists:novels,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $novel = Novel::find($request->novel_id);
        $chapter = $novel->chapters()->create([
            'title' => $request->title,
            'content' => $request->content,
        ]);

        return response()->json([
            'success' => true,
            'data' => $chapter
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified chapter.
     */
    public function show(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'novel_id' => 'required|exists:novels,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $chapter = NovelChapter::where('id', $id)
                            ->where('novel_id', $request->novel_id)
                            ->first();

        if (!$chapter) {
            return response()->json([
                'success' => false,
                'message' => 'Chapter not found for this novel'
            ], Response::HTTP_NOT_FOUND);
        }

        return response()->json([
            'success' => true,
            'data' => $chapter
        ], Response::HTTP_OK);
    }

    /**
     * Update the specified chapter.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'novel_id' => 'required|exists:novels,id',
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $chapter = NovelChapter::where('id', $id)
                            ->where('novel_id', $request->novel_id)
                            ->first();

        if (!$chapter) {
            return response()->json([
                'success' => false,
                'message' => 'Chapter not found for this novel'
            ], Response::HTTP_NOT_FOUND);
        }

        $chapter->update($request->only(['title', 'content']));

        return response()->json([
            'success' => true,
            'data' => $chapter
        ], Response::HTTP_OK);
    }

    /**
     * Remove the specified chapter.
     */
    public function destroy(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'novel_id' => 'required|exists:novels,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $chapter = NovelChapter::where('id', $id)
                            ->where('novel_id', $request->novel_id)
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
    }
}