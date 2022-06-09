<template>
  <div id="app">
    <UploadForm class="upload-form" />
    <PathList class="path-list" />
  </div>
</template>

<script>
import UploadForm from './components/UploadForm'
import PathList from './components/PathList'

export default {
  name: 'App',
  components: {
    UploadForm,
    PathList,
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

.upload-form {
  margin-bottom: 1.5rem;
}
</style>
