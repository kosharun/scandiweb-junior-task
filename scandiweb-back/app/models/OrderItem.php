<?php

class OrderItem {
    protected $conn, $table = "order_items";

    public function __construct() {
        global $conn;
        $this->conn = $conn;
    }

    public function create($order_id, $product_id, $quantity, $attributes) {
        $query = "INSERT INTO " . $this->table . " (order_id, product_id, quantity) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssi", $order_id, $product_id, $quantity);
        $stmt->execute();

        $order_item_id = $stmt->insert_id;

        foreach($attributes as $attribute) {
            $this->createOrderItemAttribute($order_item_id, $attribute);
        }
        
    }

    public function createOrderItemAttribute($order_item_id, $attribute) {
        $query = "INSERT INTO join_orderitems_attributes (order_item_id, attribute_id) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ss", $order_item_id, $attribute['id']);
        $stmt->execute();

        echo json_encode($attribute['id']);
    }
}

