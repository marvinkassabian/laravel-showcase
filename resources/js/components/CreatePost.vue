<template>
  <v-container class="mt-5">
    <!-- Create Post Form -->
    <v-card max-width="800" class="mx-auto mb-6" elevation="3">
      <v-card-title class="text-h5 bg-primary text-white">
        Create New Post
      </v-card-title>
      
      <v-card-text class="pt-6">
        <v-form ref="form" v-model="valid" @submit.prevent="submitPost">
          <v-text-field
            v-model="post.title"
            label="Title"
            :rules="titleRules"
            variant="outlined"
            required
            class="mb-3"
          ></v-text-field>

          <v-textarea
            v-model="post.body"
            label="Body"
            :rules="bodyRules"
            variant="outlined"
            rows="8"
            required
          ></v-textarea>

          <v-alert
            v-if="successMessage"
            type="success"
            class="mb-3"
            closable
            @click:close="successMessage = ''"
          >
            {{ successMessage }}
          </v-alert>

          <v-alert
            v-if="errorMessage"
            type="error"
            class="mb-3"
            closable
            @click:close="errorMessage = ''"
          >
            {{ errorMessage }}
          </v-alert>

          <v-btn
            type="submit"
            color="primary"
            size="large"
            :disabled="!valid || loading"
            :loading="loading"
            block
          >
            Create Post
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Posts List -->
    <v-card max-width="800" class="mx-auto" elevation="3">
      <v-card-title class="text-h5 bg-secondary text-white">
        All Posts
      </v-card-title>
      
      <v-card-text class="pt-4">
        <v-progress-linear
          v-if="loadingPosts"
          indeterminate
          color="primary"
        ></v-progress-linear>

        <div v-else-if="posts.length === 0" class="text-center py-8 text-grey">
          <v-icon size="64" class="mb-3">mdi-post-outline</v-icon>
          <p class="text-h6">No posts yet</p>
          <p class="text-body-2">Create your first post above!</p>
        </div>

        <v-list v-else lines="three">
          <v-list-item
            v-for="(postItem, index) in posts"
            :key="postItem.id"
            class="mb-3"
          >
            <template v-slot:prepend>
              <v-avatar color="primary" class="text-white">
                {{ index + 1 }}
              </v-avatar>
            </template>

            <v-list-item-title class="text-h6 mb-2">
              {{ postItem.title }}
            </v-list-item-title>
            
            <v-list-item-subtitle class="text-wrap">
              {{ postItem.content }}
            </v-list-item-subtitle>

            <template v-slot:append>
              <v-chip size="small" color="grey-lighten-2">
                {{ formatDate(postItem.created_at) }}
              </v-chip>
            </template>

            <v-divider v-if="index < posts.length - 1" class="mt-3"></v-divider>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CreatePost',
  data() {
    return {
      valid: false,
      loading: false,
      loadingPosts: false,
      successMessage: '',
      errorMessage: '',
      posts: [],
      post: {
        title: '',
        body: ''
      },
      titleRules: [
        v => !!v || 'Title is required',
        v => (v && v.length >= 3) || 'Title must be at least 3 characters',
        v => (v && v.length <= 255) || 'Title must be less than 255 characters'
      ],
      bodyRules: [
        v => !!v || 'Body is required',
        v => (v && v.length >= 10) || 'Body must be at least 10 characters'
      ]
    };
  },
  mounted() {
    this.fetchPosts();
  },
  methods: {
    async fetchPosts() {
      this.loadingPosts = true;
      try {
        const response = await axios.get('/api/posts');
        this.posts = response.data;
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        this.loadingPosts = false;
      }
    },
    async submitPost() {
      // Validate form
      const { valid } = await this.$refs.form.validate();
      
      if (!valid) {
        return;
      }

      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';

      try {
        const response = await axios.post('/api/posts', {
          title: this.post.title,
          body: this.post.body
        });

        this.successMessage = 'Post created successfully!';
        
        // Reset form
        this.post.title = '';
        this.post.body = '';
        this.$refs.form.reset();

        // Refresh posts list
        await this.fetchPosts();

      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          const errors = Object.values(error.response.data.errors).flat();
          this.errorMessage = errors.join(', ');
        } else {
          this.errorMessage = 'Failed to create post. Please try again.';
        }
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }
};
</script>

<style scoped>
.bg-primary {
  background-color: #1976D2 !important;
}

.bg-secondary {
  background-color: #424242 !important;
}

.text-wrap {
  white-space: normal !important;
  word-break: break-word;
}
</style>
