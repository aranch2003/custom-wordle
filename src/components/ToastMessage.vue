<template>
  <Transition name="toast">
    <div v-if="message" class="toast-message">
      {{ message }}
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'ToastMessage',
  props: {
    message: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>