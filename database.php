<?php
/**
 * Database Connection Configuration
 * 
 * This file establishes a PDO connection to the MySQL database
 * Uses prepared statements for security
 */

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'portfolio_db');
define('DB_USER', 'root');  // Change this to your MySQL username
define('DB_PASS', '');       // Change this to your MySQL password
define('DB_CHARSET', 'utf8mb4');

// Error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

/**
 * Get database connection using PDO
 * @return PDO Database connection object
 */
function getDbConnection() {
    static $conn = null;
    
    if ($conn === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            
            $conn = new PDO($dsn, DB_USER, DB_PASS, $options);
            
        } catch (PDOException $e) {
            // Log error in production, display in development
            error_log("Database Connection Error: " . $e->getMessage());
            die(json_encode([
                'success' => false,
                'message' => 'Database connection failed: ' . $e->getMessage()
            ]));
        }
    }
    
    return $conn;
}

/**
 * Test database connection
 * Uncomment to test when setting up
 */
// try {
//     $conn = getDbConnection();
//     echo json_encode([
//         'success' => true,
//         'message' => 'Database connection successful!'
//     ]);
// } catch (Exception $e) {
//     echo json_encode([
//         'success' => false,
//         'message' => 'Connection failed: ' . $e->getMessage()
//     ]);
// }
?>