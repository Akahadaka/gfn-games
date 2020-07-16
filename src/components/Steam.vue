<template>
  <v-container :class="!authenticated && 'fixed'">
    <v-container class="d-flex justify-space-between">
      <h2>My Steam Games</h2>
      <v-btn
        icon
        @click="onVisibility"
        class="visibility-btn"
      >
        <v-icon>{{visibility ? 'visibility' : 'visibility_off'}}</v-icon>
      </v-btn>
    </v-container>
    <template v-if="authenticated">
      <template v-for="game in games">
        <v-container
          :key="'Steam'+game.id"
          class="py-0"
          :class="{'matched py-2': game.free || matches.includes(game.steamAppId), 'non-steam' : !game.steamAppId, 'unavailable py-2': game.status != 'AVAILABLE'}"
          v-if="!matches.includes(game.steamAppId) || game.source == 'Steam'"
        >
          <v-card
            outlined
            class="d-inline-block my-2 d-flex"
          >
            <template v-if="game.source == 'Steam'">
              <v-flex class="d-flex justify-space-between">
                <v-card-title class="title">
                  <span class="title-text">{{game.title}}</span>
                </v-card-title>
                <v-spacer />
                <a
                  :href="game.steamUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-2 visit align-self-center"
                >Store Page</a>
                <v-btn
                  color="secondary"
                  class="action play"
                  @click="onPlay(game.steamAppId)"
                >Play</v-btn>
              </v-flex>
            </template>
            <template v-else-if="game.steamUrl">
              <v-flex class="d-flex justify-space-between">
                <v-card-title class="title">
                  <small>-</small>
                </v-card-title>
                <v-spacer />
                <a
                  :href="game.steamUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-2 visit align-self-center"
                >Store Page</a>
                <v-btn
                  v-if="game.free"
                  color="secondary"
                  class="action play"
                  @click="onPlay(game.steamAppId)"
                >Play</v-btn>
                <!-- <v-btn
                  color="primary"
                  class="action buy"
                  @click="onBuy(game.steamUrl)"
                  v-else
                >Buy</v-btn>-->
              </v-flex>
            </template>
            <template v-else>
              <v-card-title class="title"></v-card-title>
            </template>
          </v-card>
        </v-container>
      </template>
    </template>

    <v-container v-else-if="loading">
      <p>Fetching Steam games...</p>
    </v-container>

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
          <v-btn @click="onSubmit">Okay</v-btn>
        </v-container>
      </v-card>
    </form>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';

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
      loading: false as boolean,
      visibility: true as boolean,
    };
  },

  created() {
    this.gamesSubscription = gameService.games$.pipe(
      // Find the matches between Steam and Geforce NOW
      map((games: Game[]) => {
        let prev: Game;
        games.map((game: Game) => {
          if (prev && game.steamAppId && prev.steamAppId === game.steamAppId) {
            this.matches.push(game.steamAppId);
          }
          prev = game;
        });
        return games;
      }),
    ).subscribe((games: Game[]) => {
      // Display only if there are Steam games in the list
      if (games.find((game: Game) => game.source == 'Steam')) {
        this.games = games;
        this.authenticated = true;
        this.loading = false;
      }
    });
  },

  methods: {
    onSubmit() {
      this.loading = true;
      steamService.steamid = this.steamid;
    },
    onVisibility() {
      this.visibility = !this.visibility;
      steamService.filter = this.visibility ? [] : this.matches;
    },
    onBuy(url: string) {
      window.open(url, '_blank');
    },
    onPlay(appid: number) {
      window.open(`steam://run/${appid}`, '_blank');
      // window.open(`com.nvidia.gfnpc.streamer.${id}.app`, '_blank')
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
  .non-steam & {
    padding: 24px;
  }
}
.fixed {
  position: fixed;
  // TODO Find out how to contain a position:fixed element in parent bounds
  width: calc(50% - 12px);
}
.matched {
  // TODO Not widely supported
  background-color: var(--v-secondary-lighten1);
}
.unavailable {
  background-color: lightgray;
  .title {
    color: darkgrey;
  }
}
.action {
  margin: 6px;
  background-color: var(--v-primary-lighten1);
}
.play {
  background-color: var(--v-secondary-lighten1);
}
.visit {
  white-space: nowrap;
}
.non-steam {
  opacity: 0;
}
</style>
