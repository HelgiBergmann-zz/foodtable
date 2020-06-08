<template>
  <div id="app">
    <Table :titles="titles" :items="products"/>
    <footer class="text-right">
      <div class="container">
         Made with <div style="display: inline-block;width: 20px"><img style="width:100%;" alt="Vue logo" src="./assets/logo.png"></div>
      </div>
    </footer>
  </div>
</template>

<script>
import Table from './components/Table.vue'
import { mapGetters } from 'vuex';
export default {
  name: 'App',
  components: {
    Table
  },
  computed: {
     ...mapGetters({
      products: 'foodtable/getProducts',
      titles: 'foodtable/getTitles'
     })
  },
  created() {
    this.$store.dispatch('foodtable/getProducts')
  }
}
</script>

<style >
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}



</style>
