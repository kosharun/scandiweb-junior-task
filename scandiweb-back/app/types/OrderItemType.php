<?php
namespace App\GraphQL\Types;

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;



class OrderItemType extends InputObjectType {
    public function __construct() {
        $config = [
            'name' => 'OrderItems',
            'fields' => [
                'product_id' => ['type' => Type::id()],
                'quantity' => ['type' => Type::int()],
                'attributes' => ['type' => Type::listOf(new AttributeInputType())],
            ],
        ];
        parent::__construct($config);
    }
}
