<template>
  <div class="home-view">
    <heart-animation></heart-animation>
  </div>
</template>

<script>
import HeartAnimation from '../components/HeartAnimation.vue';

export default {
  components: {
    HeartAnimation,
  },
};
</script>

<style scoped>
.home-view {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: Arial, sans-serif;
  background-color: #141336;
  overflow: hidden;
}
</style>