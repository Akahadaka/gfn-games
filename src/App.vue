<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Nvidia Logo"
          class="shrink mr-2"
          contain
          src="/assets/nvidia.svg"
          transition="scale-transition"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://www.nvidia.com/en-us/geforce-now/release-highlights/"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>open_in_new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Home from "@/pages/Home.vue";

export default Vue.extend({
  name: "App",

  components: {
    Home
  },

  data: () => ({
    //
  })
});
</script>

<style lang="scss">
html {
  height: 100%;
  // scrollbar-width   : none;  // For disabling vertical scrolbar from showing on Firefox
  // -ms-overflow-style: none;  // For disabling vertical scrolbar from showing on Internet Explorer and Edge
}

html::-webkit-scrollbar {
  // width: 0px; // For disabling vertical scrolbar from showing on Chrome, Safari, and Opera
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
