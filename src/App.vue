<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<!-- <script setup>
</script> -->
<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
