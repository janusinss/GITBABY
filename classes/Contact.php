<?php
/**
 * Contact Class
 * Handles database operations for contact messages
 */

class Contact {
    private $conn;
    private $table = 'contacts';
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    /**
     * Get all contact messages
     * @param string $status Filter by status (optional)
     * @return array Contact messages
     */
    public function getContacts($status = null) {
        try {
            if ($status) {
                $query = "SELECT * FROM " . $this->table . " 
                         WHERE status = :status 
                         ORDER BY created_at DESC";
                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':status', $status);
            } else {
                $query = "SELECT * FROM " . $this->table . " 
                         ORDER BY created_at DESC";
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
                'message' => 'Error fetching contacts: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get single contact message by ID
     * @param int $id Contact ID
     * @return array Contact data
     */
    public function getContactById($id) {
        try {
            $query = "SELECT * FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            $contact = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($contact) {
                return [
                    'success' => true,
                    'data' => $contact
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Contact not found'
                ];
            }
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching contact: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Add new contact message
     * @param array $data Contact data
     * @return array Result with new contact ID
     */
    public function addContact($data) {
        try {
            // Validate email
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return [
                    'success' => false,
                    'message' => 'Invalid email address'
                ];
            }
            
            $query = "INSERT INTO " . $this->table . " 
                     (name, email, subject, message, status) 
                     VALUES (:name, :email, :subject, :message, 'new')";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(':name', $data['name']);
            $stmt->bindParam(':email', $data['email']);
            $stmt->bindParam(':subject', $data['subject']);
            $stmt->bindParam(':message', $data['message']);
            
            $stmt->execute();
            
            return [
                'success' => true,
                'message' => 'Contact message sent successfully',
                'id' => $this->conn->lastInsertId()
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error adding contact: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Update contact status
     * @param int $id Contact ID
     * @param string $status New status
     * @return array Result
     */
    public function updateContactStatus($id, $status) {
        try {
            $query = "UPDATE " . $this->table . " 
                     SET status = :status
                     WHERE id = :id";
            
            $stmt = $this->conn->prepare($query);
            
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':status', $status);
            
            $stmt->execute();
            
            return [
                'success' => true,
                'message' => 'Contact status updated successfully'
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error updating contact status: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Delete contact message
     * @param int $id Contact ID
     * @return array Result
     */
    public function deleteContact($id) {
        try {
            $query = "DELETE FROM " . $this->table . " WHERE id = :id";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            
            if ($stmt->rowCount() > 0) {
                return [
                    'success' => true,
                    'message' => 'Contact deleted successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'message' => 'Contact not found'
                ];
            }
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error deleting contact: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get contact statistics (demonstrates aggregate functions)
     * @return array Statistics data
     */
    public function getContactStats() {
        try {
            $query = "SELECT 
                        COUNT(*) as total_messages,
                        COUNT(CASE WHEN status = 'new' THEN 1 END) as new_messages,
                        COUNT(CASE WHEN status = 'read' THEN 1 END) as read_messages,
                        COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied_messages,
                        DATE(MAX(created_at)) as last_message_date
                      FROM " . $this->table;
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            
            return [
                'success' => true,
                'data' => $stmt->fetch(PDO::FETCH_ASSOC)
            ];
            
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Error fetching contact stats: ' . $e->getMessage()
            ];
        }
    }
}
?>