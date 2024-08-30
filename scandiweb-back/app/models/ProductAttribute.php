<?php

abstract class Product_Attribute {
    protected $table = 'product_attributes', $conn;

    public function __construct() {
        global $conn;
        $this->conn = $conn;
    }

    abstract public function read();
}

class AllAttributes extends Product_Attribute {

    public function read() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

}

class SizeAttribute extends Product_Attribute {
    
    public function read() {
        $query = "SELECT * FROM " . $this->table . " WHERE type = 'size'";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
    
}

class ColorAttribute extends Product_Attribute {

    public function read() {
        $query = "SELECT * FROM " . $this->table . " WHERE type = 'color'";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

}


