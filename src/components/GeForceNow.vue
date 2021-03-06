<template>
  <v-container>
    <v-container>
      <h2>All GeForce NOW Games</h2>
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
                v-if="game.new"
                class="ma-2 new"
              >new</v-chip>
              <v-chip
                v-if="game.free"
                class="ma-2 free"
                color="secondary"
              >free</v-chip>
              <v-avatar
                v-if="game.store === 'uplay'"
                size="32"
                class="mx-2 mt-3 mb-0"
                style="opacity: 0.7"
              >
                <img src="/assets/uplay.svg" />
              </v-avatar>
              <v-avatar
                v-if="game.store === 'epic'"
                size="28"
                class="ma-2 mt-3"
                tile
              >
                <img src="/assets/epic.svg" />
              </v-avatar>
              <v-avatar
                v-if="game.store === 'steam'"
                size="20"
                class="ma-3 mt-4"
              >
                <img src="/assets/steam.svg" />
              </v-avatar>
              <v-avatar
                v-if="game.store === 'origin'"
                size="28"
                class="ma-2 mt-3"
                style="opacity: 0.7"
              >
                <img src="/assets/origin.svg" />
              </v-avatar>
            </v-container>
          </template>
          <template v-else>
            <v-card-title class="title">
              <small>-</small>
            </v-card-title>
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
  background-color: var(--v-secondary-lighten1);
}
.unavailable {
  background-color: lightgray;
  .title {
    color: darkgrey;
  }
  .v-avatar {
    opacity: 0.4;
  }
}
.free {
  min-width: 47px;
  font-variant: small-caps;
  .unavailable & {
    background-color: lightgray !important;
  }
}
.new {
  min-width: 47px;
  font-variant: small-caps;
  background-color: orange !important;
  color: white !important;
  .unavailable & {
    background-color: lightgray !important;
  }
}
</style>
