<script setup lang="ts">

  import { Firestore, addDoc, collection, getDocs, doc, query, where, deleteDoc, orderBy } from 'firebase/firestore'
  import { DateTime } from "luxon";

  // const { $firebaseDB } = useNuxtApp();
  let $firebaseDB: Firestore;

  onMounted(() => { // awaitを使いたいので非同期関数にする
    $firebaseDB = useNuxtApp().$firebaseDB;
  })

  const readFromFirestore = async () => {
    try {
      const q = query(collection($firebaseDB, Today), orderBy('created_at', 'asc'));

      const querySnapshot = await getDocs(q);
      const Docs = <Thank[]>([])
      
      querySnapshot.forEach((doc) => {
        const addDoc = <Thank>{
          content : doc.data().content
        }
        Docs.push(addDoc)
      });
      Thanks.value = Docs
    } catch (e) {
      alert("Error!")
      console.error(e)
    }
  }

  const writeToFirestore = async () => {
    if(!content.value){ return }
    const document = {
      content: content.value,
      created_at: formatedNow(),
    }
    try {
        await addDoc(collection($firebaseDB, Today), document)
        // alert("Success!")
        content.value = ''
        readFromFirestore()
    } catch (e) {
      alert("Error!")
      console.error(e)
    }
  }

  const removeToFirestore = async (content) => {
    const thnaksCollectionRef = collection($firebaseDB, Today);
    const q = query(thnaksCollectionRef, where('content', '==', content));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (document) => {
      const thnakDocumentRef = doc($firebaseDB, Today, document.id);
      await deleteDoc(thnakDocumentRef);
    });
    readFromFirestore()
  }

  type Thank = {
    content: string;
    created_at: string;
  }

  const Thanks = ref<Thank[]>([])
  onMounted(() => {
    readFromFirestore();
  })

  const Today = DateTime.local().toFormat('yyyy-MM-dd')

  const formatedNow = () : string => {
    const d = new Date()
    return d.getFullYear()
            + '-' + ('00' + (d.getMonth() + 1)).slice(-2)
            + '-' + ('00' + d.getDate()).slice(-2)
            + ' ' + ('00' + d.getHours()).slice(-2)
            + ':' + ('00' + d.getMinutes()).slice(-2)
            + ':' + ('00' + d.getSeconds()).slice(-2);
  }

  const content = ref('')
</script>

<template>
  <div class="m-4">
  <p class="mb-3">今日の感謝を思い出して記録しよう</p>

  <ol class="mb-2">
    <li
     v-for="(thank, index) in Thanks" :key="index"
     class="mb-1"
    >
      {{ thank.content }}
      <button
        class="bg-red-200 hover:bg-red-400 w-16 h-5 rounded-md text-sm text-white ml-2"
        @click="removeToFirestore(thank.content)"
      >
        取消し
      </button>
    </li>
  </ol>

  <form 
    class="flex mt-5"
    @submit.prevent="writeToFirestore">
    <input 
      v-model="content"
      type="text" 
      class="w-2/3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
      placeholder="今日何がありましたか？">
    <button
      :disabled= "content == ''"
      :class="`${
        content !== ''
        ? 'bg-red-300 hover:bg-red-500'
        : 'bg-red-300'
      } ml-5 w-32  text-white font-semibold rounded-lg shadow-md`">
      記録
    </button>
  </form>
  </div>

</template>

<style scoped>
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