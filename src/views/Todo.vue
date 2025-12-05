<template>
  <h3>To-Do ⏳</h3>

  <form @submit.prevent="onAdd">
    <input v-model="todo.text" type="text" name="text" placeholder="New todo..." />
    <select v-model="todo.priority">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </select>
    <button :disabled="!todo.text" type="submit">Add</button>
  </form>

  <div class="actions" style="margin:0.5rem 0;">
    <button @click="markAllCompleted">Mark all completed</button>
    <button @click="removeAllCompleted">Remove all completed</button>
    <button @click="undo" :disabled="!hasHistory">Undo</button>
  </div>

  <div>
    <ul style="list-style:none; padding:0; margin:0;">
      <li
        v-for="(element, index) in pendingTodos"
        :key="element.id"
        :data-id="element.id"
        draggable="true"
        @dragstart="onDragStart($event, element.id)"
        @dragover.prevent="onDragOver($event, index)"
        @drop="onDrop($event, index)"
        style="display:flex; gap:0.5rem; align-items:center; padding:0.25rem 0; cursor:grab; background:#fff;"
      >
        <span>[{{ element.priority }}]</span>
        <span style="flex:1">{{ element.text }}</span>
        <button @click.prevent="updateTodo({ ...element, isCompleted: true })">✅</button>
        <button @click.prevent="destroyTodo(element.id)">❌</button>
      </li>
    </ul>
  </div>
</template>

<script>
import { useTodos } from '@/stores/todos';
import { mapActions, mapState } from 'pinia';

export default {
  computed: {
    ...mapState(useTodos, [
      'pendingTodos',
      'completedTodos',
      'hasHistory'
    ])
  },

  data: () => ({
    todo: {
      text: null,
      priority: 'medium',
      isCompleted: false,
    },
    draggingId: null,
    dragOverIndex: null
  }),

  methods: {
    ...mapActions(useTodos, [
      'storeTodo',
      'updateTodo',
      'destroyTodo',
      'reorderTodosByIds',
      'removeAllCompleted',
      'markAllCompleted',
      'undo'
    ]),

    onAdd() {
      if (!this.todo.text) return
      this.storeTodo({ text: this.todo.text, priority: this.todo.priority })
      this.todo.text = null
      this.todo.priority = 'medium'
    },

    onDragStart(event, id) {
      this.draggingId = id
      event.dataTransfer.effectAllowed = 'move'
      try { event.dataTransfer.setData('text/plain', String(id)) } catch (e) { /* Safari */ }
    },

    onDragOver(event, index) {
      this.dragOverIndex = index
    },

    onDrop(event, dropIndex) {
      const draggedId = this.draggingId ?? event.dataTransfer.getData('text/plain')
      if (!draggedId) return

      const id = Number(draggedId)
      const ids = this.pendingTodos.map(t => t.id)

      const from = ids.indexOf(id)
      if (from === -1) return
      ids.splice(from, 1)
      const to = Math.min(Math.max(dropIndex, 0), ids.length)
      ids.splice(to, 0, id)

      this.reorderTodosByIds(ids)

      this.draggingId = null
      this.dragOverIndex = null
    }
  }
}
</script>