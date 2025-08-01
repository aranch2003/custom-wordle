<template>
  <div class="container">
    <div class="header">
      <h1 class="title">Challange Your Friend now!!</h1>
      <p class="subtitle">Enter a 5-letter word to create a custom wordle</p>
    </div>
    
    <form @submit.prevent="generateLink" class="create-form">
      <input
        v-model="word"
        @input="handleInput"
        type="text"
        placeholder="ENTER"
        maxlength="5"
        class="word-input"
        :class="{ error: hasError }"
      />
      
      <button
        type="submit"
        :disabled="!isValidWord"
        class="generate-btn"
      >
        Generate Link
      </button>
      
      <div v-if="error" class="error">{{ error }}</div>
    </form>
    
    <div v-if="shareableLink" class="link-result">
      <h3>Your Custom Wordle Link:</h3>
      <div class="shareable-link">{{ shareableLink }}</div>
      <button @click="copyToClipboard" class="copy-btn">
        {{ copyButtonText }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { validateWordInput, isValidWord } from '../utils/wordValidation'
import { encodeWord } from '../utils/gameHelpers'

export default {
  name: 'CreateWordView',
  setup() {
    const word = ref('')
    const shareableLink = ref('')
    const error = ref('')
    const copyButtonText = ref('Copy to Clipboard')
    const hasError = ref(false)

    const isValidWordComputed = computed(() => {
      return word.value.length === 5 &&
        /^[A-Z]+$/.test(word.value) &&
        isValidWord(word.value)
    })

    const handleInput = () => {
      const validation = validateWordInput(word.value)
      word.value = validation.cleanWord
      error.value = validation.error
      hasError.value = !validation.isValid && word.value.length === 5
    }

    const generateLink = () => {
      if (!isValidWordComputed.value) {
        error.value = 'Please enter a valid 5-letter word.'
        hasError.value = true
        return
      }

      try {
        const encodedWord = encodeWord(word.value)
        const currentUrl = window.location.href.split('#')[0]
        shareableLink.value = `${currentUrl}#/play/${encodedWord}`
        error.value = ''
        hasError.value = false
      } catch (err) {
        error.value = 'Error generating link. Please try again.'
        hasError.value = true
      }
    }

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(shareableLink.value)
        copyButtonText.value = 'Copied!'
        setTimeout(() => {
          copyButtonText.value = 'Copy to Clipboard'
        }, 2000)
      } catch (err) {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement('textarea')
        textArea.value = shareableLink.value
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        copyButtonText.value = 'Copied!'
        setTimeout(() => {
          copyButtonText.value = 'Copy to Clipboard'
        }, 2000)
      }
    }

    return {
      word,
      shareableLink,
      error,
      copyButtonText,
      hasError,
      isValidWord: isValidWordComputed,
      handleInput,
      generateLink,
      copyToClipboard
    }
  }
}
</script>


<!-- <script setup>
import { ref, computed } from 'vue'
import { validateWordInput, isValidWord as isWordInList } from '../utils/wordValidation'
import { encodeWord } from '../utils/gameHelpers'

const word = ref('')
const shareableLink = ref('')
const error = ref('')
const copyButtonText = ref('Copy to Clipboard')
const hasError = ref(false)

const isValidWord = computed(() => {
  return word.value.length === 5 &&
    /^[A-Z]+$/.test(word.value) &&
    isWordInList(word.value)
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
    const encodedWord = encodeWord(word.value)
    // Use window.location.origin to be more robust
    shareableLink.value = `${window.location.origin}/#/play/${encodedWord}`
    error.value = ''
    hasError.value = false
  } catch (err) {
    error.value = 'Error generating link. Please try again.'
    hasError.value = true
  }
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
    console.error('Failed to copy: ', err)
    copyButtonText.value = 'Failed to copy'
  }
}
</script> -->