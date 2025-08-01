<template>
  <div 
    class="tile"
    :class="tileClasses"
  >
    {{ letter }}
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Tile',
  props: {
    letter: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: ''
    },
    isSubmitted: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const tileClasses = computed(() => {
      const classes = []
      if (props.letter) classes.push('filled')
      if (props.isSubmitted && props.status) classes.push(props.status)
      return classes
    })

    return {
      tileClasses
    }
  }
}
</script>