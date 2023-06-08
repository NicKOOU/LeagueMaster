<template>
  <div class="champ-select">
    <img src="/path/to/your/logo.png" class="logo" alt="Logo">
    <div v-if="!runes.primaryStyleId">
      <h2>Champion Select</h2>
      <p>Waiting for Champion...</p>
    </div>
    <div v-else>
      <h2>Champion Select</h2>
      <p>Champion: {{ runes.championName }}</p>
      <p>Primary Rune: {{ runes.primaryStyleId }}</p>
      <p>Secondary Rune: {{ runes.subStyleId }}</p>
      <p>Perks: {{ runes.selectedPerkIds }}</p>
    </div>
  </div>
</template>

<style>
.champ-select {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: white;
}

</style>

  
  <script>
  export default {
    data() {
      return {
        runes: {},
      };
    },
    created() {
      this.$ws.addEventListener('message', (event) => {
        console.log('Received message:', event.data);
        const message = JSON.parse(event.data);
        if (message.primaryStyleId && message.subStyleId && message.selectedPerkIds) {
          this.runes = message;
        }
        if(message.Session === "None")
        {
          this.$router.push('/session');
        }
      });
    },
  };
  </script>