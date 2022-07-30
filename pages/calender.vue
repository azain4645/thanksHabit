<script setup>
import { DateTime } from "luxon";

const now = ref(DateTime.local());
const displayDate = ref(now.value.toFormat('yyyy年M月'))
const currentMonth = now.value.toFormat('YYYY-MM')
const youbi = ["日", "月", "火", "水", "木", "金", "土"]

const startDate = computed(() => {
  const newDt = now.value.startOf("month")
  const youbiNum = newDt.weekday
  return newDt.minus({
    days: youbiNum
  })
});

const endDate = computed(() => {
  const endDt = now.value.endOf("month")
  let youbiNum = endDt.weekday
  youbiNum == 7 ? youbiNum = 0 : youbiNum = youbiNum
  
  return endDt.plus({
    days: 6 - youbiNum
  })
});

const calenders = computed(() => {
  const weekNumber = Math.ceil(endDate.value.diff(startDate.value, 'days').days / 7);
  let date = startDate.value

  let calendars = [];
  for (let week = 0; week < weekNumber; week++) {
    let weekRow = [];
    for (let day = 0; day < 7; day++) {
      weekRow.push({
        date: date.day,
        month: date.toFormat('YYYY-MM'),
      });
      date = date.plus({days: 1})
    }
    calendars.push(weekRow)
  }
  return calendars;
});

const prevMonth = () => now.value = now.value.minus({ months: 1})
const nextMonth = () => now.value = now.value.plus({ months: 1})
</script>

<template>
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
      </div>
    </div>
  </div>

</template>