<?php
/**
 * Skill Class
 * Handles all database operations for skills data
 * Implements CRUD operations with prepared statements
 */

class Skill
{
    private $conn;
    private $table = 'skills';

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /**
     * Get all skills for a profile
     * @param int $profileId Profile ID (optional)
     * @return array Skills data
     */
    public function getSkills($profileId = null)
    {
        try {
            if ($profileId) {
                $query = "SELECT * FROM " . $this->table . " 
                         WHERE profile_id = :profile_id 
                         ORDER BY id ASC";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':profile_id', $profileId, PDO::PARAM_INT);
            } else {
                $query = "SELECT * FROM " . $this->table . " ORDER BY id ASC";
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
                'message' => 'Error fetching skills: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get skills grouped by type
     * Demonstrates GROUP BY and aggregate functions
     * @param int $profileId Profile ID
     * @return array Grouped skills data
     */
    public function getSkillsByType($profileId)
    {
        try {
            $query = "SELECT 
                        type,
                        COUNT(*) as skill_count
                      FROM " . $this->table . "
                      WHERE profile_id = :profile_id
                      GROUP BY type
                      ORDER BY type ASC";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':profile_id', $profileId, PDO::PARAM_INT);
            $stmt->execute();

            return [
                'success' => true,
                'data' => $stmt->fetchAll(PDO::FETCH_ASSOC)
            ];

        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching skills by type: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get single skill by ID
     * @param int $id Skill ID
     * @return array Skill data
     */
    public function getSkillById($id)
    {
        try {
            $query = "SELECT * FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            $skill = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($skill) {
                return [
                    'success' => true,
                    'data' => $skill
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Skill not found'
                ];
            }

        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching skill: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Add new skill
     * @param array $data Skill data
     * @return array Result with new skill ID
     */
    public function addSkill($data)
    {
        try {
            $query = "INSERT INTO " . $this->table . " 
                     (profile_id, name, type, icon) 
                     VALUES (:profile_id, :name, :type, :icon)";

            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':profile_id', $data['profile_id'], PDO::PARAM_INT);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':type', $data['type']);
            $stmt->bindParam(':icon', $data['icon']);

            $stmt->execute();

            return [
                'success' => true,
                'message' => 'Skill added successfully',
                'id' => $this->conn->lastInsertId()
            ];

        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error adding skill: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Update existing skill
     * @param int $id Skill ID
     * @param array $data Updated skill data
     * @return array Result
     */
    public function updateSkill($id, $data)
    {
        try {
            $query = "UPDATE " . $this->table . " 
                     SET name = :name, 
                         type = :type, 
                         icon = :icon
                     WHERE id = :id";

            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':type', $data['type']);
            $stmt->bindParam(':icon', $data['icon']);

            $stmt->execute();

            return [
                'success' => true,
                'message' => 'Skill updated successfully'
            ];

        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error updating skill: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Delete skill
     * @param int $id Skill ID
     * @return array Result
     */
    public function deleteSkill($id)
    {
        try {
            $query = "DELETE FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                return [
                    'success' => true,
                    'message' => 'Skill deleted successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Skill not found'
                ];
            }

        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error deleting skill: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get high proficiency skills (demonstrates HAVING clause)
     * @param int $profileId Profile ID
     * @param int $minProficiency Minimum proficiency level
     * @return array High proficiency skills
     */
    public function getHighProficiencySkills($profileId, $minProficiency = 70)
    {
        // Deprecated: Proficiency column removed
        return ['success' => false, 'message' => 'Feature deprecated'];
    }
}
?>