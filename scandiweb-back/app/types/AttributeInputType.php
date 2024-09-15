<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;

class AttributeInputType extends InputObjectType
{
    public function __construct()
    {
        $config = [
            'name' => 'AttributeInput',
            'fields' => [
                'id' => ['type' => Type::id()],
                'value' => ['type' => Type::string()],
            ],
        ];
        parent::__construct($config);
    }
}
