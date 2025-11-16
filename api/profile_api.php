<?php
/**
 * Profile API Endpoint
 * Handles HTTP requests for profile operations
 * Returns JSON responses
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Include required files
require_once '../database.php';
require_once '../classes/Profile.php';

// Get database connection
$db = getDbConnection();
$profile = new Profile($db);

// Get request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : 'read';
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

// Handle different actions
try {
    switch ($action) {
        case 'read':
            if ($id) {
                $result = $profile->getProfileById($id);
            } else {
                $result = $profile->getProfiles();
            }
            echo json_encode($result);
            break;
            
        case 'complete':
            // Get complete profile with statistics
            if ($id) {
                $result = $profile->getCompleteProfile($id);
            } else {
                $result = [
                    'success' => false,
                    'message' => 'Profile ID is required'
                ];
            }
            echo json_encode($result);
            break;
            
        case 'add':
            if ($method === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                
                if (!$data) {
                    $data = $_POST;
                }
                
                // Validate required fields
                if (empty($data['name'])) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Name is required'
                    ]);
                    break;
                }
                
                $result = $profile->addProfile($data);
                echo json_encode($result);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid request method'
                ]);
            }
            break;
            
        case 'update':
            if ($method === 'POST' || $method === 'PUT') {
                $data = json_decode(file_get_contents('php://input'), true);
                
                if (!$data) {
                    $data = $_POST;
                }
                
                if (!$id) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Profile ID is required'
                    ]);
                    break;
                }
                
                $result = $profile->updateProfile($id, $data);
                echo json_encode($result);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid request method'
                ]);
            }
            break;
            
        case 'delete':
            if ($method === 'POST' || $method === 'DELETE') {
                if (!$id) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Profile ID is required'
                    ]);
                    break;
                }
                
                $result = $profile->deleteProfile($id);
                echo json_encode($result);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid request method'
                ]);
            }
            break;
            
        default:
            echo json_encode([
                'success' => false,
                'message' => 'Invalid action. Use: read, add, update, delete, complete'
            ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Server error: ' . $e->getMessage()
    ]);
}
?>