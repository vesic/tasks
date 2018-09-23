<?php

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

$router->get('/hello', function () use ($router) {
    return '$router->app->version();';
});

$router->group(['prefix' => 'api/'], function () use ($router) {
    $router->get('/tasks', 'TasksController@index');
    $router->post('/tasks', 'TasksController@create');
    $router->get('/tasks/{id}', 'TasksController@show');
    $router->put('/tasks/{id}', 'TasksController@update');
    $router->put('/tasks/status/{id}', 'TasksController@updateStatus');
    $router->delete('/tasks/{id}', 'TasksController@destroy');
});
