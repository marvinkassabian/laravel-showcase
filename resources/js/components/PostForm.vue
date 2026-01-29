<template>
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
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { usePostsStore } from '../stores/postsStore';

const postsStore = usePostsStore();

// Form state
const form = ref<any>(null);
const valid = ref<boolean>(false);
const loading = ref<boolean>(false);
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
</script>

<style scoped>
.bg-primary {
  background-color: #1976D2 !important;
}

.text-wrap {
  white-space: normal !important;
  word-break: break-word;
}
</style>
