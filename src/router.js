import { createRouter, createWebHistory } from 'vue-router'

import Todo from './views/Todo.vue'
import Completed from './views/Completed.vue'
import Focus from './views/focus.vue'  

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Todo },
    { path: '/completed', component: Completed },
    { path: '/focus/:id?', component: Focus, props: true } 
  ]
})

export default router
