<template>
  <v-container>
    <h2>GeForce NOW Games</h2>
    <v-card v-for="game in games" :key="game.id">{{ game.title }}</v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import gfnService, { Game } from "@/services/gfn.service";

export default Vue.extend({
  data() {
    return {
      games: [] as Game[]
    };
  },

  created() {
    gfnService.staticGames$.subscribe((games: Game[]) => {
      this.games = games;
    });
  }
});
</script>

<style scoped lang="scss"></style>
