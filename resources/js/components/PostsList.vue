<template>
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePostsStore } from '../stores/postsStore';

const postsStore = usePostsStore();
const deletingPostId = ref<number | null>(null);
const errorMessage = ref<string>('');

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
