<?php

namespace App\Http\Controllers;

use App\Models\Bookmarks;
use App\Models\Novel;
use App\Models\TranslationNovel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class BookmarksController extends Controller
{
    // Get all bookmarks for the authenticated user
    public function index()
    {
        try {
            $bookmarks = Bookmarks::with('bookmarkable')
                ->where('user_id', Auth::id())
                ->get();

            return response()->json([
                'success' => true,
                'data' => $bookmarks,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve bookmarks.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Store a new bookmark (for a novel or translation)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'bookmarkable_id' => 'required|integer',
            'bookmarkable_type' => 'required|string|in:novel,translation',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $typeMap = [
                'novel' => Novel::class,
                'translation' => TranslationNovel::class,
            ];

            $bookmark = Bookmarks::firstOrCreate([
                'user_id' => Auth::id(),
                'bookmarkable_id' => $request->bookmarkable_id,
                'bookmarkable_type' => $typeMap[$request->bookmarkable_type],
            ], [
                'notes' => $request->notes,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Bookmark saved successfully.',
                'data' => $bookmark,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save bookmark.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Update an existing bookmark (e.g., update notes)
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'notes' => 'nullable|string', // Only allow updating notes for now
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            // Find the bookmark by ID and ensure it belongs to the authenticated user
            $bookmark = Bookmarks::where('id', $id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$bookmark) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bookmark not found.',
                ], 404);
            }

            // Update the bookmark's notes
            $bookmark->update([
                'notes' => $request->notes,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Bookmark updated successfully.',
                'data' => $bookmark,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update bookmark.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // Delete a bookmark
    public function destroy($id)
    {
        try {
            $bookmark = Bookmarks::where('id', $id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$bookmark) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bookmark not found.',
                ], 404);
            }

            $bookmark->delete();

            return response()->json([
                'success' => true,
                'message' => 'Bookmark deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete bookmark.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}