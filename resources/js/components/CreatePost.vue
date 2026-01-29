<template>
  <v-container class="mt-5">
    <PostForm />
    <PostsList />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { usePostsStore } from '../stores/postsStore';

const authStore = useAuthStore();
const postsStore = usePostsStore();

// Lifecycle
onMounted(async () => {
  // Initialize auth first
  await authStore.initAuth();
  
  // Then fetch posts
  if (authStore.isAuthenticated) {
    postsStore.fetchPosts();
  }
});
</script>

<style scoped>
</style>
