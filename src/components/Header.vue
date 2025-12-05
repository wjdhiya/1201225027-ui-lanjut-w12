<template>
  <header class="header">
    <h1>My List</h1>
    <nav class="nav">
      <RouterLink to="/">Todo</RouterLink>
      <RouterLink to="/completed">Completed</RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
}

.nav {
  display: flex;
  gap: 1rem;
}

.nav a {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav a:hover {
  background-color: #f0f0f0;
}

.nav a.router-link-active {
  background-color: #ffafcc;
  color: white;
}
</style>