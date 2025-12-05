<template>
  <div class="focus-root" v-if="mounted">
    <section class="main">
      <section class="fm-main" v-if="focus">
        <h1 class="fm-title">{{ focus.text }}</h1>

        <div class="timer">
          <div class="time">{{ minutesDisplay }}:{{ secondsDisplay }}</div>
          <div class="controls">
            <button class="btn" @click="toggle">{{ running ? 'Pause' : 'Start' }}</button>
            <button class="btn btn-ghost" @click="reset">Reset</button>
            <button class="btn btn-primary" @click="completeFocus">Mark Completed</button>
          </div>
          <div class="preset">
            <button class="btn btn-ghost" @click="setPreset(25,5)">Pomodoro 25/5</button>
            <button class="btn btn-ghost" @click="setPreset(50,10)">Long 50/10</button>
            <button class="btn btn-ghost" @click="setPreset(15,3)">Short 15/3</button>
          </div>
        </div>

        <section class="notes">
          <h3>Progress Notes .° ༘🎧⋆🖇₊˚ෆ</h3>
          <textarea v-model="notesText" @input="saveNotes" placeholder="Catatan singkat..."></textarea>
        </section>
      </section>

      <section class="fm-empty" v-else>
        <p>No task selected. Pilih dulu Todo nya! </p>
      </section>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTodos } from '@/stores/todos'

const store = useTodos()
const router = useRouter()
const route = useRoute()

const mounted = ref(false)
onMounted(() => { 
  mounted.value = true 
  if (selectedId.value != null) store.setFocus(Number(selectedId.value))
})

const todos = computed(() => store.pendingTodos.concat(store.completedTodos))
const focus = computed(() => store.focusTodo)
const selectedId = ref(route.params.id ? Number(route.params.id) : store.focusId ?? null)

watch(selectedId, (v) => {
  if (v == null) {
    store.clearFocus()
    router.replace({ name: route.name, params: { id: undefined } }).catch(()=>{})
  } else {
    store.setFocus(v)
    router.replace({ name: route.name, params: { id: String(v) } }).catch(()=>{})
  }
})

const notesText = ref('')
watch(focus, (f) => {
  notesText.value = f ? (store.focusNotes[f.id] ?? '') : ''
}, { immediate: true })

function saveNotes() {
  if (!focus.value) return
  store.updateFocusNotes(focus.value.id, notesText.value)
}

const mode = ref('pomodoro')
const running = ref(false)
const totalSeconds = ref(25 * 60)
const remaining = ref(totalSeconds.value)
let intervalId = null

function setPreset(workMin, breakMin = 0) {
  totalSeconds.value = workMin * 60
  remaining.value = totalSeconds.value
  running.value = false
}

function tick() {
  if (remaining.value > 0) remaining.value -= 1
  else { running.value = false; clearInterval(intervalId); intervalId = null }
}

function toggle() {
  if (!focus.value) return
  running.value = !running.value
  if (running.value && !intervalId) {
    intervalId = setInterval(tick, 1000)
  } else if (!running.value && intervalId) {
    clearInterval(intervalId); intervalId = null
  }
}

function reset() {
  remaining.value = totalSeconds.value
  running.value = false
  if (intervalId) { clearInterval(intervalId); intervalId = null }
}

function completeFocus() {
  if (!focus.value) return
  store.updateTodo({ id: focus.value.id, text: focus.value.text, isCompleted: true, priority: focus.value.priority })
  if (intervalId) { clearInterval(intervalId); intervalId = null }
  store.clearFocus()
  router.push('/').catch(()=>{}) 
}

function exitFocus() {
  if (intervalId) { clearInterval(intervalId); intervalId = null }
  store.clearFocus()
  router.push('/').catch(()=>{})
}

function onSelectFocus() {}

const minutesDisplay = computed(() => String(Math.floor(remaining.value / 60)).padStart(2, '0'))
const secondsDisplay = computed(() => String(remaining.value % 60).padStart(2, '0'))

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
:root {
  --app-header-height: 72px;
  --bg: #071024;
  --surface: #0f172a;
  --muted: rgba(60, 60, 58, 0.6);
  --primary: #ffafcc;
  --accent: rgba(255,175,204,0.12);
  --input-bg: rgba(255,255,255,0.02);
  --btn-ghost-border: rgba(255,255,255,0.06);
}

.focus-root {
  position: relative;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  background: linear-gradient(180deg, var(--bg), #071428 80%);
  color: var(--muted);
  display: flex;
  flex-direction: column;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  z-index: 20; 
}

.main {
  min-height: calc(100vh - var(--app-header-height));
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
}

.fm-main {
  flex:1;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  gap:1rem;
  padding:2rem;
  text-align:center;
  z-index: 10;
}

.fm-title {
  font-size: clamp(1.4rem, 3vw, 2.4rem);
  margin:0;
  color: #000000;
  max-width: 90%;
  word-break:break-word;
}

/* timer */
.timer { display:flex; flex-direction:column; align-items:center; gap:.75rem; margin-top: .5rem; }
.time {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", "Segoe UI Mono", monospace;
  font-size: clamp(2.2rem, 6vw, 4rem);
  font-weight: 800;
  color: var(--primary);
  letter-spacing: 0.02em;
  background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  padding: 0.4rem 0.75rem;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.03);
}

.controls { display:flex; gap:0.5rem; margin-top:0.5rem; }
.preset { margin-top:0.5rem; display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }

.notes { width: min(900px, 92%); margin-top:1rem; text-align:left; }
.notes h3 { color: #000000; margin-bottom:0.5rem; }
.notes textarea {
  width:100%;
  min-height:120px;
  padding:.75rem;
  border-radius:8px;
  border:1px solid #e1e1e1;
  background: #f6f6f6; 
  color: #071024; 
  resize: vertical;
}
.notes textarea::placeholder { color: #8b8b8b; }

.fm-empty {
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:0 1rem;
  color:rgba(107, 110, 113, 0.7);
  z-index: 10;
}

:deep(.header) {
  background: #179b1b !important;
  border-bottom: 1px solid rgba(0,0,0,0.12) !important;
  padding: 1rem !important;
  z-index: 1000 !important;
}

:deep(.header .nav a) {
  color: #ffffff !important;
}

.focus-root, .btn, select { pointer-events: auto; }

@media (max-width:640px) {
  .time { font-size: 2.6rem }
}
</style>