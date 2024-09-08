<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

class AttributeType extends ObjectType
{
    public function __construct()
    {
        $config = [
            'name' => 'Attribute',
            'fields' => [
                'display_value' => ['type' => Type::string()],
                'value' => ['type' => Type::string()],
                'id' => ['type' => Type::string()],
                '__typename' => ['type' => Type::string()],
            ],
        ];
        parent::__construct($config);
    }
}
