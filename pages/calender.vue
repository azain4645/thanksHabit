<script setup>
import { DateTime } from "luxon";

const now = DateTime.local();
const startDate = computed(() => {
  const newDt = now.startOf("month")
  const youbiNum = newDt.weekday
  return newDt.minus({
    days: youbiNum
  })
});
const endDate = computed(() => {
  const endDt = now.endOf("month")
  let youbiNum = endDt.weekday
  youbiNum == 7 ? youbiNum = 0 : youbiNum = youbiNum
  
  return endDt.plus({
    days: 6 - youbiNum
  })
});
const calender = computed(() => {
  const weekNumber = Math.ceil(endDate.value.diff(startDate.value, 'days').days / 7);
  let date = startDate.value

  let calendars = [];
  for (let week = 0; week < weekNumber; week++) {
    let weekRow = [];
    for (let day = 0; day < 7; day++) {
      weekRow.push({
        date: date.day,
      });
      date.plus({days: 1})
    }
    calendars.push(weekRow)
  }
  return calendars;
});
</script>

<template>
  {{ startDate }}
  {{ endDate }}
  {{ calender }}
</template>