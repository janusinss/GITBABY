<?php
/**
 * Profile Class
 * Handles all database operations for profile data
 * Implements CRUD operations with prepared statements
 */

class Profile {
    private $conn;
    private $table = 'profile';
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Get all profiles (typically returns one for personal portfolio)
     * @return array Profile data
     */
    public function getProfiles() {
        try {
            $query = "SELECT * FROM " . $this->table . " ORDER BY id DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching profiles: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get single profile by ID
     * @param int $id Profile ID
     * @return array Profile data
     */
    public function getProfileById($id) {
        try {
            $query = "SELECT * FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $profile = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($profile) {
                return [
                    'success' => true,
                    'data' => $profile
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Profile not found'
                ];
            }
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching profile: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Add new profile
     * @param array $data Profile data
     * @return array Result with new profile ID
     */
    public function addProfile($data) {
        try {
            $query = "INSERT INTO " . $this->table . " 
                     (name, bio, role, location, contact_email, phone, linkedin, github, facebook, photo, years_experience, projects_completed) 
                     VALUES (:name, :bio, :role, :location, :contact_email, :phone, :linkedin, :github, :facebook, :photo, :years_experience, :projects_completed)";
            
            $stmt = $this->conn->prepare($query);
            
            // Bind parameters
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':bio', $data['bio']);
            $stmt->bindParam(':role', $data['role']);
            $stmt->bindParam(':location', $data['location']);
            $stmt->bindParam(':contact_email', $data['contact_email']);
            $stmt->bindParam(':phone', $data['phone']);
            $stmt->bindParam(':linkedin', $data['linkedin']);
            $stmt->bindParam(':github', $data['github']);
            $stmt->bindParam(':facebook', $data['facebook']);
            $stmt->bindParam(':photo', $data['photo']);
            $stmt->bindParam(':years_experience', $data['years_experience'], PDO::PARAM_INT);
            $stmt->bindParam(':projects_completed', $data['projects_completed'], PDO::PARAM_INT);
            
            $stmt->execute();
            
            return [
                'success' => true,
                'message' => 'Profile added successfully',
                'id' => $this->conn->lastInsertId()
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error adding profile: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Update existing profile
     * @param int $id Profile ID
     * @param array $data Updated profile data
     * @return array Result
     */
    public function updateProfile($id, $data) {
        try {
            $query = "UPDATE " . $this->table . " 
                     SET name = :name, 
                         bio = :bio, 
                         role = :role, 
                         location = :location, 
                         contact_email = :contact_email, 
                         phone = :phone, 
                         linkedin = :linkedin, 
                         github = :github, 
                         facebook = :facebook, 
                         photo = :photo, 
                         years_experience = :years_experience, 
                         projects_completed = :projects_completed
                     WHERE id = :id";
            
            $stmt = $this->conn->prepare($query);
            
            // Bind parameters
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':bio', $data['bio']);
            $stmt->bindParam(':role', $data['role']);
            $stmt->bindParam(':location', $data['location']);
            $stmt->bindParam(':contact_email', $data['contact_email']);
            $stmt->bindParam(':phone', $data['phone']);
            $stmt->bindParam(':linkedin', $data['linkedin']);
            $stmt->bindParam(':github', $data['github']);
            $stmt->bindParam(':facebook', $data['facebook']);
            $stmt->bindParam(':photo', $data['photo']);
            $stmt->bindParam(':years_experience', $data['years_experience'], PDO::PARAM_INT);
            $stmt->bindParam(':projects_completed', $data['projects_completed'], PDO::PARAM_INT);
            
            $stmt->execute();
            
            return [
                'success' => true,
                'message' => 'Profile updated successfully'
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error updating profile: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Delete profile
     * @param int $id Profile ID
     * @return array Result
     */
    public function deleteProfile($id) {
        try {
            $query = "DELETE FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                return [
                    'success' => true,
                    'message' => 'Profile deleted successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Profile not found'
                ];
            }
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error deleting profile: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get complete profile with stats (demonstrates JOIN and aggregation)
     * @param int $id Profile ID
     * @return array Complete profile data with statistics
     */
    public function getCompleteProfile($id) {
        try {
            $query = "SELECT 
                        p.*,
                        COUNT(DISTINCT s.id) as total_skills,
                        COUNT(DISTINCT pr.id) as total_projects,
                        ROUND(AVG(s.proficiency), 2) as avg_skill_proficiency
                      FROM " . $this->table . " p
                      LEFT JOIN skills s ON p.id = s.profile_id
                      LEFT JOIN projects pr ON p.id = pr.profile_id
                      WHERE p.id = :id
                      GROUP BY p.id";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $profile = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($profile) {
                return [
                    'success' => true,
                    'data' => $profile
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Profile not found'
                ];
            }
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching complete profile: ' . $e->getMessage()
            ];
        }
    }
}
?>