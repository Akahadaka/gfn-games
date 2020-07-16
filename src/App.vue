<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="logo"
          class="shrink mr-2"
          contain
          src="/assets/nvidia-controller.png"
          transition="scale-transition"
          width="60"
        />
      </div>

      <div class="logo">
        <span class="nvidia">GeForce NOW streaming</span><br />
        <small>Find and compare with your existing library</small>
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
import Home from "@/views/Home.vue";

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
  color: var(--v-primary-base);
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: var(--v-primary-base);
}

#nav a.router-link-exact-active {
  color: var(--v-secondary-base);
}
.logo {
  color: var(--v-accent-base);
  font-weight: 900;
  small {
    font-size: xx-small;
    letter-spacing: 0.27em;
  }
  .nvidia {
    font-size: 1.2em;
    font-variant: small-caps;
    letter-spacing: 0.2em;
  }
  line-height: 14px;
}
</style>
