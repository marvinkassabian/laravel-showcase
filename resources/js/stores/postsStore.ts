import { defineStore } from 'pinia';
import axios, { AxiosError } from 'axios';
import type { Post, CreatePostData, CreatePostResponse } from '../models/Post';

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

interface CreatePostResult {
  success: boolean;
  post?: Post;
  error?: string;
}

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    posts: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchPosts(): Promise<void> {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get<Post[]>('/api/posts');
        this.posts = response.data;
      } catch (error) {
        this.error = 'Failed to fetch posts';
        console.error('Failed to fetch posts:', error);
      } finally {
        this.loading = false;
      }
    },

    async createPost(postData: CreatePostData): Promise<CreatePostResult> {
      // Optimistic update: Add post to UI immediately
      const tempId = Date.now();
      const optimisticPost: Post = {
        id: tempId,
        title: postData.title,
        content: postData.body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        _optimistic: true
      };

      // Add to beginning of array (newest first)
      this.posts.unshift(optimisticPost);

      try {
        // Make actual API call
        const response = await axios.post<CreatePostResponse>('/api/posts', {
          title: postData.title,
          body: postData.body
        });

        // Replace optimistic post with real one from server
        const index = this.posts.findIndex(p => p.id === tempId);
        if (index !== -1) {
          this.posts[index] = response.data.post;
        }

        return { success: true, post: response.data.post };
      } catch (error) {
        // Remove optimistic post on failure
        const index = this.posts.findIndex(p => p.id === tempId);
        if (index !== -1) {
          this.posts.splice(index, 1);
        }

        this.error = 'Failed to create post';
        
        const axiosError = error as AxiosError<{ errors?: Record<string, string[]> }>;
        
        if (axiosError.response?.data?.errors) {
          const errors = Object.values(axiosError.response.data.errors).flat();
          return { success: false, error: errors.join(', ') };
        }
        
        return { success: false, error: 'Failed to create post. Please try again.' };
      }
    }
  }
});
