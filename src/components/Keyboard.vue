<template>
  <div class="keyboard">
    <div
      v-for="(row, index) in keyboardRows"
      :key="index"
      class="keyboard-row"
    >
      <button
        v-if="index === 2"
        @click="$emit('key-press', 'ENTER')"
        class="key wide"
      >
        ENTER
      </button>
      
      <button
        v-for="key in row"
        :key="key"
        @click="$emit('key-press', key)"
        class="key"
        :class="getKeyClass(key)"
      >
        {{ key }}
      </button>
      
      <button
        v-if="index === 2"
        @click="$emit('key-press', 'BACKSPACE')"
        class="key wide"
      >
        ⌫
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Keyboard',
  props: {
    keyboardRows: {
      type: Array,
      required: true
    },
    keyStatuses: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['key-press'],
  methods: {
    getKeyClass(key) {
      return this.keyStatuses[key] || ''
    }
  }
}
</script>