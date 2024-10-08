<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class ProductType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'name' => 'Product',
            'fields' => [
                'id' => ['type' => Type::id()],
                'name' => ['type' => Type::string()],
                'in_stock' => ['type' => Type::boolean()],
                'gallery' => ['type' => Type::listOf(Type::string())],
                'description' => ['type' => Type::string()],
                'category' => ['type' => Type::string()],
                'attributes' => ['type' => Type::listOf(new AttributeSetType())],
                'prices' => ['type' => Type::listOf(new PriceType())],
                'brand' => ['type' => Type::string()],
                '__typename' => ['type' => Type::string()],
            ],
        ];
        parent::__construct($config);
    }
}
