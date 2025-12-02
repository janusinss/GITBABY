<?php
/**
 * Upload API Endpoint
 * Handles image file uploads
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['file'];
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
        $fileType = $file['type'];

        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];

        if (in_array($fileExt, $allowed)) {
            if ($fileSize < 5000000) { // 5MB limit
                // Create unique filename to prevent overwrites
                $newFileName = uniqid('', true) . "." . $fileExt;
                $uploadDir = '../img/uploads/';
                
                // Create directory if it doesn't exist
                if (!file_exists($uploadDir)) {
                    mkdir($uploadDir, 0777, true);
                }

                $destination = $uploadDir . $newFileName;

                if (move_uploaded_file($fileTmpName, $destination)) {
                    // Return the path relative to the root (img/uploads/...)
                    $response['success'] = true;
                    $response['path'] = 'img/uploads/' . $newFileName;
                    $response['message'] = 'File uploaded successfully';
                } else {
                    $response['message'] = 'Failed to move uploaded file.';
                }
            } else {
                $response['message'] = 'File is too large. Max 5MB.';
            }
        } else {
            $response['message'] = 'Invalid file type. Allowed: ' . implode(', ', $allowed);
        }
    } else {
        $response['message'] = 'No file uploaded or upload error.';
    }
} else {
    $response['message'] = 'Invalid request method.';
}

echo json_encode($response);
?>
