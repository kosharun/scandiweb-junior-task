<?php

abstract class Category {
    
    protected $table = 'categories', $conn;


    public function __construct() {
        global $conn;
        $this->conn = $conn;
    }

    abstract public function read();
}


class AllCategories extends Category {

    public function read() {
        $query = "SELECT * FROM " . $this->table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        return $result;
    }

}


