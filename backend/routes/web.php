<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

// storage

$router->get('storage/{filename}', function ($filename) {
    $path = storage_path('app/public/' . $filename);
    
    if (!file_exists($path)) {
        abort(404);
    }
    
    return response()->file($path);
});

// Auth Admin Router
$router->group(['prefix' => 'api/auth_admin'], function () use ($router) {
    $router->post('register', 'AuthAdminController@register');
    $router->post('login', 'AuthAdminController@login');
    
    $router->group(['middleware' => 'auth:api'], function() use ($router) {
        $router->post('logout', 'AuthAdminController@logout');
        $router->post('refresh', 'AuthAdminController@refresh');
        $router->get('me', 'AuthAdminController@me');
    });
});

// Auth User
$router->group(['prefix' => 'api/auth'], function () use ($router) {
    $router->post('register', 'AuthUsersController@register');
    $router->post('login', 'AuthUsersController@login');
    
    $router->group(['middleware' => 'auth:api'], function () use ($router) {
        $router->get('me', 'AuthUsersController@me');
        $router->post('logout', 'AuthUsersController@logout');
        $router->post('refresh', 'AuthUsersController@refresh');
    });
});

// $router->get('api/invite-codes', 'InviteCodesController@index');
// $router->post('api/invite-codes', 'InviteCodesController@store');
// $router->get('api/invite-codes/validate/{code}', 'InviteCodesController@validateCode');
// $router->post('api/invite-codes/use/{code}', 'InviteCodesController@useCode');

$router->group(['prefix' => 'api', 'middleware' => 'auth'], function () use ($router) {
    $router->get('invite-codes', 'InviteCodesController@index');
    $router->post('invite-codes', 'InviteCodesController@store');
    $router->get('invite-codes/validate/{code}', 'InviteCodesController@validateCode');
    $router->post('invite-codes/use/{code}', 'InviteCodesController@useCode');
});

// Novel Routes
$router->group(['prefix' => 'api/novel'], function () use ($router) {
    $router->get('/', 'NovelController@index');
    $router->get('{id}', 'NovelController@show');

    // Auth-protected Novel routes
    $router->group(['middleware' => 'auth'], function () use ($router) {
        $router->post('/', 'NovelController@store');
        $router->put('{id}', 'NovelController@update');
        $router->delete('{id}', 'NovelController@destroy');
    });

    // Nested Chapter Routes - FIXED
    $router->group(['prefix' => '{novelId}/chapter'], function () use ($router) {
        $router->get('/', 'NovelChapterController@index');
        $router->get('{chapterId}', 'NovelChapterController@show');

        // Auth-protected Chapter routes
        $router->group(['middleware' => 'auth'], function () use ($router) {
            $router->post('/', 'NovelChapterController@store');
            $router->put('{chapterId}', 'NovelChapterController@update');
            $router->delete('{chapterId}', 'NovelChapterController@destroy');
        });
    });
});

// Translation Novel Routes 
$router->group(['prefix' => 'api/translation_novel'], function () use ($router) {
    $router->get('/', 'TranslationNovelController@index');
    $router->get('{id}', 'TranslationNovelController@show');

    // Auth-protected Novel routes
    $router->group(['middleware' => 'auth'], function () use ($router) {
        $router->post('/', 'TranslationNovelController@store');
        $router->put('{id}', 'TranslationNovelController@update');
        $router->delete('{id}', 'TranslationNovelController@destroy');
    });

    // Nested Chapter Routes - FIXED
    $router->group(['prefix' => '{novelId}/chapter'], function () use ($router) {
        $router->get('/', 'TranslationNovelChapterController@index');
        $router->get('{chapterId}', 'TranslationNovelChapterController@show');

        // Auth-protected Chapter routes
        $router->group(['middleware' => 'auth'], function () use ($router) {
            $router->post('/', 'TranslationNovelChapterController@store');
            $router->put('{chapterId}', 'TranslationNovelChapterController@update');
            $router->delete('{chapterId}', 'TranslationNovelChapterController@destroy');
        });
    });
});