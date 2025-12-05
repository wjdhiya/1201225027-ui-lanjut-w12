<template>
  <header class="header">
    <h1>My List</h1>
    <nav class="nav">
      <RouterLink to="/">Todo</RouterLink>
      <RouterLink to="/completed">Completed</RouterLink>
      <RouterLink to="/focus">Focus</RouterLink>
    </nav>
  </header>
</template>

<script setup>
</script>

<style scoped>
.header {
  position: relative;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
  pointer-events: auto;
  background: #179b1b}

.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav a {
  text-decoration: none;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.12s ease, color 0.12s ease;
  pointer-events: auto;
}

.nav a:hover {
  background-color: #000;
}

.nav a.router-link-active {
  background-color: #ffafcc;
  color: white;
}
</style>