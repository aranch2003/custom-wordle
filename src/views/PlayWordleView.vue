

<template>
  <div class="container">
    <div class="header">
      <h1 class="title">Custom Wordle</h1>
      <p class="subtitle">Guess the 5-letter word!</p>
      
      <p class="subtitle" v-if="challengerName">
        Challenged by: <strong>{{ challengerName }}</strong>
      </p>
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
      @new-game="goToCreate"
      @play-random="playRandom"
    />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue' // <-- Import watch
import { useRoute, useRouter } from 'vue-router'
import { useWordle } from '../composables/useWordle'
import { decodeWord, encodeWord } from '../utils/gameHelpers'
import { VALID_WORDS } from '../data/words.js'
import GameBoard from '../components/GameBoard.vue'
import Keyboard from '../components/Keyboard.vue'
import ToastMessage from '../components/ToastMessage.vue'
import GameMessage from '../components/GameMessage.vue'

const route = useRoute()
const router = useRouter()
const targetWord = ref('')
const challengerName = ref('')
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

const setupNewGame = () => {
  decodeTargetWord()
  if (!error.value) {
    initializeGame()
  }
}

// Watch for changes in the URL parameter and reset the game
watch(() => route.params.encodedWord, (newWord) => {
  if (newWord) {
    setupNewGame()
  }
})

const decodeTargetWord = () => {
  try {
    const encodedWord = route.params.encodedWord
    if (!encodedWord) {
      throw new Error('No encoded word found in URL')
    }
    const gameData = decodeWord(encodedWord)
    targetWord.value = gameData.word
    challengerName.value = gameData.name
  } catch (err) {
    error.value = 'Invalid game link. Please check the URL and try again.'
  }
}

const goToCreate = () => {
  router.push('/')
}

const playRandom = () => {
  const wordList = Array.from(VALID_WORDS)
  const randomIndex = Math.floor(Math.random() * wordList.length)
  const randomWord = wordList[randomIndex]
  const encodedWord = encodeWord(randomWord)
  
  // Use router.push for a smoother in-app navigation
  router.push(`/play/${encodedWord}`)
}

onMounted(() => {
  setupNewGame()
})
</script>