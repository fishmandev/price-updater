<template>
    <div id="app">
        <ul>
            <li>
                <router-link to="/">Home</router-link>
            </li>
            <li>|</li>
            <li>
                <router-link to="/currency">Currency</router-link>
            </li>
        </ul>
        <router-view></router-view>
    </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 10px;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    li {
        display: inline;
    }

    li > a {
        text-decoration: none;
    }
</style>
