<?php
require_once 'database.php';

try {
    $db = getDbConnection();
    
    // Check if column exists
    $check = $db->query("SHOW COLUMNS FROM profile LIKE 'hero_bio'");
    if ($check->rowCount() == 0) {
        // Add column
        $sql = "ALTER TABLE profile ADD COLUMN hero_bio TEXT AFTER bio";
        $db->exec($sql);
        echo "Column 'hero_bio' added successfully.";
    } else {
        echo "Column 'hero_bio' already exists.";
    }
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
