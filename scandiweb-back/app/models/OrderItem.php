<?php

class OrderItem {
    protected $conn, $table = "order_items";

    public function __construct() {
        global $conn;
        $this->conn = $conn;
    }

    public function create($order_id, $product_id, $quantity) {
        $query = "INSERT INTO " . $this->table . " (order_id, product_id, quantity) VALUES (?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ssi", $order_id, $product_id, $quantity);
        $stmt->execute();

        echo json_encode("Order item created");
    }
}