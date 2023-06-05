<template>
  <div class="app">
    <HeaderSection />
    <div>
      <router-view></router-view>
    </div>
    <FooterSection />
  </div>
</template>

<style>
/* CSS Reset */
body {
  margin: 0;
  padding: 0;
}

.app {
  background-color: #141336;
  position: relative; /* Add position relative to the app container */
  min-height: 100vh; /* Set a minimum height to fill the viewport */
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Ensure the overlay is above other elements */
}

</style>

<script>
import FooterSection from "@/components/Footer.vue";
import HeaderSection from "@/components/Header.vue";

export default {
  name: 'App',
  components: {
    FooterSection,
    HeaderSection
  },
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
