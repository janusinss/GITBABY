<?php
/**
 * Education API Endpoint
 * Handles HTTP requests for education records
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../database.php';
require_once '../classes/Education.php';

$db = getDbConnection();
$education = new Education($db);

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : 'read';
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$profileId = isset($_GET['profile_id']) ? intval($_GET['profile_id']) : null;

try {
    switch ($action) {
        case 'read':
            if ($id) {
                $result = $education->getEducationById($id);
            } else {
                $result = $education->getEducation($profileId);
            }
            echo json_encode($result);
            break;
            
        case 'add':
            if ($method === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                if (!$data) $data = $_POST;
                
                if (empty($data['institution']) || empty($data['profile_id'])) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Institution and profile_id are required'
                    ]);
                    break;
                }
                
                // Set default display_order if not provided
                if (!isset($data['display_order'])) {
                    $data['display_order'] = 0;
                }
                
                $result = $education->addEducation($data);
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
                    echo json_encode(['success' => false, 'message' => 'Education ID is required']);
                    break;
                }
                
                $result = $education->updateEducation($id, $data);
                echo json_encode($result);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid request method']);
            }
            break;
            
        case 'delete':
            if ($method === 'POST' || $method === 'DELETE') {
                if (!$id) {
                    echo json_encode(['success' => false, 'message' => 'Education ID is required']);
                    break;
                }
                
                $result = $education->deleteEducation($id);
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