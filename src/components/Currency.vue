<template>
    <div class="currency"></div>
</template>

<script>
  export default {
    name: 'currency',
    data () {
      return {
        currencies: []
      }
    },
    created () {
      console.log('Loaded!')
    }
  }
</script>