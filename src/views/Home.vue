<template>
  <main id="home">
    <v-row>
      <v-col
        cols="6"
        class="col-left"
      >
        <GeForceNow />
      </v-col>
      <v-col
        cols="6"
        class="col-right"
      >
        <Steam />
      </v-col>
    </v-row>
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
.col {
  &-left {
    padding-right: 0;
  }
  &-right {
    padding-left: 0;
  }
}
</style>
