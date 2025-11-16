<?php
/**
 * Project Class
 * Handles all database operations for projects data
 */

class Project {
    private $conn;
    private $table = 'projects';
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Get all projects
     * @param int $profileId Profile ID (optional)
     * @return array Projects data
     */
    public function getProjects($profileId = null) {
        try {
            if ($profileId) {
                $query = "SELECT * FROM " . $this->table . " 
                         WHERE profile_id = :profile_id 
                         ORDER BY display_order ASC, created_at DESC";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':profile_id', $profileId, PDO::PARAM_INT);
            } else {
                $query = "SELECT * FROM " . $this->table . " 
                         ORDER BY display_order ASC, created_at DESC";
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
                'message' => 'Error fetching projects: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get single project by ID
     * @param int $id Project ID
     * @return array Project data
     */
    public function getProjectById($id) {
        try {
            $query = "SELECT * FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $project = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($project) {
                return [
                    'success' => true,
                    'data' => $project
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Project not found'
                ];
            }
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching project: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Add new project
     * @param array $data Project data
     * @return array Result with new project ID
     */
    public function addProject($data) {
        try {
            $query = "INSERT INTO " . $this->table . " 
                     (profile_id, title, description, link, image, tags, display_order) 
                     VALUES (:profile_id, :title, :description, :link, :image, :tags, :display_order)";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(':profile_id', $data['profile_id'], PDO::PARAM_INT);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':link', $data['link']);
            $stmt->bindParam(':image', $data['image']);
            $stmt->bindParam(':tags', $data['tags']);
            $stmt->bindParam(':display_order', $data['display_order'], PDO::PARAM_INT);
            
            $stmt->execute();
            
            return [
                'success' => true,
                'message' => 'Project added successfully',
                'id' => $this->conn->lastInsertId()
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error adding project: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Update existing project
     * @param int $id Project ID
     * @param array $data Updated project data
     * @return array Result
     */
    public function updateProject($id, $data) {
        try {
            $query = "UPDATE " . $this->table . " 
                     SET title = :title, 
                         description = :description, 
                         link = :link, 
                         image = :image, 
                         tags = :tags, 
                         display_order = :display_order
                     WHERE id = :id";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':link', $data['link']);
            $stmt->bindParam(':image', $data['image']);
            $stmt->bindParam(':tags', $data['tags']);
            $stmt->bindParam(':display_order', $data['display_order'], PDO::PARAM_INT);
            
            $stmt->execute();
            
            return [
                'success' => true,
                'message' => 'Project updated successfully'
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error updating project: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Delete project
     * @param int $id Project ID
     * @return array Result
     */
    public function deleteProject($id) {
        try {
            $query = "DELETE FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                return [
                    'success' => true,
                    'message' => 'Project deleted successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Project not found'
                ];
            }
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error deleting project: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Search projects by tags (demonstrates LIKE)
     * @param int $profileId Profile ID
     * @param string $tag Tag to search
     * @return array Matching projects
     */
    public function searchProjectsByTag($profileId, $tag) {
        try {
            $query = "SELECT * FROM " . $this->table . " 
                     WHERE profile_id = :profile_id 
                     AND tags LIKE :tag
                     ORDER BY display_order ASC";
            
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':profile_id', $profileId, PDO::PARAM_INT);
            $searchTag = '%' . $tag . '%';
            $stmt->bindParam(':tag', $searchTag);
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error searching projects: ' . $e->getMessage()
            ];
        }
    }
}
?>