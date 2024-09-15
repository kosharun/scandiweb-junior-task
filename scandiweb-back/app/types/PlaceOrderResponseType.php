<?php
namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class PlaceOrderResponseType extends ObjectType {
    public function __construct() {
        $config = [
            'name' => 'PlaceOrderResponse',
            'fields' => [
                'success' => ['type' => Type::boolean()],
                'orderId' => ['type' => Type::id()],
                'message' => ['type' => Type::string()],
            ],
        ];
        parent::__construct($config);
    }
}