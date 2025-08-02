<template>
  <div class="container">
    
    <div class="header">
      <h1 class="title title-green">Welcome to Custom Wordle!!</h1>
      <p class="byline">by aranch2003</p>
      <h2 class="challenge-title">Challenge Your Friend</h2>
    </div>

    <div class="action-section">
      <form @submit.prevent="generateLink" class="create-form">
        <label for="creatorName">Your Name (Optional)</label>
        <input
          id="creatorName"
          v-model="creatorName"
          type="text"
          maxlength="20"
          class="word-input"
        />

        <label for="secretWord">Enter Secret Word</label>
        <input
          id="secretWord"
          v-model="word"
          @input="handleInput"
          type="text"
          maxlength="5"
          class="word-input"
          :class="{ error: hasError }"
        />
        
        <button
          type="submit"
          :disabled="!isValidWord"
          class="btn btn-secondary"
        >
          Generate Link
        </button>
        <div v-if="error" class="error-message">{{ error }}</div>

        <div v-if="shareableLink" class="link-result">
          <h3>Your Custom Link is Ready!</h3>
          <div class="shareable-link-box">{{ shareableLink }}</div>
          <div class="result-buttons">
            <button @click="copyToClipboard" class="btn btn-secondary">
              {{ copyButtonText }}
            </button>
            <button @click="playGeneratedGame" class="btn btn-primary">
              Play Now
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="separator">OR</div>

    <div class="action-section">
      <button @click="playRandom" class="btn btn-primary">
        Play a Random Word
      </button>
    </div>

    <div class="rules-section">
      <h3 class="rules-title">How to Play</h3>
      <p>Guess the 5-letter word in 6 tries. After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
      
      <div class="examples">
        <div class="example">
          <div class="example-word">
            <span class="tile correct">W</span>
            <span class="tile">E</span>
            <span class="tile">A</span>
            <span class="tile">R</span>
            <span class="tile">Y</span>
          </div>
          <p>The letter <strong>W</strong> is in the word and in the correct spot.</p>
        </div>
        
        <div class="example">
          <div class="example-word">
            <span class="tile">P</span>
            <span class="tile present">I</span>
            <span class="tile">L</span>
            <span class="tile">L</span>
            <span class="tile">S</span>
          </div>
          <p>The letter <strong>I</strong> is in the word but in the wrong spot.</p>
        </div>

        <div class="example">
          <div class="example-word">
            <span class="tile">V</span>
            <span class="tile">A</span>
            <span class="tile">G</span>
            <span class="tile absent">U</span>
            <span class="tile">E</span>
          </div>
          <p>The letter <strong>U</strong> is not in the word in any spot.</p>
        </div>
      </div>
    </div>
    </div>
</template>

<script setup>
// NO CHANGES TO THE SCRIPT BLOCK.
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { validateWordInput, isValidWord as isWordInList } from '../utils/wordValidation'
import { encodeWord } from '../utils/gameHelpers'
import { VALID_WORDS } from '../data/words.js'

const router = useRouter()
const word = ref('')
const creatorName = ref('')
const shareableLink = ref('')
const error = ref('')
const copyButtonText = ref('Copy to Clipboard')
const hasError = ref(false)

const isValidWord = computed(() => {
  return word.value.length === 5 && /^[A-Z]+$/.test(word.value) && isWordInList(word.value)
})

const handleInput = () => {
  const validation = validateWordInput(word.value)
  word.value = validation.cleanWord
  error.value = validation.error
  hasError.value = !validation.isValid && word.value.length === 5
}

const generateLink = () => {
  if (!isValidWord.value) {
    error.value = 'Please enter a valid 5-letter word.'
    hasError.value = true
    return
  }
  try {
    const gameData = {
      word: word.value.toLowerCase(),
      name: creatorName.value
    }
    const encodedData = encodeWord(JSON.stringify(gameData))
    const baseUrl = window.location.origin
    shareableLink.value = `${baseUrl}/#/play/${encodedData}`
    error.value = ''
    hasError.value = false
  } catch (err) {
    error.value = 'Error generating link. Please try again.'
    hasError.value = true
  }
}

const playGeneratedGame = () => {
  if (shareableLink.value) {
    const path = shareableLink.value.substring(shareableLink.value.indexOf('/#'))
    router.push(path.replace('/#', ''))
  }
}

const playRandom = () => {
  const wordList = Array.from(VALID_WORDS)
  const randomIndex = Math.floor(Math.random() * wordList.length)
  const randomWord = wordList[randomIndex]
  const encodedWord = encodeWord(randomWord)
  router.push(`/play/${encodedWord}`)
}

const copyToClipboard = async () => {
  if (!shareableLink.value) return
  try {
    await navigator.clipboard.writeText(shareableLink.value)
    copyButtonText.value = 'Copied!'
    setTimeout(() => {
      copyButtonText.value = 'Copy to Clipboard'
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
    copyButtonText.value = 'Error Copying'
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin: 0;
}

.title-green {
  color: #538d4e;
}

.byline {
  color: #818384;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.challenge-title {
  color: #ffffff;
  margin-top: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.action-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.separator {
  color: #565758;
  margin: 2rem 0;
  font-weight: 600;
  width: 100%;
  display: flex;
  align-items: center;
  text-align: center;
}
.separator::before, .separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #3a3a3c;
}
.separator:not(:empty)::before {
  margin-right: .25em;
}
.separator:not(:empty)::after {
  margin-left: .25em;
}

.create-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #d7dadc;
  text-align: left;
  margin-bottom: -0.5rem;
}

.word-input {
  background-color: #121213;
  border: 2px solid #3a3a3c;
  color: #ffffff;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 1rem;
  text-align: center;
  font-weight: 600;
  text-transform: uppercase;
}
.word-input.error {
  border-color: #b52f2f;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  margin-top: 0.5rem;
}
.btn:disabled {
  background-color: #3a3a3c;
  color: #818384;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #538d4e;
  color: #ffffff;
}
.btn-primary:hover:not(:disabled) {
  background-color: #6aaa64;
}

.btn-secondary {
  background-color: #818384;
  color: #ffffff;
}
.btn-secondary:hover:not(:disabled) {
  background-color: #939598;
}

.error-message {
  color: #b52f2f;
  margin-top: 0.5rem;
}

.link-result {
  margin-top: 1.5rem;
  width: 100%;
  padding-top: 0;
}

.shareable-link-box {
  background-color: #121213;
  border: 2px dashed #3a3a3c;
  padding: 1rem;
  border-radius: 4px;
  color: #d7dadc;
  word-wrap: break-word;
  margin: 1rem 0;
}

.result-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

/* #### NEW STYLES FOR RULES #### */
.rules-section {
  width: 100%;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #3a3a3c;
  text-align: left;
  color: #d7dadc;
}

.rules-title {
  text-align: center;
  margin-bottom: 1rem;
  color: #ffffff;
}

.examples {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.example {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.example-word {
  display: flex;
  gap: 5px;
  margin-bottom: 0.5rem;
}

.tile {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  width: 40px;
  height: 40px;
  border: 2px solid #3a3a3c;
  color: #ffffff;
}

.tile.correct {
  background-color: #538d4e;
  border-color: #538d4e;
}
.tile.present {
  background-color: #b59f3b;
  border-color: #b59f3b;
}
.tile.absent {
  background-color: #3a3a3c;
  border-color: #3a3a3c;
}
</style>