import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getLetterStatuses } from '../utils/gameHelpers'
import { isValidWord } from '../utils/wordValidation'

export function useWordle(targetWord) {
  const guesses = ref([])
  const currentGuess = ref(0)
  const currentLetter = ref(0)
  const gameMessage = ref(null)
  const keyStatuses = ref({})
  const toastMessage = ref('')

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ]

  const isGameOver = computed(() => gameMessage.value !== null)

  const initializeGame = () => {
    guesses.value = Array.from({ length: 6 }, () => ({
      letters: ['', '', '', '', ''],
      statuses: ['', '', '', '', ''],
      submitted: false
    }))
    currentGuess.value = 0
    currentLetter.value = 0
    gameMessage.value = null
    keyStatuses.value = {}
  }

  const showToast = (message) => {
    toastMessage.value = message
    setTimeout(() => {
      toastMessage.value = ''
    }, 2000)
  }

  const addLetter = (letter) => {
    if (currentLetter.value < 5 && !isGameOver.value) {
      guesses.value[currentGuess.value].letters[currentLetter.value] = letter
      currentLetter.value++
    }
  }

  const deleteLetter = () => {
    if (currentLetter.value > 0 && !isGameOver.value) {
      currentLetter.value--
      guesses.value[currentGuess.value].letters[currentLetter.value] = ''
    }
  }

  const submitGuess = () => {
    if (currentLetter.value !== 5 || isGameOver.value) return

    const guess = guesses.value[currentGuess.value]
    const guessWord = guess.letters.join('').toLowerCase()

    // Validate word
    if (!isValidWord(guessWord)) {
      showToast('Not in word list')
      return
    }

    // Process valid guess
    const statuses = getLetterStatuses(guessWord.toUpperCase(), targetWord.value)
    guess.statuses = statuses
    guess.submitted = true

    // Update key statuses
    updateKeyStatuses(guessWord, statuses)

    // Add flip animation
    animateTiles()

    // Check win/lose conditions
    checkGameEnd(guessWord.toUpperCase())
  }

  const updateKeyStatuses = (guessWord, statuses) => {
    guessWord.split('').forEach((letter, index) => {
      const status = statuses[index]
      const key = letter.toUpperCase()
      
      if (
        !keyStatuses.value[key] ||
        (keyStatuses.value[key] !== 'correct' && status === 'correct') ||
        (keyStatuses.value[key] === 'absent' && status === 'present')
      ) {
        keyStatuses.value[key] = status
      }
    })
  }

  const animateTiles = () => {
    setTimeout(() => {
      const tiles = document.querySelectorAll(
        `.guess-row:nth-child(${currentGuess.value + 1}) .tile`
      )
      tiles.forEach((tile, index) => {
        setTimeout(() => {
          tile.classList.add('flip')
        }, index * 100)
      })
    }, 100)
  }

  const checkGameEnd = (guessWord) => {
    if (guessWord === targetWord.value) {
      setTimeout(() => {
        gameMessage.value = {
          type: 'win',
          title: 'Congratulations! 🎉',
          text: `You guessed the word "${targetWord.value}" in ${currentGuess.value + 1} ${
            currentGuess.value === 0 ? 'guess' : 'guesses'
          }!`
        }
      }, 1500)
    } else if (currentGuess.value === 5) {
      setTimeout(() => {
        gameMessage.value = {
          type: 'lose',
          title: 'Game Over 😢',
          text: `The word was "${targetWord.value}". Better luck next time!`
        }
      }, 1500)
    } else {
      currentGuess.value++
      currentLetter.value = 0
    }
  }

  const handleKeyPress = (key) => {
    if (isGameOver.value) return

    if (key === 'ENTER') {
      submitGuess()
    } else if (key === 'BACKSPACE') {
      deleteLetter()
    } else if (key.length === 1 && /^[A-Z]$/.test(key)) {
      addLetter(key)
    }
  }

  const handlePhysicalKeyboard = (event) => {
    const key = event.key.toUpperCase()
    if (key === 'ENTER' || key === 'BACKSPACE' || /^[A-Z]$/.test(key)) {
      event.preventDefault()
      handleKeyPress(key)
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handlePhysicalKeyboard)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handlePhysicalKeyboard)
  })

  return {
    guesses,
    currentGuess,
    gameMessage,
    keyStatuses,
    toastMessage,
    keyboardRows,
    isGameOver,
    initializeGame,
    handleKeyPress,
    showToast
  }
}


