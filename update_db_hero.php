<?php
require_once 'database.php';

try {
    $db = getDbConnection();
    
    // Check if column exists
    $check = $db->query("SHOW COLUMNS FROM profile LIKE 'hero_image'");
    if ($check->rowCount() == 0) {
        // Add column
        $sql = "ALTER TABLE profile ADD COLUMN hero_image VARCHAR(255) AFTER hero_bio";
        $db->exec($sql);
        echo "Column 'hero_image' added successfully.";
    } else {
        echo "Column 'hero_image' already exists.";
    }
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
