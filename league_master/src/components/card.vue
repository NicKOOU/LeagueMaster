<template>
  <div class="card-container">
    <div class="card">
      <div class="first-content">
        <div class="image-container">
          <img src="../assets/ivern-removebg-preview.png" alt="" class="image--cover" />
        </div>
        <div class="text-container">
          <h2>{{ summonerName }}</h2>
        </div>
      </div>
      <div class="second-content">
        <span>{{ "Level " + summonerLevel }}</span>
        <XpSection></XpSection>
        <div class="dice-container">
          <div v-for="roll in diceRolls" :key="roll" class="dice">
            <img :src="imageSrc" alt="Dice" />
          </div>
        </div>  
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  /* Adjust the height if needed */
}

.card {
  height: 200px;
  background: rgb(114, 98, 4);
  transition: all 0.4s;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.705);
  font-size: 30px;
  font-weight: 900;
  position: fixed;
}

.image--cover {
  width: 100px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center;
}

.card:hover {
  border-radius: 15px;
  cursor: pointer;
  transform: scale(1.2);
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.705);
  background: rgb(180, 26, 26);
}

.first-content {
  height: 100%;
  width: 100%;
  transition: all 0.4s;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  border-radius: 15px;
}

.card:hover .first-content {
  height: 0px;
  opacity: 0;
}

.second-content {
  height: 0%;
  width: 100%;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  flex-direction: column;
  transition: all 0.4s;
  font-size: 0px;
}

.card:hover .second-content {
  opacity: 1;
  height: 100%;
  font-size: 1.8rem;
  transform: rotate(0deg);
}

.dice-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 20px;
}

.dice {
  width: 100px;
  height: 100px;
  margin-right: 10px;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dice img {
  width: 80%;
  height: auto;
}
</style>

<script>
import XpSection from "@/components/Xp.vue";

export default {
  name: "CardView",
  components: {
    XpSection,
  },
  data() {
    return {
      summonerName: "",
      summonerLevel: "",
      percentCompleteForNextLevel: "",
      rerollPoints: "",
      imageSrc: "",
      diceRolls: [],
    };
  },
  created() {
    fetch("http://localhost:3000/api/current-summoner")
      .then((response) => response.json())
      .then((data) => {
        this.summonerName = data.displayName;
        this.summonerLevel = data.summonerLevel;
        this.rerollPoints = data.rerollPoints.numberOfRolls;
        this.diceRolls = Array.from({ length: this.rerollPoints }, () =>
          Math.floor(Math.random() * 6) + 1
        );

        // Set the image source for the dice
        this.imageSrc = require("../assets/noun-dice-1944263.png");


      })
      .catch((error) => {
        console.error(error);
        // Handle error
      });
  },
};
</script>