<?php

namespace App\Http\Controllers;

use App\Models\Novel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
            'cover' => 'nullable|string',
            'status' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $novel = Novel::create($request->only([
            'title', 'synopsis', 'genre', 'author', 'cover','status'
        ]));

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
            'cover' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $novel->update($request->only([
            'title', 'synopsis', 'genre', 'author', 'cover'
        ]));

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

        $novel->delete();

        return response()->json([
            'success' => true,
            'message' => 'Novel deleted successfully.',
        ]);
    }
}
