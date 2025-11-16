<?php
/**
 * Skills API Endpoint
 * Handles HTTP requests for skills operations
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../database.php';
require_once '../classes/Skill.php';

$db = getDbConnection();
$skill = new Skill($db);

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : 'read';
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$profileId = isset($_GET['profile_id']) ? intval($_GET['profile_id']) : null;

try {
    switch ($action) {
        case 'read':
            if ($id) {
                $result = $skill->getSkillById($id);
            } else {
                $result = $skill->getSkills($profileId);
            }
            echo json_encode($result);
            break;
            
        case 'by_type':
            if ($profileId) {
                $result = $skill->getSkillsByType($profileId);
            } else {
                $result = [
                    'success' => false,
                    'message' => 'Profile ID is required'
                ];
            }
            echo json_encode($result);
            break;
            
        case 'high_proficiency':
            $minProficiency = isset($_GET['min']) ? intval($_GET['min']) : 70;
            if ($profileId) {
                $result = $skill->getHighProficiencySkills($profileId, $minProficiency);
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
                if (!$data) $data = $_POST;
                
                if (empty($data['name']) || empty($data['profile_id'])) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Name and profile_id are required'
                    ]);
                    break;
                }
                
                $result = $skill->addSkill($data);
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
                    echo json_encode(['success' => false, 'message' => 'Skill ID is required']);
                    break;
                }
                
                $result = $skill->updateSkill($id, $data);
                echo json_encode($result);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid request method']);
            }
            break;
            
        case 'delete':
            if ($method === 'POST' || $method === 'DELETE') {
                if (!$id) {
                    echo json_encode(['success' => false, 'message' => 'Skill ID is required']);
                    break;
                }
                
                $result = $skill->deleteSkill($id);
                echo json_encode($result);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid request method']);
            }
            break;
            
        default:
            echo json_encode([
                'success' => false,
                'message' => 'Invalid action. Use: read, by_type, high_proficiency, add, update, delete'
            ]);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>