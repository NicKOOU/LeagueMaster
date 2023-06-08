<template>
  <div class="app">
    <HeaderSection v-if="!isLoading" />
    <div class="content">
      <router-view></router-view>
    </div>
    <FooterSection v-if="!isLoading" />
    <div class="loading-overlay" v-if="isLoading">
      <p>Loading...</p>
    </div>
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
  position: relative;
  min-height: 100vh;
}

.content {
  overflow-y: auto; /* Enable vertical scrolling for the content */
  max-height: calc(100vh - 120px); /* Adjust the max-height to account for header and footer heights */
}

.content::-webkit-scrollbar {
  display: none;
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
  z-index: 9999;
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
          console.log('Response:', data);
          if (data.message === 'LCU login successful' || data.message === 'LCU already logged in') {
            setTimeout(() => {
              this.isLoading = false;
              router.push('/session');
            }, 2000); // Delay in milliseconds (2 seconds)
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
