<template>
  <div>
    <h1>Waiting for champ select to begin</h1>
    <div v-if="session === 'ChampSelect'">
      <h2>Champion Select</h2>
      <p>Waiting for Champion...</p>
    </div>
    <div v-else>
      <h2>No Game Found</h2>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      session: 'NoGameFound',
      runesReceived: false,
      runes: {},
    };
  },

  created() {
    this.$ws.addEventListener('message', (event) => {
      console.log('Received message:', event.data);
      const message = JSON.parse(event.data);
      if (message.Session === 'ChampSelect') {
        this.session = 'ChampSelect';
        this.runesReceived = false;
      }
        else {
        this.session = 'NoGameFound';
      }
    });
  },
};
</script>
