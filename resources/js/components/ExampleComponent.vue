
<template>
    <div class="p-4 border">
        <h3>Vue Component</h3>
        <p>Message from Vue: {{ message }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: 'Vue is working inside Laravel'
        }
    }
}
</script>