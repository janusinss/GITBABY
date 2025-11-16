<?php
/**
 * Projects API Endpoint
 * Handles HTTP requests for projects operations
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../database.php';
require_once '../classes/Project.php';

$db = getDbConnection();
$project = new Project($db);

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : 'read';
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$profileId = isset($_GET['profile_id']) ? intval($_GET['profile_id']) : null;

try {
    switch ($action) {
        case 'read':
            if ($id) {
                $result = $project->getProjectById($id);
            } else {
                $result = $project->getProjects($profileId);
            }
            echo json_encode($result);
            break;
            
        case 'search':
            $tag = isset($_GET['tag']) ? $_GET['tag'] : '';
            if ($profileId && $tag) {
                $result = $project->searchProjectsByTag($profileId, $tag);
            } else {
                $result = [
                    'success' => false,
                    'message' => 'Profile ID and tag are required for search'
                ];
            }
            echo json_encode($result);
            break;
            
        case 'add':
            if ($method === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                if (!$data) $data = $_POST;
                
                if (empty($data['title']) || empty($data['profile_id'])) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Title and profile_id are required'
                    ]);
                    break;
                }
                
                // Set default display_order if not provided
                if (!isset($data['display_order'])) {
                    $data['display_order'] = 0;
                }
                
                $result = $project->addProject($data);
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
                    echo json_encode(['success' => false, 'message' => 'Project ID is required']);
                    break;
                }
                
                $result = $project->updateProject($id, $data);
                echo json_encode($result);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid request method']);
            }
            break;
            
        case 'delete':
            if ($method === 'POST' || $method === 'DELETE') {
                if (!$id) {
                    echo json_encode(['success' => false, 'message' => 'Project ID is required']);
                    break;
                }
                
                $result = $project->deleteProject($id);
                echo json_encode($result);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid request method']);
            }
            break;
            
        default:
            echo json_encode([
                'success' => false,
                'message' => 'Invalid action. Use: read, search, add, update, delete'
            ]);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>