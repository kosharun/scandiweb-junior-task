<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;


class CurrencyType extends ObjectType
{
    public function __construct()
    { 
        $config = [
            'name' => 'Currency',
            'fields' => [
                'id' => ['type' => Type::string()],
                'label' => ['type' => Type::string()],
                'symbol' => ['type' => Type::string()],
                '__typename' => ['type' => Type::string()],
            ],
        ];
        parent::__construct($config);
    }
}