<?php

require_once __DIR__ . '/vendor/autoload.php';

use FastRoute\RouteCollector;
use FastRoute\Dispatcher;
use App\Controller\GraphQL;

use function FastRoute\simpleDispatcher;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Return a successful response for preflight requests
    http_response_code(200); 
    exit();
}
$dispatcher = simpleDispatcher(function(RouteCollector $r) {
    $r->post('/graphql', [GraphQL::class, 'handle']);
});

$routeInfo = $dispatcher->dispatch(
    $_SERVER['REQUEST_METHOD'],
    $_SERVER['REQUEST_URI']
);

switch ($routeInfo[0]) {
    case Dispatcher::NOT_FOUND:
        header("HTTP/1.0 404 Not Found");
        echo "404 Not Found";
        break;
    case Dispatcher::METHOD_NOT_ALLOWED:
        header("HTTP/1.0 405 Method Not Allowed");
        echo "405 Method Not Allowed";
        break;
    case Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        if (is_callable($handler)) {
            echo call_user_func_array($handler, $vars);
        } else {
            header("HTTP/1.0 500 Internal Server Error");
            echo "500 Internal Server Error";
        }
        break;
}


