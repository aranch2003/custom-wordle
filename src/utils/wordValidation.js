// ========== utils/wordValidation.js ==========
import { VALID_WORDS } from '../data/words.js'

export function isValidWord(word) {
  return VALID_WORDS.has(word.toLowerCase())
}

export function validateWordInput(word) {
  const cleanWord = word.toUpperCase().replace(/[^A-Z]/g, '')
  
  if (cleanWord.length === 5 && !isValidWord(cleanWord)) {
    return {
      isValid: false,
      cleanWord,
      error: 'This is not a valid English word.'
    }
  }
  
  return {
    isValid: cleanWord.length === 5 && /^[A-Z]+$/.test(cleanWord),
    cleanWord,
    error: ''
  }
}
