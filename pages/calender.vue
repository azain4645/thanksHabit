<script setup lang="ts"> // <= TypeScriptで書きたい
import { DateTime, DayNumbers } from "luxon";
import { getDocs, collection, Firestore } from 'firebase/firestore';

/**
 * サーバ側で初期化されるとエラーになるはずなので、初期化はmountedライフサイクルにて行う。
 * 
 * ### 補足
 * 実運用時のビルド時には、ビルド設定によってはサーバ側なしとなるが、
 * yarn dev 時には基本的にSSRで動作しているはずなので、
 * この階層にFirestoreの初期化処理を書くと、「サーバ側での実行」になる可能性がある。
 * 
 * しかし、実際にはあくまで初期化設定を行いたいのは「サーバ側の」ではなく「フロントエンド」
 * なので、ここでは初期化を行わず、フロントエンドで初期化を行う。
 * 
 * （そのために、onMountedを使う。なおmountedなどVueのライフサイクルについては公式ドキュメントをご覧ください）
 */
let $firebaseDB: Firestore;

/**
 * カレンダーは初期化完了後に通信を行い、その後
 * 非同期的にデータを取得するので、refとして定義する
 */
const calenders = ref<{ // <= 型は明確にしたい（anyは極力排除）
    date: DayNumbers;
    month: string;
    count: number;
}[][]>([]);

// mountedライフサイクルで初期化を行う（mountedなら確実にサーバではなくフロントエンドでの実行になるはず）
onMounted(async () => { // awaitを使いたいので非同期関数にする
  $firebaseDB = useNuxtApp().$firebaseDB;

  const weekNumber = Math.ceil(endDate.value.diff(startDate.value, 'days').days / 7);

  // [...new Array(weekNumber)].map((_,i) => i) で weekNumberの数だけゼロ始まりの連番を生成
  // ※ 配列初期化後にpush、という手続き的な実装より、関数らしく宣言的に実装したい
  // ※ 配列初期化後にpushする形でも良いが、その場合には適切な型を明示しないとanyになる（anyは避けたい）
  const calendersPromise = [...new Array(weekNumber)].map((_,i) => i).map(async (i) => {

    // ---- awaitを使いたいので非同期関数にする ----

    // 同様のやり方でその週の初めから終わりまでの7日間を連番で回す
    const weekRowPromise = [...new Array(7)].map((_,j) => j).map(async (j) => {

      // ---- awaitを使いたいので非同期関数にする ----

      // let + 後から追加 というミュータブルなやり方ではなく、極力イミュータブルにしたい
      const date = startDate.value.plus({days: i*7 + j});
      // ここもとのコードでフォーマット間違ってました（ddがなかった）
      const thanksCount = await getDayThanksFirebase(date.toFormat('yyyy-MM-dd'));
      const _day = {
        date: date.day,
        month: date.toFormat('yyyy-MM'),
        count: thanksCount
      };
      return _day;
    })
    // 並列的に日毎データを処理して、週データにまとめる（並列処理でないと処理に時間がかかる）
    const weekRow = await Promise.all(weekRowPromise);
    return weekRow;
  });
  // 並列的に週毎データを処理して、月データにまとめる（並列処理でないと処理に時間がかかる）
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
  //@ts-ignore //TODO 型定義上は、0 を型 WeekdayNumbers に割り当てることはできないので、修正した方が良い
  // ※上記の weekday をVSCode上で F12 で押して、さらに飛んだ先の「WeekdayNumbers」を F12 すると、型定義を見れます
  youbiNum == 7 ? youbiNum = 0 : youbiNum = youbiNum
  
  return endDt.plus({
    days: 6 - youbiNum
  })
});

const getDayThanksFirebase = async (date) => {

  // ---- await を使いたいので非同期関数にする ----

  const collectionRef = collection($firebaseDB, date)
  //console.log(collectionRef)

  // getDocsはPromiseを返すので、結果が返ってくるまでawaitで待つ
  const result = await getDocs(collectionRef);
  
  // console.log({len: result.docs.length, date})
  const count = result.docs.length;
  return count == 0 ? "" : count;
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