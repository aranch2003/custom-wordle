// ========== utils/gameHelpers.js ==========
export function getLetterStatuses(guess, target) {
  const statuses = new Array(5).fill('absent')
  const targetLetters = target.split('')
  const guessLetters = guess.split('')

  // First pass: mark correct letters
  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      statuses[i] = 'correct'
      targetLetters[i] = null // Mark as used
    }
  }

  // Second pass: mark present letters
  for (let i = 0; i < 5; i++) {
    if (statuses[i] === 'absent') {
      const targetIndex = targetLetters.indexOf(guessLetters[i])
      if (targetIndex !== -1) {
        statuses[i] = 'present'
        targetLetters[targetIndex] = null // Mark as used
      }
    }
  }

  return statuses
}

export function encodeWord(word) {
  try {
    return btoa(word.toLowerCase())
  } catch (err) {
    throw new Error('Error encoding word')
  }
}

export function decodeWord(encodedWord) {
  try {
    const decoded = atob(encodedWord).toUpperCase()
    if (decoded.length !== 5 || !/^[A-Z]+$/.test(decoded)) {
      throw new Error('Invalid word format')
    }
    return decoded
  } catch (err) {
    throw new Error('Invalid encoded word')
  }
}