<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class AttributeSetType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'name' => 'AttributeSet',
            'fields' => [
                'id' => ['type' => Type::string()],
                'items' => ['type' => Type::listOf(new AttributeType())],
                'name' => ['type' => Type::string()],
                'type' => ['type' => Type::string()],
                '__typename' => ['type' => Type::string()],
            ],
        ];
        parent::__construct($config);
    }
}
