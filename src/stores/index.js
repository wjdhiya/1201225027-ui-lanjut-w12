import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Todo.vue'

const pinia = createPinia()

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/focus/:id?', name: 'Focus', component: () => import('@/views/focus.vue'), props: true }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default { pinia, router }