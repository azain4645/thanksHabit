<script setup lang="ts">
  const props = defineProps({
    showContent: Boolean
  })

  const emit = defineEmits({
    "closeModal"
  })
</script>

<template>
  <div id="overlay" v-show="showContent" v-on:click="closeModal">
    <div id="content">
      <p>モーダルウィンドウ</p>
      <button v-on:click="closeModal">
        Close
      </button>
    </div>
  </dvi>
</template>

<style scoped>
#overlay{
  z-index: 1;

  /*　画面全体を覆う設定　*/
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.5);

  /*　画面の中央に要素を表示させる設定　*/
  display: flex;
  align-items: center;
  justify-content: center;
}

#content{
  z-index:2;
  width:50%;
  padding: 1em;
  background:#fff;
}
</style>