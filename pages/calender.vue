<script setup>
import { DateTime } from "luxon";

const now = ref(DateTime.local());

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
      });
      date = date.plus({days: 1})
    }
    calendars.push(weekRow)
  }
  console.log(calendars)
  return calendars;
});

const prevMonth = () => now.value = now.value.minus({ months: 1})
const nextMonth = () => now.value = now.value.plus({ months: 1})
</script>

<template>
  <h2>カレンダー {{ now }}</h2>
  <button @click="prevMonth">前の月</button>
  <button @click="nextMonth">次の月</button>

  <div style="margin:auto;max-width:900px;border-top:1px solid gray;">
    <div 
      v-for="(week,index) in calenders" 
      :key="index" 
      style="display:flex;border-left:1px solid gray"
    >
      <div 
        v-for="(day, index) in week" 
        :key="index"
        style="
            flex:1;min-height:100px;
            border-right:1px solid gray;
            border-bottom:1px solid gray
          "
      >
        {{ day.date }}
      </div>
    </div>
  </div>

</template>