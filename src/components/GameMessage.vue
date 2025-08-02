

<template>
  <Transition name="modal">
    <div v-if="gameMessage" class="game-message-overlay">
      <div class="game-message" :class="{ lose: gameMessage.type === 'lose' }">
        <h2>{{ gameMessage.title }}</h2>
        <p>{{ gameMessage.text }}</p>
        <div class="button-group">
          <button @click="$emit('new-game')" class="new-game-btn">
            Create New Game
          </button>
          
          <button @click="$emit('play-random')" class="close-btn">
            Play a Random Word
          </button>
          </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'GameMessage',
  props: {
    gameMessage: {
      type: Object,
      default: null
    }
  },
  // #### THIS ARRAY IS UPDATED ####
  emits: ['new-game', 'play-random']
}
</script>

<style scoped>
/* No changes needed in the style section */
.game-message-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.close-btn {
  padding: 10px 20px;
  background-color: #3a3a3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>