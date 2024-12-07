<?php   
    /**
 * API Endpoint Router
 *
 * This PHP script serves as a simple API endpoint router, handling GET and POST requests for specific resources.
 *
 *
 * Usage:
 * 1. Include this script in your project.
 * 2. Define resource-specific logic in the 'get.php' and 'post.php' modules.
 * 3. Send requests to the appropriate endpoints defined in the 'switch' cases below.
 */

    // Allow requests from any origin
    header('Access-Control-Allow-Origin: *');
    
    // Allow specific HTTP methods
    header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
    
    // Allow specific headers
    header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization');

    // Set Content-Type header to application/json for all responses
    header('Content-Type: application/json');
    
    // Handle preflight requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
        exit(0);
    }
    
    // Include required modules
    require_once "./modules/get.php";
    require_once "./modules/post.php";
    require_once "./modules/config/database.php";
    
    $con = new Connection();
    $pdo = $con->connect();
    
    // Initialize Get and Post objects
    $get = new Get($pdo);
    $post = new Post($pdo);
    
    // Check if 'request' parameter is set in the request
    if (isset($_REQUEST['request'])) {
        // Split the request into an array based on '/'
        $request = explode('/', $_REQUEST['request']);
    } else {
        // If 'request' parameter is not set, return a 404 response
        echo json_encode(["message" => "Not Found"]);
        http_response_code(404);
        exit();
    }

    // Handle requests based on HTTP method
    switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        switch ($request[0]) {
            case 'getproducts':
                echo json_encode($get->getProducts()); // Adjust according to your method
                break;
            case 'getcart':
                echo json_encode($get->getCart());
                    break;
                
            default:
                echo json_encode(["message" => "This is forbidden"]);
                http_response_code(403);
                break;
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        $files = $_FILES; 
        switch ($request[0]) {
            case 'userlogin':
                echo json_encode($post->userlogin($data));
                break;
            case 'register':
                echo json_encode($post->register($data));
                break;
            case 'addproduct':
                echo json_encode($post->addProduct($data, $files));
                break;
            case 'addtocart':
                echo json_encode($post->addToCart($data));
                break;
            case 'updatecart':
                echo json_encode($post->updateCart($data));
                break;
            case 'removefromcart':
                echo json_encode($post->removeFromCart($data));
                break;
                case 'confirmorder':
                    if (isset($data->user_id) && isset($data->product_ids)) {
                        echo $post->confirmOrder($data->user_id, $data->product_ids);
                    } else {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'message' => 'User ID or Product IDs not provided']);
                    }
                    break;
            default:
                echo json_encode(["message" => "This is forbidden"]);
                http_response_code(403);
                break;
        }
        break;

    default:
        echo json_encode(["message" => "Method not available"]);
        http_response_code(404);
        break;
}
    
    

?>