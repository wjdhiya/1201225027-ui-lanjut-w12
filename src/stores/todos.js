import { defineStore } from "pinia"

export const useTodos = defineStore('useTodos', {
  state: () => {
    const saved = JSON.parse(localStorage.getItem('todos') || 'null')
    return saved
      ? { nextId: saved.nextId, todos: saved.todos, history: [], historyLimit: 20 }
      : { nextId: 0, todos: [], history: [], historyLimit: 20 }
  },

  getters: {
    pendingTodos: (state) => {
      return state.todos.filter(todo => !todo.isCompleted)
    },
    completedTodos: (state) => {
      return state.todos.filter(todo => todo.isCompleted)
    },
    hasHistory: (state) => state.history.length > 0
  },

  actions: {
    pushHistory() {
      const snapshot = {
        nextId: this.nextId,
        todos: JSON.parse(JSON.stringify(this.todos))
      }
      this.history.push(snapshot)
      if (this.history.length > this.historyLimit) this.history.shift()
    },

    save() {
      localStorage.setItem('todos', JSON.stringify({ nextId: this.nextId, todos: this.todos }))
    },

    storeTodo(payload) {
      this.pushHistory()
      //utk dropdown kategori prioritas nya
      const item = {
        id: this.nextId++,
        text: payload.text,
        isCompleted: false,
        priority: payload.priority || 'medium' // tampilkan medium di halaman
      }
      this.todos.push(item)
      this.save()
    },

    updateTodo(payload) {
      this.pushHistory()
      const index = this.todos.findIndex(item => item.id == payload.id)
      if (index != -1) {
        this.todos[index] = { ...this.todos[index], text: payload.text, isCompleted: payload.isCompleted, priority: payload.priority ?? this.todos[index].priority }
        this.save()
      }
    },

    destroyTodo(id) {
      this.pushHistory()
      const index = this.todos.findIndex(item => item.id == id)
      if (index > -1 && index < this.todos.length) {
        this.todos.splice(index, 1)
        this.save()
      }
    },

    // INI BUAT APA DEH reorder pending items by array of ids (newOrderIds)
    reorderTodosByIds(newOrderIds = []) {
      this.pushHistory()
      const pendingMap = Object.fromEntries(this.todos.filter(t => !t.isCompleted).map(t => [t.id, t]))
      const completed = this.todos.filter(t => t.isCompleted)
      const newPending = newOrderIds.map(id => pendingMap[id]).filter(Boolean)
      this.todos = [...newPending, ...completed]
      this.save()
    },

    removeAllCompleted() {
      this.pushHistory()
      this.todos = this.todos.filter(t => !t.isCompleted)
      this.save()
    },

    markAllCompleted() {
      this.pushHistory()
      this.todos = this.todos.map(t => ({ ...t, isCompleted: true }))
      this.save()
    },

    undo() {
      if (!this.history.length) return
      const last = this.history.pop()
      this.nextId = last.nextId
      this.todos = last.todos
      this.save()
    }
  },
})