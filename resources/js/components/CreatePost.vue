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
          v-if="postsStore.loading"
          indeterminate
          color="primary"
        ></v-progress-linear>

        <div v-else-if="postsStore.posts.length === 0" class="text-center py-8 text-grey">
          <v-icon size="64" class="mb-3">mdi-post-outline</v-icon>
          <p class="text-h6">No posts yet</p>
          <p class="text-body-2">Create your first post above!</p>
        </div>

        <v-list v-else lines="three">
          <v-list-item
            v-for="(postItem, index) in postsStore.posts"
            :key="postItem.id"
            class="mb-3"
            :class="{ 'optimistic-post': postItem._optimistic }"
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
              <div class="flex-center-gap">
                <v-chip size="small" color="grey-lighten-2">
                  {{ formatDate(postItem.created_at) }}
                </v-chip>
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  variant="tonal"
                  color="error"
                  :loading="deletingPostId === postItem.id"
                  @click="deletePost(postItem.id)"
                ></v-btn>
              </div>
            </template>

            <v-divider v-if="index < postsStore.posts.length - 1" class="mt-3"></v-divider>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePostsStore } from '../stores/postsStore';
import type { Post } from '../models/Post';

const postsStore = usePostsStore();

// Form state
const form = ref<any>(null);
const valid = ref<boolean>(false);
const loading = ref<boolean>(false);
const deletingPostId = ref<number | null>(null);
const successMessage = ref<string>('');
const errorMessage = ref<string>('');

// Post data
interface PostFormData {
  title: string;
  body: string;
}

const post = ref<PostFormData>({
  title: '',
  body: ''
});

// Validation rules
type ValidationRule = (v: string) => boolean | string;

const titleRules: ValidationRule[] = [
  (v: string) => !!v || 'Title is required',
  (v: string) => (v && v.length >= 3) || 'Title must be at least 3 characters',
  (v: string) => (v && v.length <= 255) || 'Title must be less than 255 characters'
];

const bodyRules: ValidationRule[] = [
  (v: string) => !!v || 'Body is required',
  (v: string) => (v && v.length >= 10) || 'Body must be at least 10 characters'
];

// Lifecycle
onMounted(() => {
  postsStore.fetchPosts();
});

// Methods
const submitPost = async (): Promise<void> => {
  // Validate form
  const { valid: isValid } = await form.value.validate();
  
  if (!isValid) {
    return;
  }

  loading.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  // Call store action (optimistic update happens inside)
  const result = await postsStore.createPost({
    title: post.value.title,
    body: post.value.body
  });

  loading.value = false;

  if (result.success) {
    successMessage.value = 'Post created successfully!';
    
    // Reset form
    post.value.title = '';
    post.value.body = '';
    form.value.reset();
  } else {
    errorMessage.value = result.error || 'An error occurred';
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
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
};

const deletePost = async (postId: number): Promise<void> => {
  deletingPostId.value = postId;
  const result = await postsStore.deletePost(postId);
  deletingPostId.value = null;

  if (!result.success) {
    errorMessage.value = result.error || 'Failed to delete post';
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

.flex-center-gap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.text-wrap {
  white-space: normal !important;
  word-break: break-word;
}

.optimistic-post {
  opacity: 0.6;
  transition: opacity 0.3s;
}
</style>
