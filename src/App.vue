<template>
  <div class="layout">
    <Header />
    <main class="main">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue"
import Footer from "./components/Footer.vue"

import Todo from "./views/Todo.vue"

export default {
  components: {
    Header,
    Footer
  },
}
</script>