/**
 * Post model interface
 * Represents a blog post from the database
 */
export interface Post {
  /** Unique identifier from database */
  id: number;
  
  /** Post title (max 255 characters) */
  title: string;
  
  /** Post content/body text */
  content: string;
  
  /** ISO 8601 timestamp when post was created */
  created_at: string;
  
  /** ISO 8601 timestamp when post was last updated */
  updated_at: string;
  
  /** 
   * Indicates this is an optimistic post (not yet confirmed by server)
   * Only present on temporary posts before API confirmation
   */
  _optimistic?: boolean;
}

/**
 * Data required to create a new post
 */
export interface CreatePostData {
  /** Post title (3-255 characters) */
  title: string;
  
  /** Post body content (minimum 10 characters) */
  body: string;
}

/**
 * Response from post creation API
 */
export interface CreatePostResponse {
  message: string;
  post: Post;
}
