<template>
  <v-container>
    <v-container>
      <h2>GeForce NOW Games</h2>
    </v-container>
    <template v-for="game in games">
      <v-container
        :key="game.id"
        class="py-0"
        v-bind:class="{'matched py-2': matches.includes(game.appid)}"
        v-if="!matches.includes(game.appid) || game.source == 'GFN'"
      >
        <v-card
          outlined
          class="d-inline-block my-2 d-flex"
        >
          <template v-if="game.source == 'GFN'">
            <v-card-title class="title">{{ game.title }}</v-card-title>
          </template>
          <template v-else>
            <v-card-title class="title">-</v-card-title>
          </template>
        </v-card>
      </v-container>
    </template>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import gameService, { Game } from "@/services/game.service";

export default Vue.extend({
  data() {
    return {
      gamesSubscription: {} as Subscription,
      games: [] as Game[],
      matches: [] as number[],
    };
  },

  created() {
    this.gamesSubscription = gameService.games$.pipe(
      // Find the matches between Steam and Geforce NOW
      tap((games: Game[]) => {
        let prev: Game;
        games.map((game: Game) => {
          if (prev && game.appid && prev.appid === game.appid) {
            this.matches.push(game.appid);
          }
          prev = game;
        });
      }),
    ).subscribe((games: Game[]) => {
      this.games = games;
    });
  },

  beforeDestroy() {
    this.gamesSubscription.unsubscribe();
  },
});
</script>

<style scoped lang="scss">
.title {
  max-height: 48px;
  overflow: hidden;
  padding: 10px;
}
.matched {
  background-color: var(--v-secondary-base);
}
</style>
