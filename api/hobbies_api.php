<?php
/**
 * Hobbies/Tools API Endpoint
 * Handles HTTP requests for hobbies and tools operations
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../database.php';
require_once '../classes/Hobby.php';

$db = getDbConnection();
$hobby = new Hobby($db);

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : 'read';
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$profileId = isset($_GET['profile_id']) ? intval($_GET['profile_id']) : null;
$category = isset($_GET['category']) ? $_GET['category'] : null;

try {
    switch ($action) {
        case 'read':
            if ($id) {
                $result = $hobby->getHobbyById($id);
            } else {
                $result = $hobby->getHobbies($profileId, $category);
            }
            echo json_encode($result);
            break;
            
        case 'add':
            if ($method === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                if (!$data) $data = $_POST;
                
                if (empty($data['name']) || empty($data['profile_id'])) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Name and profile_id are required'
                    ]);
                    break;
                }
                
                // Set default category if not provided
                if (!isset($data['category'])) {
                    $data['category'] = 'hobby';
                }
                
                $result = $hobby->addHobby($data);
                echo json_encode($result);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid request method']);
            }
            break;
            
        case 'update':
            if ($method === 'POST' || $method === 'PUT') {
                $data = json_decode(file_get_contents('php://input'), true);
                if (!$data) $data = $_POST;
                
                if (!$id) {
                    echo json_encode(['success' => false, 'message' => 'Hobby ID is required']);
                    break;
                }
                
                $result = $hobby->updateHobby($id, $data);
                echo json_encode($result);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid request method']);
            }
            break;
            
        case 'delete':
            if ($method === 'POST' || $method === 'DELETE') {
                if (!$id) {
                    echo json_encode(['success' => false, 'message' => 'Hobby ID is required']);
                    break;
                }
                
                $result = $hobby->deleteHobby($id);
                echo json_encode($result);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid request method']);
            }
            break;
            
        default:
            echo json_encode([
                'success' => false,
                'message' => 'Invalid action. Use: read, add, update, delete'
            ]);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>