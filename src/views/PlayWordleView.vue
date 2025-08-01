<template>
  <div class="container">
    <div class="header">
      <h1 class="title">Custom Wordle</h1>
      <p class="subtitle">Guess the 5-letter word!</p>
    </div>
    
    <ToastMessage :message="toastMessage" />
    
    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-else class="game-container">
      <GameBoard :guesses="guesses" />
      
      <Keyboard
        :keyboard-rows="keyboardRows"
        :key-statuses="keyStatuses"
        @key-press="handleKeyPress"
      />
    </div>
    
    <GameMessage
      :game-message="gameMessage"
      @close="gameMessage = null"
      @new-game="goToCreate"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWordle } from '../composables/useWordle'
import { decodeWord } from '../utils/gameHelpers'
import GameBoard from '../components/GameBoard.vue'
import Keyboard from '../components/Keyboard.vue'
import ToastMessage from '../components/ToastMessage.vue'
import GameMessage from '../components/GameMessage.vue'

export default {
  name: 'PlayWordleView',
  components: {
    GameBoard,
    Keyboard,
    ToastMessage,
    GameMessage
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const targetWord = ref('')
    const error = ref('')

    const {
      guesses,
      gameMessage,
      keyStatuses,
      toastMessage,
      keyboardRows,
      initializeGame,
      handleKeyPress
    } = useWordle(targetWord)

    const decodeTargetWord = () => {
      try {
        const encodedWord = route.params.encodedWord
        if (!encodedWord) {
          throw new Error('No encoded word found in URL')
        }
        targetWord.value = decodeWord(encodedWord)
      } catch (err) {
        error.value = 'Invalid game link. Please check the URL and try again.'
      }
    }

    const goToCreate = () => {
      router.push('/')
    }

    onMounted(() => {
      decodeTargetWord()
      if (!error.value) {
        initializeGame()
      }
    })

    return {
      guesses,
      gameMessage,
      keyStatuses,
      toastMessage,
      keyboardRows,
      error,
      handleKeyPress,
      goToCreate
    }
  }
}
</script>

<!-- <script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWordle } from '../composables/useWordle'
import { decodeWord } from '../utils/gameHelpers'
import GameBoard from '../components/GameBoard.vue'
import Keyboard from '../components/Keyboard.vue'
import ToastMessage from '../components/ToastMessage.vue'
import GameMessage from '../components/GameMessage.vue'

const route = useRoute()
const router = useRouter()
const targetWord = ref('')
const error = ref('')

const {
  guesses,
  gameMessage,
  keyStatuses,
  toastMessage,
  keyboardRows,
  initializeGame,
  handleKeyPress
} = useWordle(targetWord)

const decodeTargetWord = () => {
  try {
    const encodedWord = route.params.encodedWord
    if (!encodedWord) {
      throw new Error('No encoded word found in URL')
    }
    targetWord.value = decodeWord(encodedWord)
  } catch (err) {
    error.value = 'Invalid game link. Please check the URL and try again.'
  }
}

const goToCreate = () => {
  router.push('/')
}

onMounted(() => {
  decodeTargetWord()
  if (!error.value) {
    initializeGame()
  }
})
</script> -->