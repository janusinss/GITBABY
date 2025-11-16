<?php
/**
 * Contacts API Endpoint
 * Handles HTTP requests for contact messages
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../database.php';
require_once '../classes/Contact.php';

$db = getDbConnection();
$contact = new Contact($db);

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : 'read';
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$status = isset($_GET['status']) ? $_GET['status'] : null;

try {
    switch ($action) {
        case 'read':
            if ($id) {
                $result = $contact->getContactById($id);
            } else {
                $result = $contact->getContacts($status);
            }
            echo json_encode($result);
            break;
            
        case 'stats':
            $result = $contact->getContactStats();
            echo json_encode($result);
            break;
            
        case 'add':
        case 'submit':
            if ($method === 'POST') {
                $data = json_decode(file_get_contents('php://input'), true);
                if (!$data) $data = $_POST;
                
                // Validate required fields
                if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Name, email, and message are required'
                    ]);
                    break;
                }
                
                $result = $contact->addContact($data);
                echo json_encode($result);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid request method']);
            }
            break;
            
        case 'update_status':
            if ($method === 'POST' || $method === 'PUT') {
                $data = json_decode(file_get_contents('php://input'), true);
                if (!$data) $data = $_POST;
                
                if (!$id) {
                    echo json_encode(['success' => false, 'message' => 'Contact ID is required']);
                    break;
                }
                
                if (empty($data['status'])) {
                    echo json_encode(['success' => false, 'message' => 'Status is required']);
                    break;
                }
                
                $result = $contact->updateContactStatus($id, $data['status']);
                echo json_encode($result);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid request method']);
            }
            break;
            
        case 'delete':
            if ($method === 'POST' || $method === 'DELETE') {
                if (!$id) {
                    echo json_encode(['success' => false, 'message' => 'Contact ID is required']);
                    break;
                }
                
                $result = $contact->deleteContact($id);
                echo json_encode($result);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid request method']);
            }
            break;
            
        default:
            echo json_encode([
                'success' => false,
                'message' => 'Invalid action. Use: read, stats, add, submit, update_status, delete'
            ]);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}
?>