<?php

abstract class Product {

    protected $conn, $table = 'products';

    public function __construct() {
        global $conn;
        $this->conn = $conn;
    }

    abstract public function read();
    public function getProduct($product_id) {
        try {
            $productQuery = "SELECT * FROM " . $this->table . " WHERE id = ?";
            $productStmt = $this->conn->prepare($productQuery);
            $productStmt->bind_param("s", $product_id);
            $productStmt->execute();
            $product = $productStmt->get_result()->fetch_all(MYSQLI_ASSOC);
    
            if ($product[0]) {
                setPrices($this->conn, $product[0]);
                setGallery($this->conn, $product[0]);
                setCurrency($this->conn, $product[0]);
                setAttributes($this->conn, $product[0]);
                // setCategory($this->conn, $product[0]);
            }
    
            return $product[0];
        } catch (Throwable $e) {
            error_log("Error fetching product: " . $e->getMessage());
            return null;
        }
    }
    
}

function setGallery(&$conn, &$product) {

    $galleryQuery = "SELECT * FROM galleries WHERE product_id = ?";
    $galleryStmt = $conn->prepare($galleryQuery);
    $galleryStmt->bind_param("s", $product['id']);
    $galleryStmt->execute();    
    $gallery = $galleryStmt->get_result()->fetch_all(MYSQLI_ASSOC);
    foreach ($gallery as &$image) {
        $product['gallery'][] = $image['image_url'];
    }

}

function setCurrency(&$conn, &$product) {
    $currencyQuery = "SELECT * FROM currencies WHERE id = 1";
    $currencyStmt = $conn->prepare($currencyQuery);
    $currencyStmt->execute();    
    $currency = $currencyStmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $prices = &$product['prices'];
    
    foreach($prices as &$price) {
        $price['currency'] = $currency[0];
    }
}

function setCategory(&$conn, &$product) {
    $categoryQuery = "SELECT * FROM categories WHERE id = ?";
    $categoryStmt = $conn->prepare($categoryQuery);
    $categoryStmt->bind_param("s", $product['category_id']);
    $categoryStmt->execute();    
    $category = $categoryStmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $product['category'] = $category[0]['name'];
}

function setPrices(&$conn, &$product){
    $pricesQuery = "SELECT * FROM prices WHERE product_id = ?";
    $pricesStmt = $conn->prepare($pricesQuery);
    $pricesStmt->bind_param("s", $product['id']);
    $pricesStmt->execute();
    $prices = $pricesStmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $product['prices'] = $prices;
}

function setAttributes(&$conn, &$product) {
    $attributesSetQuery = "SELECT * FROM attribute_sets WHERE product_id = ?";
    $attributesSetStmt = $conn->prepare($attributesSetQuery);
    $attributesSetStmt->bind_param("s", $product['id']);
    $attributesSetStmt->execute();
    $attributes_set = $attributesSetStmt->get_result()->fetch_all(MYSQLI_ASSOC);

    foreach ($attributes_set as &$attribute_set) {
        $attributesQuery = "SELECT * FROM attributes WHERE attribute_set_id = ?";
        $attributesStmt = $conn->prepare($attributesQuery);
        $attributesStmt->bind_param("s", $attribute_set['id']);
        $attributesStmt->execute();
        $attributes = $attributesStmt->get_result()->fetch_all(MYSQLI_ASSOC);
        $attribute_set['items'] = $attributes;
    }

    $product['attributes'] = $attributes_set;
    //echo json_encode($product);
}

function setProducts(&$conn, &$table, $category_id) {
    $productQuery = "SELECT * FROM " . $table . " WHERE category_id = ?";
    $productStmt = $conn->prepare($productQuery);
    $productStmt->bind_param("s", $category_id);
    $productStmt->execute();
    $products = $productStmt->get_result()->fetch_all(MYSQLI_ASSOC);
    return $products;
}

function readProducts(&$conn, &$table, $category_id = 1) {
    $result = [];
    $products = setProducts($conn, $table, $category_id);

    if ($products) {
        foreach ($products as &$product) {
            setPrices($conn, $product);
            setCategory($conn, $product);
            setGallery($conn, $product);
            setCurrency($conn, $product);
            setAttributes($conn, $product);
        }
        $result = $products;
    }

    return $result;
}


class AllProducts extends Product {

    public function read() {
        $clothesProducts = readProducts($this->conn, $this->table, 1);
        return $clothesProducts;
    }

    
}

class ClothesProduct extends Product {

    public function read() {
        $clothesProducts = readProducts($this->conn, $this->table, 2);
        return $clothesProducts;
    }

    public function getProduct($product_id) {
        
    }


}

class TechProduct extends Product {

    public function read() {
        $techProducts = readProducts($this->conn, $this->table, 3);
        return $techProducts;
    }

}