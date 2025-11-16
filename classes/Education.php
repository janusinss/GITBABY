<?php
/**
 * Education Class
 * Handles database operations for education records
 */

class Education {
    private $conn;
    private $table = 'education';
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Get all education records
     * @param int $profileId Profile ID (optional)
     * @return array Education data
     */
    public function getEducation($profileId = null) {
        try {
            if ($profileId) {
                $query = "SELECT * FROM " . $this->table . " 
                         WHERE profile_id = :profile_id 
                         ORDER BY display_order ASC, start_year DESC";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':profile_id', $profileId, PDO::PARAM_INT);
            } else {
                $query = "SELECT * FROM " . $this->table . " 
                         ORDER BY display_order ASC, start_year DESC";
                $stmt = $this->conn->prepare($query);
            }
            
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching education: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get single education record by ID
     * @param int $id Education ID
     * @return array Education data
     */
    public function getEducationById($id) {
        try {
            $query = "SELECT * FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $education = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($education) {
                return [
                    'success' => true,
                    'data' => $education
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Education record not found'
                ];
            }
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching education: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Add new education record
     * @param array $data Education data
     * @return array Result with new education ID
     */
    public function addEducation($data) {
        try {
            $query = "INSERT INTO " . $this->table . " 
                     (profile_id, institution, degree, field, start_year, end_year, description, display_order) 
                     VALUES (:profile_id, :institution, :degree, :field, :start_year, :end_year, :description, :display_order)";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(':profile_id', $data['profile_id'], PDO::PARAM_INT);
            $stmt->bindParam(':institution', $data['institution']);
            $stmt->bindParam(':degree', $data['degree']);
            $stmt->bindParam(':field', $data['field']);
            $stmt->bindParam(':start_year', $data['start_year'], PDO::PARAM_INT);
            $stmt->bindParam(':end_year', $data['end_year']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':display_order', $data['display_order'], PDO::PARAM_INT);
            
            $stmt->execute();
            
            return [
                'success' => true,
                'message' => 'Education record added successfully',
                'id' => $this->conn->lastInsertId()
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error adding education: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Update existing education record
     * @param int $id Education ID
     * @param array $data Updated education data
     * @return array Result
     */
    public function updateEducation($id, $data) {
        try {
            $query = "UPDATE " . $this->table . " 
                     SET institution = :institution, 
                         degree = :degree, 
                         field = :field, 
                         start_year = :start_year, 
                         end_year = :end_year, 
                         description = :description, 
                         display_order = :display_order
                     WHERE id = :id";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':institution', $data['institution']);
            $stmt->bindParam(':degree', $data['degree']);
            $stmt->bindParam(':field', $data['field']);
            $stmt->bindParam(':start_year', $data['start_year'], PDO::PARAM_INT);
            $stmt->bindParam(':end_year', $data['end_year']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':display_order', $data['display_order'], PDO::PARAM_INT);
            
            $stmt->execute();
            
            return [
                'success' => true,
                'message' => 'Education record updated successfully'
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error updating education: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Delete education record
     * @param int $id Education ID
     * @return array Result
     */
    public function deleteEducation($id) {
        try {
            $query = "DELETE FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                return [
                    'success' => true,
                    'message' => 'Education record deleted successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Education record not found'
                ];
            }
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error deleting education: ' . $e->getMessage()
            ];
        }
    }
}
?>