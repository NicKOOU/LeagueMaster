<template>
  <div class="session">
    <div class="header">
      <!-- Header content goes here -->
    </div>
    <div class="content">
      <div class="info-container">
        <div v-if="session === 'ChampSelect'" class="centered-container">
          <div class="card-animation-container">
            <div class="card-container">
              <CardView v-if="summonerName && summonerLevel" :summonerName="summonerName" :summonerLevel="summonerLevel" />
            </div>
            <div class="waiting-animation">
              <div class="lds-circle"><div></div></div>
              <h2>Waiting for game to start</h2>
            </div>
          </div>
        </div>
        <CardView v-else />
      </div>
    </div>
    <div class="footer">
      <!-- Footer content goes here -->
    </div>
  </div>
</template>

<style scoped>
.session {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: white;
}

.header {
  flex: 0 0 auto;
  background-color: #141336;
  padding: 10px;
  /* Add other header styles as needed */
}

.content {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.info-container {
  text-align: center;
}

.centered-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-animation-container {
  display: flex;
}

.card-container {
  margin-right: 20px;
}

.image-container {
  margin-top: auto;
  margin-left: 100px;
  margin-right: auto;
  margin-bottom: 20px;
  width: 200px;
  height: 200px;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.gold-container {
  width: 200px;
  height: 100px;
  background-color: gold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  border-radius: 5px;
}

.name {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.waiting-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
}

.lds-circle {
  display: inline-block;
  transform: translateZ(1px);
}

.lds-circle > div {
  display: inline-block;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-radius: 50%;
  background: #fff;
  animation: lds-circle 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

@keyframes lds-circle {
  0%, 100% {
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(1800deg);
    animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
  }
  100% {
    transform: rotateY(3600deg);
  }
}
</style>

<script>
import router from '@/router';
import CardView from '../components/card.vue';

export default {
  components: {
    CardView,
  },
  data() {
    return {
      session: 'NoGameFound',
      summonerName: '',
      summonerLevel: 0,
    };
  },

  created() {
    this.$ws.addEventListener('message', (event) => {
      console.log('Received message:', event.data);
      const message = JSON.parse(event.data);
      if (message.Session === 'ChampSelect') {
        this.session = 'ChampSelect';
        this.runesReceived = false;
        router.push('/champ-select');
      } else {
        this.session = 'NoGameFound';
      }
    });
  },
};
</script>