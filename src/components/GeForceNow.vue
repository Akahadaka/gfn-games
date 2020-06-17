<template>
  <v-container>
    <v-container>
      <h2>GeForce NOW Games</h2>
    </v-container>
    <template v-for="game in games">
      <v-container
        :key="'GFN'+game.id"
        class="py-0"
        v-bind:class="{'matched py-2': game.free || matches.includes(game.steamAppId), 'unavailable py-2': game.status != 'AVAILABLE'}"
        v-if="!matches.includes(game.steamAppId) || game.source == 'GFN'"
      >
        <v-card
          outlined
          class="d-inline-block my-2 d-flex"
        >
          <template v-if="game.source == 'GFN'">
            <v-container class="pa-0 d-flex justify-space-between">
              <v-card-title class="title">
                <span class="title-text">{{game.title}}</span>
              </v-card-title>
              <v-spacer />
              <v-chip
                v-if="game.free"
                class="ma-2 free"
                color="secondary"
              >
                free
              </v-chip>

              <v-avatar
                v-if="game.steamUrl"
                size="20"
                class="ma-3 mt-4"
              >
                <img src="/assets/steam.svg" />
              </v-avatar>
            </v-container>
          </template>
          <template v-else>
            <v-card-title class="title"><small>-</small></v-card-title>
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
          if (prev && game.steamAppId && prev.steamAppId === game.steamAppId) {
            this.matches.push(game.steamAppId);
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
  padding: 10px;
  overflow: hidden;
  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    height: 0;
  }
  &-text {
    white-space: nowrap;
    padding-right: 10px;
  }
}
.matched {
  background-color: var(--v-secondary-base);
}
.unavailable {
  background-color: lightgray;
  .title {
    color: darkgrey;
  }
}
.free {
  font-variant: small-caps;
  .unavailable & {
    background-color: lightgray !important;
  }
}
</style>
