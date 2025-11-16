<?php
/**
 * Hobby Class
 * Handles database operations for hobbies and tools
 */

class Hobby {
    private $conn;
    private $table = 'hobbies';
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Get all hobbies/tools
     * @param int $profileId Profile ID (optional)
     * @param string $category Category filter (optional: 'hobby' or 'tool')
     * @return array Hobbies data
     */
    public function getHobbies($profileId = null, $category = null) {
        try {
            $query = "SELECT * FROM " . $this->table . " WHERE 1=1";
            $params = [];
            
            if ($profileId) {
                $query .= " AND profile_id = :profile_id";
                $params[':profile_id'] = $profileId;
            }
            
            if ($category) {
                $query .= " AND category = :category";
                $params[':category'] = $category;
            }
            
            $query .= " ORDER BY name ASC";
            
            $stmt = $this->conn->prepare($query);
            
            foreach ($params as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching hobbies: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get single hobby by ID
     * @param int $id Hobby ID
     * @return array Hobby data
     */
    public function getHobbyById($id) {
        try {
            $query = "SELECT * FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $hobby = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($hobby) {
                return [
                    'success' => true,
                    'data' => $hobby
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Hobby not found'
                ];
            }
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching hobby: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Add new hobby
     * @param array $data Hobby data
     * @return array Result with new hobby ID
     */
    public function addHobby($data) {
        try {
            $query = "INSERT INTO " . $this->table . " 
                     (profile_id, name, description, icon, category) 
                     VALUES (:profile_id, :name, :description, :icon, :category)";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(':profile_id', $data['profile_id'], PDO::PARAM_INT);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':icon', $data['icon']);
            $stmt->bindParam(':category', $data['category']);
            
            $stmt->execute();
            
            return [
                'success' => true,
                'message' => 'Hobby added successfully',
                'id' => $this->conn->lastInsertId()
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error adding hobby: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Update existing hobby
     * @param int $id Hobby ID
     * @param array $data Updated hobby data
     * @return array Result
     */
    public function updateHobby($id, $data) {
        try {
            $query = "UPDATE " . $this->table . " 
                     SET name = :name, 
                         description = :description, 
                         icon = :icon, 
                         category = :category
                     WHERE id = :id";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':icon', $data['icon']);
            $stmt->bindParam(':category', $data['category']);
            
            $stmt->execute();
            
            return [
                'success' => true,
                'message' => 'Hobby updated successfully'
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error updating hobby: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Delete hobby
     * @param int $id Hobby ID
     * @return array Result
     */
    public function deleteHobby($id) {
        try {
            $query = "DELETE FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                return [
                    'success' => true,
                    'message' => 'Hobby deleted successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Hobby not found'
                ];
            }
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error deleting hobby: ' . $e->getMessage()
            ];
        }
    }
}
?>