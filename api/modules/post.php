<?php
// POST Method

require_once "global.php"; 
require_once __DIR__ . '/../vendor/autoload.php';


// Import PHPMailer classes
use Firebase\JWT\JWT;



class Post extends GlobalMethods{
    private $pdo;

    public function __construct(\PDO $pdo){
        $this->pdo = $pdo;
    }
    
    /**
     * Add a new with the provided data.
     *
     * @param array|object $data
     *   The data representing the new.
     *
     * @return array|object
     *   The added data.
     */

     //Enter the public function below
     public function userlogin($data) {
        $username = isset($data->username) ? $data->username : null;
        $password = isset($data->password) ? $data->password : null;
    
        if (!$username || !$password) {
            return array('error' => 'Username and password are required');
        }
    
        // Query user table
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($user) {
            // Debugging output
            error_log(print_r($user, true));
        }
    
        if ($user && password_verify($password, $user['password'])) {
            $secret_key = 'your_secret_key'; // Define your secret key here
            $algorithm = 'HS256';
            $payload = array(
                "id" => $user['id'],
                "username" => $user['username'], // Include the username in the payload
                "exp" => time() + (60 * 60 * 24) // Token expiration time (1 day)
            );
            $jwt = JWT::encode($payload, $secret_key, $algorithm);
    
            return array('success' => 'Login successful', 'token' => $jwt, 'id' => $user['id'], 'username' => $user['username']);
        } else {
            return array('error' => 'Invalid username or password');
        }
    }
    
    
    

    public function register($data) {
        $username = isset($data->username) ? $data->username : null;    
        $password = isset($data->password) ? $data->password : null;
        $email = isset($data->email) ? $data->email : null;

        if (!$username || !$password || !$email) {
            return array('error' => 'All fields are required');
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $this->pdo->prepare("INSERT INTO users (username, password, email) VALUES (?, ?, ?)");
        if ($stmt->execute([$username, $hashedPassword, $email])) {
            return array('success' => 'Registration successful');
        } else {
            return array('error' => 'Registration failed');
        }
    }

    public function addProduct() {
        $name = isset($_POST['name']) ? $_POST['name'] : null;
        $price = isset($_POST['price']) ? number_format((float)$_POST['price'], 3, '.', '') : null;
        $description = isset($_POST['description']) ? $_POST['description'] : null;
        $category = isset($_POST['category']) ? $_POST['category'] : null; // New category field
        $image = null;
    
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            // Existing file upload logic
            $fileTmpPath = $_FILES['image']['tmp_name'];
            $fileName = $_FILES['image']['name'];
            $uploadFileDir = __DIR__ . '/../../src/assets/uploaded_images/';
            if (!is_dir($uploadFileDir)) {
                mkdir($uploadFileDir, 0755, true);
            }
            $dest_path = $uploadFileDir . $fileName;
            if (move_uploaded_file($fileTmpPath, $dest_path)) {
                $image = $fileName;
            } else {
                http_response_code(500);
                return json_encode(array('error' => 'There was some error moving the file to the upload directory.'));
            }
        } else {
            http_response_code(400);
            return json_encode(array('error' => 'Image file is required.'));
        }
    
        if (!$name || !$price || !$description || !$category || !$image) { // Include category in the validation
            http_response_code(400);
            return json_encode(array('error' => 'All fields are required'));
        }
    
        try {
            $stmt = $this->pdo->prepare("INSERT INTO products (name, price, description, category, image) VALUES (?, ?, ?, ?, ?)");
            if ($stmt->execute([$name, $price, $description, $category, $image])) {
                return json_encode(array('success' => 'Product added successfully'));
            } else {
                http_response_code(500);
                return json_encode(array('error' => 'Failed to add product'));
            }
        } catch (PDOException $e) {
            http_response_code(500);
            return json_encode(array('error' => 'Failed to add product due to database error'));
        }
    }
    
    
    public function addToCart($data) {
        if (!isset($data->userId) || !isset($data->productId) || !isset($data->quantity)) {
            return array('error' => 'User ID, Product ID, and quantity are required');
        }
    
        $userId = $data->userId;
        $productId = $data->productId;
        $quantity = $data->quantity;
    
        try {
            // Check if the item already exists in the cart
            $stmt = $this->pdo->prepare("SELECT * FROM cart WHERE user_id = ? AND product_id = ?");
            $stmt->execute([$userId, $productId]);
            $item = $stmt->fetch(PDO::FETCH_ASSOC);
    
            if ($item) {
                // If item exists, update the quantity
                $stmt = $this->pdo->prepare("UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?");
                $stmt->execute([$quantity, $userId, $productId]);
            } else {
                // If item does not exist, insert new record
                $stmt = $this->pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
                $stmt->execute([$userId, $productId, $quantity]);
            }
    
            return array('success' => 'Product added to cart');
        } catch (\PDOException $e) {
            return array('error' => $e->getMessage());
        }
    }   
    
    public function updateCart($data) {
        $user_id = isset($data->user_id) ? $data->user_id : null;
        $product_id = isset($data->product_id) ? $data->product_id : null;
        $quantity = isset($data->quantity) ? $data->quantity : null;
    
        if (!$user_id || !$product_id || !$quantity) {
            return array('error' => 'User ID, Product ID, and Quantity are required');
        }
    
        try {
            $stmt = $this->pdo->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?");
            if ($stmt->execute([$quantity, $user_id, $product_id])) {
                return array('success' => 'Cart updated successfully');
            } else {
                return array('error' => 'Failed to update cart');
            }
        } catch (\PDOException $e) {
            return array('error' => $e->getMessage());
        }
    }
    
    public function removeFromCart($data) {
        $user_id = isset($data->user_id) ? $data->user_id : null;
        $product_id = isset($data->product_id) ? $data->product_id : null;
    
        if (!$user_id || !$product_id) {
            return json_encode(array('error' => 'User ID and Product ID are required'));
        }
    
        try {
            $stmt = $this->pdo->prepare("DELETE FROM cart WHERE user_id = ? AND product_id = ?");
            if ($stmt->execute([$user_id, $product_id])) {
                return json_encode(array('success' => 'Product removed from cart successfully'));
            } else {
                return json_encode(array('error' => 'Failed to remove product from cart'));
            }
        } catch (\PDOException $e) {
            return json_encode(array('error' => $e->getMessage()));
        }
    }
    

    

    public function confirmOrder($userId, $productIds) {
        try {
            // Insert selected cart items into the orders table
            $sqlInsert = "INSERT INTO orders (user_id, product_id, quantity, price, order_date)
                          SELECT c.user_id, c.product_id, c.quantity, p.price, NOW()
                          FROM cart c
                          JOIN products p ON c.product_id = p.id
                          WHERE c.user_id = ? AND c.product_id IN (" . implode(',', array_fill(0, count($productIds), '?')) . ")";
            $stmtInsert = $this->pdo->prepare($sqlInsert);
            $stmtInsert->execute(array_merge([$userId], $productIds));
    
            // Delete selected cart items after inserting them into the orders table
            $sqlDelete = "DELETE FROM cart WHERE user_id = ? AND product_id IN (" . implode(',', array_fill(0, count($productIds), '?')) . ")";
            $stmtDelete = $this->pdo->prepare($sqlDelete);
            $stmtDelete->execute(array_merge([$userId], $productIds));
    
            // Return a success response
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            // Return an error response
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Order confirmation failed', 'error' => $e->getMessage()]);
        }
    }
    
    
    
}