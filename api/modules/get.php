<?php

session_start();
require_once "global.php";

class Get extends GlobalMethods {
    private $pdo;

    public function __construct(\PDO $pdo) {
        $this->pdo = $pdo;
    }

    public function executeQuery($sql) {
        $data = array();
        $errmsg = "";
        $code = 0;

        try {
            $result = $this->pdo->query($sql)->fetchAll();
            if ($result) {
                foreach ($result as $record) {
                    array_push($data, $record);
                }
                $code = 200;
                return array("code" => $code, "data" => $data);
            } else {
                $errmsg = "No records found";
                $code = 404;
            }
        } catch (\PDOException $e) {
            $errmsg = $e->getMessage();
            $code = 403;
        }
        return array("code" => $code, "errmsg" => $errmsg);
    }

    public function getProducts() {
        $sql = "SELECT * FROM products";
        return $this->executeQuery($sql);
    }


    public function getCart() {
        $_SESSION['user_id'] = 1; 
        
        $userId = $_SESSION['user_id'];
        $sql = "SELECT p.id as productId, p.name as productName, p.description, p.image as image, p.price, c.quantity 
                FROM cart c 
                JOIN products p ON c.product_id = p.id 
                WHERE c.user_id = ?";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$userId]);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        error_log("Executed query: " . $stmt->queryString);
        error_log("Fetched data: " . print_r($data, true));
    
        if ($data) {
            return array("code" => 200, "data" => $data);
        } else {
            return array("code" => 404, "errmsg" => "Cart is empty");
        }
    }

    
    
    
    
}
