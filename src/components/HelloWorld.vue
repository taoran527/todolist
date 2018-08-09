<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <list></list>
    <label></label>
  </div>
</template>

<script>
  import list from './list.vue'
  import page from './page.vue'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Double-click to edit a todo'
    }
  },
  components: {
    'list': list,
    'page': page,
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
  label{
    display: block;
    margin-top: 100px;
  }
</style>
