<template>
  <v-container class="mt-5">
    <PostForm />
    <PostsList />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { usePostsStore } from '../stores/postsStore';
import PostForm from './PostForm.vue';
import PostsList from './PostsList.vue';

const postsStore = usePostsStore();

// Lifecycle
onMounted(() => {
  postsStore.fetchPosts();
});
</script>

<style scoped>
</style>
