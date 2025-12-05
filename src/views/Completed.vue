<template>
  <h3>Completed ✅</h3>

  <div class="actions" style="margin:0.5rem 0;">
    <button @click="removeAllCompleted">Remove all completed</button>
  </div>

  <div>
    <ul>
      <li v-for="completedTodo in completedTodos" :key="completedTodo.id">
        {{ completedTodo.text }}
      </li>
    </ul>
  </div>
</template>

<script>
import { useTodos } from '@/stores/todos';
import { mapActions, mapState } from 'pinia';

//buat nampilin yang udah selesai
export default {
  computed: {
    ...mapState(useTodos, ['completedTodos', 'hasHistory'])
  },

  methods: {
    ...mapActions(useTodos, [
      'removeAllCompleted'
    ])
  }
}
</script>