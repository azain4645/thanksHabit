<script setup lang="ts">
  const props = defineProps({
    showContent: Boolean,
    thanks: Array
  })
  const emit = defineEmits([
    'closeModal'
  ])
</script>

<template>
  <div id="overlay" 
    v-show="showContent" 
    @click="$emit('closeModal')" 
  >
    <div id="content">
      <p class="listTitle">感謝リスト</p>
      <ol>
        <li v-for="comment in thanks" :key="comment">
          {{ comment }}
        </li>
      </ol>
      <button 
        class="mt-5 text-white font-semibold rounded-lg shadow-md modal-button"
        @click="$emit('closeModal')" 
      >
        Close
      </button>
    </div>
  </div>
  
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

.listTitle{
  font-weight: bold;
  font-size: 20px;
  color: #F6A38B;
}

.modal-button{
  background-color: #F6A38B;
  width: 100%;
}

ol{
  counter-reset:list;
  list-style-type:none;
}

ol li{
  position:relative;
  line-height: 30px;
  margin: 7px 0 7px 40px;
  padding-left: 10px;
  font-weight: bold;
  font-size:14px;
}
  
ol li:before{
  counter-increment: list;
  content: counter(list);
  position: absolute;
  left: -35px;
  width: 30px;
  height: 30px;
  background: #F6A38B;
  text-align: center;
  color: #fff;
  top: 50%;
  -moz-transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  -o-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
}
</style>