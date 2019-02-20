<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang='scss'>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
}
// ::-webkit-scrollbar {
//   display: none;
// }
// scrollbar {
//   display: none;
// }
html,
body {
  height: 100%;
  width: 100%;
  background-color: #f8f9fd;
  font-size: 14px;
}

.fff {
  background: #fff;
}
input,
textarea {
  border: 0px;
  outline: none;
}
ul {
  list-style: none;
}
a {
  text-decoration: none;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.clearfix:before,
.clearfix:after {
  content: "";
  display: block;
  clear: both;
}
.pagination{
  margin-top: 10px;
}
.content-box{
  position: absolute;
  left: 250px;
  right: 0;
  top: 70px;
  bottom: 0;
  padding: 15px;
  -webkit-transition: left .3s ease-in-out;
  transition: left .3s ease-in-out;
  background: rgb(32, 34, 39);
}
.sidebar{
  .el-submenu {
    &>.el-menu-item{
      padding-left: 80px;
    }
  }
  .el-menu-item .is-active{
    background-color: #18191d;
  }
}
</style>
