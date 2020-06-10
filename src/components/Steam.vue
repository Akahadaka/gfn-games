<template>
  <v-container :class="!authenticated && 'fixed'">
    <h2>Steam Games</h2>
    <template v-if="authenticated">
      <template v-for="game in games">
        <v-container
          :key="game.id"
          class="py-0"
          v-bind:class="{'matched py-2': matches.includes(game.appid)}"
          v-if="!matches.includes(game.appid) || game.source == 'Steam'"
        >
          <v-card
            outlined
            class="d-inline-block my-2 d-flex"
          >
            <template v-if="game.source == 'Steam'">
              <v-card-title class="title">{{ game.title }}</v-card-title>
            </template>
            <template v-else>
              <v-card-title class="title">-</v-card-title>
            </template>
          </v-card>
        </v-container>
      </template>
    </template>

    <form v-else>
      <v-card
        outlined
        class="my-2"
      >
        <v-card-title>Provide your Steam ID</v-card-title>
        <v-card-subtitle>
          <em>(This is a number)</em>
        </v-card-subtitle>
        <v-container class="pa-4">
          <v-text-field
            v-model="steamid"
            label="Enter your Steam ID"
          />
          <v-btn @click="submit">Okay</v-btn>
        </v-container>
      </v-card>
    </form>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import gameService, { Game } from "@/services/game.service";
import steamService from '@/services/steam.service';

export default Vue.extend({
  data() {
    return {
      gamesSubscription: {} as Subscription,
      games: [] as Game[],
      matches: [] as number[],
      steamid: '' as string,
      authenticated: false as boolean,
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
      })
    ).subscribe((games: Game[]) => {
      if (games.find((game: Game) => game.source == 'Steam')) {
        this.games = games;
        this.authenticated = true;
      }
    });
  },

  methods: {
    submit() {
      steamService.steamid = this.steamid;
    },
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
.fixed {
  position: fixed;
  width: calc(100vw - 58%);
}
.matched {
  background-color: var(--v-secondary-base);
}
</style>
