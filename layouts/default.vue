<template>
  <div class="flex flex-col w-full h-screen">
    <header class="text-white bg-blue-500 p-4 flex">
      <h3 class="mr-5">感謝日記</h3>
      <ul class="text-left flex">
        <NuxtLink :to="`/record`">
          <li class="mr-2">今日の感謝</li>
        </NuxtLink>
        <NuxtLink :to="`/calender`">
          <li class="mr-2">カレンダー</li>
        </NuxtLink>
      </ul>
    </header>

    <main class="flex-grow w-full p-4 mx-auto">
      <slot />
    </main>
  </div>
</template>