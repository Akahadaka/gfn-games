<template>
  <main id="home">
    <v-container>
      <v-row class="games-list">
        <v-col cole="6">
          <GeForceNow />
        </v-col>
        <v-col cols="6">
          <Steam />
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script lang="ts">
import Vue from "vue";
import GeForceNow from "@/components/GeForceNow.vue";
import Steam from "@/components/Steam.vue";

export default Vue.extend({
  name: "Home",

  components: {
    GeForceNow,
    Steam
  }
});
</script>

<style scoped lang="scss">
.games-list {
  scrollbar-width: auto;
}
</style>
