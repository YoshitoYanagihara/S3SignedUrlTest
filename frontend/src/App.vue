<template>
  <div id="app">
    <UploadForm />
  </div>
</template>

<script>
import UploadForm from './components/UploadForm'

export default {
  name: 'App',
  components: {
    UploadForm,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
