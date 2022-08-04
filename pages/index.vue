<script setup>
  const showContent = ref(true)

  const openModal = () => showContent.value = true
  const closeModal = () => showContent.value = false
</script>

<template>
  <button v-on:click="openModal" >Click</button>

  <modal 
    show-content="showContent"
    @onClick="closeModal"  
  /> 
</template>