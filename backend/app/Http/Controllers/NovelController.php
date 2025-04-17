<?php

namespace App\Http\Controllers;

use App\Models\Novel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class NovelController extends Controller
{
    // Get all novels
    public function index()
    {
        $novels = Novel::all();
        return response()->json([
            'success' => true,
            'data' => $novels,
        ]);
    }

    // Store a new novel
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'synopsis' => 'required|string',
            'genre' => 'required|string',
            'author' => 'required|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'status' => 'required|string|in:draft,published',
            'featured' => 'sometimes|boolean',
        ]);    

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only([
            'title', 'synopsis', 'genre', 'author', 'status', 'featured'
        ]);

        if ($request->hasFile('cover')) {
            $file = $request->file('cover');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('covers', $filename, 'public');
            $data['cover'] = $path;
        }

        $novel = Novel::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Novel created successfully.',
            'data' => $novel,
        ], 201);
    }

    // Show a specific novel
    public function show($id)
    {
        $novel = Novel::find($id);

        if (!$novel) {
            return response()->json([
                'success' => false,
                'message' => 'Novel not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $novel,
        ]);
    }
    
    // Update a novel
    public function update(Request $request, $id)
    {
        $novel = Novel::find($id);

        if (!$novel) {
            return response()->json([
                'success' => false,
                'message' => 'Novel not found.',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'synopsis' => 'sometimes|required|string',
            'genre' => 'sometimes|required|string',
            'author' => 'sometimes|required|string',
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'remove_cover' => 'sometimes|boolean',
            'status' => 'sometimes|required|string|in:draft,published',
            'featured' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation errors',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->only([
            'title', 'synopsis', 'genre', 'author', 'status'
        ]);

        $data['featured'] = $request->has('featured') 
            ? filter_var($request->input('featured'), FILTER_VALIDATE_BOOLEAN) 
            : $novel->featured;

        // Handle cover removal
        if ($request->has('remove_cover') && filter_var($request->input('remove_cover'), FILTER_VALIDATE_BOOLEAN)) {
            if ($novel->cover && Storage::disk('public')->exists($novel->cover)) {
                Storage::disk('public')->delete($novel->cover);
            }
            $data['cover'] = null;
        }

        // Handle new cover upload
        if ($request->hasFile('cover')) {
            // Delete old cover
            if ($novel->cover && Storage::disk('public')->exists($novel->cover)) {
                Storage::disk('public')->delete($novel->cover);
            }

            // Save new cover
            $file = $request->file('cover');
            $path = $file->store('covers', 'public');
            $data['cover'] = $path;
        }

        $novel->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Novel updated successfully.',
            'data' => $novel,
        ]);
    }
    // Delete a novel
    public function destroy($id)
    {
        $novel = Novel::find($id);

        if (!$novel) {
            return response()->json([
                'success' => false,
                'message' => 'Novel not found.',
            ], 404);
        }

        // Delete associated cover image if exists
        if ($novel->cover && file_exists(storage_path('app/public/' . $novel->cover))) {
            unlink(storage_path('app/public/' . $novel->cover));
        }

        $novel->delete();

        return response()->json([
            'success' => true,
            'message' => 'Novel deleted successfully.',
        ]);
    }

    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $title = $request->input('title');

        $results = Novel::where('title', 'like', '%' . $title . '%')->get();

        return response()->json([
            'success' => true,
            'data' => $results,
        ]);
    }
}