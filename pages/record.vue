<script setup lang="ts">
  type Thank = {
    content: string;
  }

  const Thanks = ref<Thank[]>([
    {content: '生きている'},
    {content: 'ご飯が美味しい！'},
  ])

  const addThank = () => {
    Thanks.value.push({
      content: content.value
    })
    content.value = ""
  }

  const removeThank = (index : number) => Thanks.value.splice(index, 1)

  const content = ref('')
</script>

<template>
  <div class="m-4">
  <p class="mb-3">今日の感謝を思い出して記録しよう</p>

  <ul class="mb-2">
    <li
     v-for="(thank, index) in Thanks" :key="index"
     class="mb-1"
    >
      {{ index + 1 }}
      {{ thank.content }}
      <button
        class="bg-blue-200 hover:bg-blue-400 w-16 h-5 rounded-md text-sm text-white ml-2"
        @click="removeThank(index)"
      >
        取消し
      </button>
    </li>
  </ul>

  <form 
    class="flex"
    @submit.prevent="addThank">
    <input 
      v-model="content"
      type="text" 
      class="w-2/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
      placeholder="今日何がありましたか？">
    <button
      :disabled= "content == ''"
      :class="`${
        content !== ''
        ? 'bg-blue-500 hover:bg-blue-700'
        : 'bg-blue-300'
      } ml-5 w-32  text-white font-semibold rounded-lg shadow-md`">
      記録
    </button>
  </form>
  </div>

</template>