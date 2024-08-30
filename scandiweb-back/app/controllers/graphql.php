<?php

namespace App\Controller;

require_once __DIR__ . '/../config/conn.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/Category.php';

$modelsDirectory = __DIR__ . '/../models/';
$arrayOfTypeFiles = glob($modelsDirectory . '*.php');
foreach ($arrayOfTypeFiles as $filename) {
    require_once $filename;
}

$typesDirectory = __DIR__ . '/../types/';
$arrayOfTypeFiles = glob($typesDirectory . '*.php');
foreach ($arrayOfTypeFiles as $filename) {
    require_once $filename;
}


use AllCategories;
use AllProducts;
use ClothesProduct;
use TechProduct;
use Order;
use OrderItem;
use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use RuntimeException;
use Throwable;


use App\GraphQL\Types\PriceType;
use App\GraphQL\Types\AttributeSetType;
use App\GraphQL\Types\CategoryType;
use App\GraphQL\Types\OrderItemType;
use App\GraphQL\Types\ProductType;
use GraphQL\Type\Definition\InputObjectType;

class GraphQL {
    static public function handle() {
        try {



            $kategorijaTip = new ObjectType([
                'name' => 'Kategorija',
                'fields' => [
                    'id' => Type::id(),
                    'name' => Type::string(),
                ],
            ]);

            $kveri = new ObjectType([
                'name' => 'Kveri',
                'fields' => [
                    'kategorije' => [
                        'type' => Type::listOf($kategorijaTip),
                        'resolve' => function() {
                            return ['id' => 1, 'name' => 'Clothes'];
                        }
                    ],
                ],
            ]);

            $sema = new Schema(
                (new SchemaConfig())
                ->setQuery($kveri)
            );

            
            
            $variableValues = $input['variables'] ?? null;

            $result = GraphQLBase::executeQuery($sema, $kveri, null, null, $variableValues);
            $output = $result->toArray();


            
            $rawInput = file_get_contents('php://input');

            if ($rawInput === null) {
                throw new RuntimeException('Invalid input: request body is null');
            }

            $input = json_decode($rawInput, true);
            $query = $input['kveri'];
            $variableValues = $input['variables'] ?? null;

            $result = GraphQLBase::executeQuery($sema, $kveri, null, null, $variableValues);
            $output = $result->toArray();









            $clothesProductModel = new ClothesProduct();
            $techProductModel = new TechProduct();
            $allProductsModel = new AllProducts();
            $allCategoriesModel = new AllCategories();
            $orderModel = new Order();
            $orderItemModel = new OrderItem();


            $categoryType = new CategoryType();                
            $productType = new ProductType();
            
            $clothesProductType = new ObjectType([
                'name' => 'GetClothesProducts',
                'fields' => [
                    'products' => [
                        'type' => Type::listOf($productType),
                        'resolve' => function() use ($clothesProductModel) {
                            $clothesProducts = $clothesProductModel->read();
                            return $clothesProducts ? $clothesProducts : [];
                        }

                    ],
                ],
            ]);

            $techProductType = new ObjectType([
                'name' => 'GetTechProducts',
                'fields' => [
                    'products' => [
                        'type' => Type::listOf($productType),
                        'resolve' => function() use ($techProductModel) {
                            $techProducts = $techProductModel->read();
                            return $techProducts ? $techProducts : [];
                        }

                    ],
                ],
            ]);


            $orderItemType = new OrderItemType();

            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'GetCategories' => [
                        'type' => Type::listOf($categoryType),
                        'resolve' => function() use ($allCategoriesModel) {
                            $categories = $allCategoriesModel->read();
                            return $categories ? $categories : [];
                        }
                    ],
                    'GetClothesProducts' => [
                        'type' => $clothesProductType,
                        'resolve' => function() {
                            return []; 
                        }
                    ],
                    'GetTechProducts' => [
                        'type' => $techProductType,
                        'resolve' => function() {
                            return []; 
                        }
                    ],
                    'GetProduct' => [
                        'type' => $productType,
                        'args' => [
                            'id' => Type::id()
                        ],
                        'resolve' => function($root, $args) use ($allProductsModel) {
                            $product = $allProductsModel->getProduct($args['id']);
                            return $product ? $product : [];
                        }
                    ],
                ],
            ]);


            $mutationType = new ObjectType([
                'name' => 'Mutation',
                'fields' => [
                    'PlaceOrder' => [
                        'type' => Type::string(),
                        'args' => [
                            'order_items' => Type::listOf($orderItemType),
                            'price' => Type::float(),
                            'currency' => Type::string(),
                        ],
                        'resolve' => function($root, $args) use ($orderModel, $orderItemModel) {

                            $orderId = $orderModel->create($args['price'], $args['currency']);
                            $inputOrderItems = $args['order_items'];
                            foreach ($inputOrderItems as $orderItem) {
                                $orderItemModel->create($orderId, $orderItem['product_id'], $orderItem['quantity']);
                            }
                            return "Order placed";
                        }
                    ],
                ],
            ]);
            

            
        } catch (Throwable $e) {
            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                ],
            ];
        }

        header('Content-Type: application/json; charset=UTF-8');
        return json_encode($output);
    }
}
