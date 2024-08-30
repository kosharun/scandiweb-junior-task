<?php

class Order {
    protected $conn, $table = "orders";


    public function __construct() {
        global $conn;
        $this->conn = $conn;
    }


    public function create($price, $currency) {
        echo json_encode("Order created");
        $query = "INSERT INTO " . $this->table . " (price, currency) VALUES (?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->bind_param("ds", $price, $currency);
        $stmt->execute();
        return $stmt->insert_id;
    }
} 