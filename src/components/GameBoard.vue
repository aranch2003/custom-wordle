<template>
  <div class="game-board">
    <div
      v-for="(guess, rowIndex) in guesses"
      :key="rowIndex"
      class="guess-row"
    >
      <Tile
        v-for="(letter, colIndex) in guess.letters"
        :key="colIndex"
        :letter="letter"
        :status="guess.statuses[colIndex]"
        :is-submitted="guess.submitted"
      />
    </div>
  </div>
</template>

<script>
import Tile from './Tile.vue'

export default {
  name: 'GameBoard',
  components: {
    Tile
  },
  props: {
    guesses: {
      type: Array,
      required: true
    }
  }
}
</script>
