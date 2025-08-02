

// ========== src/utils/gameHelpers.js (Full Code) ==========

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
    // Note: The new logic in CreateWordView might pass an object stringified
    // or just a word. btoa handles both string types just fine.
    return btoa(word) 
  } catch (err) {
    throw new Error('Error encoding word')
  }
}

// ** THIS IS THE NEW, UPDATED FUNCTION **
export function decodeWord(encodedData) {
  try {
    const decodedString = atob(encodedData);
    
    // Try to parse it as JSON (new format with name)
    try {
      const gameData = JSON.parse(decodedString);
      if (!gameData.word || gameData.word.length !== 5) {
        throw new Error('Invalid word format in data object');
      }
      return {
        word: gameData.word.toUpperCase(),
        name: gameData.name || '' // Return name, or empty string if not provided
      };
    } catch (e) {
      // If JSON parsing fails, assume it's the old format (just a word)
      if (decodedString.length !== 5 || !/^[A-Z]+$/i.test(decodedString)) {
        throw new Error('Invalid word format for simple string');
      }
      return {
        word: decodedString.toUpperCase(),
        name: '' // No name in the old format
      };
    }
  } catch (err) {
    console.error("Decoding failed:", err);
    throw new Error('Invalid encoded data');
  }
}