<script setup lang="ts">
import { DateTime, DayNumbers } from "luxon";
import { getDocs, collection, Firestore } from 'firebase/firestore';

let $firebaseDB: Firestore;
const calenders = ref<{
    date: DayNumbers;
    month: string;
    count: number;
}[][]>([]);
onMounted(async () => {
  $firebaseDB = useNuxtApp().$firebaseDB;

  const weekNumber = Math.ceil(endDate.value.diff(startDate.value, 'days').days / 7);

  const calendersPromise = [...new Array(weekNumber)].map((_,i) => i).map(async (i) => {
    const weekRowPromise = [...new Array(7)].map((_,j) => j).map(async (j) => {
      const date = startDate.value.plus({days: i*7 + j});
      const thanksCount = await getDayThanksFirebase(date.toFormat('yyyy-MM-dd'))
      const _day = {
        date: date.day,
        month: date.toFormat('yyyy-MM'),
        count: thanksCount
      };
      return _day;
    })
    const weekRow = await Promise.all(weekRowPromise);
    return weekRow;
  });
  calenders.value = await Promise.all(calendersPromise);
})

// モーダル
const showModal = ref(false)
const modalContent = ref('')

const openModal = (count) => {
  //　実際は日付を渡してデータを取得して表示
  modalContent.value = count
  showModal.value = true
}

const closeModal = () => showModal.value = false

// カレンダー関係
const currentDate = ref(DateTime.local());
const displayDate = computed(() => currentDate.value.toFormat('yyyy年M月'))
const currentMonth = computed(() => currentDate.value.toFormat('yyyy-MM'))
const youbi = ["日", "月", "火", "水", "木", "金", "土"]

const startDate = computed(() => {
  const newDt = currentDate.value.startOf("month")
  const youbiNum = newDt.weekday
  return newDt.minus({
    days: youbiNum
  })
});

const endDate = computed(() => {
  const endDt = currentDate.value.endOf("month")
  let youbiNum = endDt.weekday
  //@ts-ignore //TODO 型定義上は、0 を型 WeekdayNumbers に割り当てることはできない
  youbiNum == 7 ? youbiNum = 0 : youbiNum = youbiNum
  
  return endDt.plus({
    days: 6 - youbiNum
  })
});

// const events = [
//   { date: "2022-08-02", count: 12},
//   { date: "2022-08-03", count: 3},
//   { date: "2022-08-04", count: 4},
// ]

// const getDayThanks = (date) => {
//   return events.find( event => {
//     return date.toFormat('yyyy-MM-dd') == event.date
//   })
// }

const getDayThanksFirebase = async (date) => {
  const collectionRef = collection($firebaseDB, date)
  //console.log(collectionRef)
  const result = await getDocs(collectionRef);
  console.log({len: result.docs.length, date})
  return result.docs.length;
}

const prevMonth = () => currentDate.value = currentDate.value.minus({ months: 1})
const nextMonth = () => currentDate.value = currentDate.value.plus({ months: 1})
</script>

<template>
<div>
  <modal 
    :show-content="showModal"
    @closeModal="closeModal"  
  >
    {{ modalContent }}
  </modal>

  <h2>カレンダー 
    {{ displayDate }}
  </h2>
  <button @click="prevMonth">前の月</button>
  <button @click="nextMonth">次の月</button>

  <div 
    style="margin:auto;max-width:900px;"
    class="border-t border-gray-300 border-solid"
  >
    <div class="flex text-center border-l border-gray-300 border-solid">
      <div 
        v-for="n in 7" 
        :key="n"
        style="flex:1"
        class="border-r border-gray-300 border-solid"
      >
        {{ youbi[n-1] }}
      </div>
    </div>
    <div 
      v-for="(week,index) in calenders" 
      :key="index" 
      class="flex border-l border-gray-300 border-solid"
    >
      <div 
        v-for="(day, index) in week" 
        :key="index"
        style="flex:1;min-height:100px;"
        :class="`${ 
          currentMonth != day.month ? 'bg-gray-100' : ''
        } border-r border-b border-gray-300 border-solid text-center`"
      >
        {{ day.date }}
        <p 
          class="mt-2 text-6xl font-bold text-red-300"
          @click="openModal(day.count)"
        >
          {{ day.count }}
        </p>

      </div>
    </div>
  </div>
</div>
</template>