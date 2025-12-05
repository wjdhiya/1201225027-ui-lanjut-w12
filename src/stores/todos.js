import { defineStore } from "pinia"

export const useTodos = defineStore('useTodos', {
  state: () => {
    const saved = JSON.parse(localStorage.getItem('todos') || 'null')
    return saved
      ? {
          nextId: saved.nextId,
          todos: saved.todos,
          focusId: saved.focusId ?? null,
          focusNotes: saved.focusNotes ?? {},
          history: [],
          historyLimit: 20
        }
      : { nextId: 0, todos: [], focusId: null, focusNotes: {}, history: [], historyLimit: 20 }
  },

  getters: {
    pendingTodos: (state) => {
      return state.todos.filter(todo => !todo.isCompleted)
    },
    completedTodos: (state) => {
      return state.todos.filter(todo => todo.isCompleted)
    },
    hasHistory: (state) => state.history.length > 0,
    focusTodo: (state) => state.todos.find(t => t.id === state.focusId) ?? null
  },

  actions: {
    pushHistory() {
      const snapshot = {
        nextId: this.nextId,
        todos: JSON.parse(JSON.stringify(this.todos)),
        focusId: this.focusId,
        focusNotes: JSON.parse(JSON.stringify(this.focusNotes))
      }
      this.history.push(snapshot)
      if (this.history.length > this.historyLimit) this.history.shift()
    },

    save() {
      localStorage.setItem('todos', JSON.stringify({
        nextId: this.nextId,
        todos: this.todos,
        focusId: this.focusId,
        focusNotes: this.focusNotes
      }))
    },

    storeTodo(payload) {
      this.pushHistory()
      const item = {
        id: this.nextId++,
        text: payload.text,
        isCompleted: false,
        priority: payload.priority || 'medium'
      }
      this.todos.push(item)
      this.save()
    },

    updateTodo(payload) {
      this.pushHistory()
      const index = this.todos.findIndex(item => item.id == payload.id)
      if (index != -1) {
        this.todos[index] = {
          ...this.todos[index],
          text: payload.text,
          isCompleted: payload.isCompleted,
          priority: payload.priority ?? this.todos[index].priority
        }
        this.save()
      }
    },

    destroyTodo(id) {
      this.pushHistory()
      const index = this.todos.findIndex(item => item.id == id)
      if (index > -1 && index < this.todos.length) {
        this.todos.splice(index, 1)
        // if the deleted todo was focused, clear focus
        if (this.focusId === id) this.focusId = null
        this.save()
      }
    },

    // untuk ambil todo berdasarkan id
    reorderTodosByIds(newOrderIds = []) {
      this.pushHistory()
      const pending = this.todos.filter(t => !t.isCompleted)
      const pendingMap = Object.fromEntries(pending.map(t => [t.id, t]))
      const newPending = []
      newOrderIds.forEach(rawId => {
        const id = Number(rawId)
        const item = pendingMap[id]
        if (item) {
          newPending.push(item)
          delete pendingMap[id]
        }
      })
      // append remaining pending items not present in newOrderIds
      Object.values(pendingMap).forEach(item => newPending.push(item))
      const completed = this.todos.filter(t => t.isCompleted)
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

    // Focus helpers
    setFocus(id) {
      this.pushHistory()
      this.focusId = id
      // ensure notes key exists
      if (id != null && this.focusNotes[id] == null) this.focusNotes[id] = ''
      this.save()
    },

    clearFocus() {
      this.pushHistory()
      this.focusId = null
      this.save()
    },

    updateFocusNotes(id, notes) {
      this.pushHistory()
      this.focusNotes = { ...this.focusNotes, [id]: String(notes ?? '') }
      this.save()
    },

    undo() {
      if (!this.history.length) return
      const last = this.history.pop()
      this.nextId = last.nextId
      this.todos = last.todos
      this.focusId = last.focusId ?? null
      this.focusNotes = last.focusNotes ?? {}
      this.save()
    }
  },
})