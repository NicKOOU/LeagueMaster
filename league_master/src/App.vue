<template>
  <div>
    <div v-if="isLoading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoading: true,
    };
  },
  created() {
    const ws = new WebSocket('ws://localhost:3000');
    const router = this.$router;

    ws.addEventListener('open', () => {
      console.log('WebSocket connection established');

      fetch('http://localhost:3000/api/login')
        .then(response => response.json())
        .then(data => {
          if (data.message === 'LCU login successful' || data.message === 'LCU already logged in') {
            this.isLoading = false;
            router.push('/session');
          } else {
            console.log('Invalid response:', data);
          }
        })
        .catch(error => {
          console.error('Error occurred while making the request:', error);
        });
    });

    ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);

      if (message.Session === 'ChampSelect') {
        router.push('/champ-select');
      }
    });

    ws.addEventListener('close', () => {
      console.log('WebSocket connection closed');
    });

    this.$ws = ws;
  },
};
</script>
