<template>
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
    </div>
  </div>
</template>
  
  <style scoped>a
  .card {
  width: 400px;
  height: 600px; /* Increase the height to make the card taller */
  background: rgb(114, 98, 4);
  transition: all 0.4s;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.705);
  font-size: 30px;
  font-weight: 900;
}

  .image--cover {
  width: 100px;
  height: 70px;
  border-radius: 50%;

  object-fit: cover;
  object-position: center;;
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
    transition: all 0.4s;
    font-size: 0px;
    transform: rotate(90deg) scale(-1);
  }
  
  .card:hover .second-content {
    opacity: 1;
    height: 100%;
    font-size: 1.8rem;
    transform: rotate(0deg);
  }
  </style>
  
  <script>
  export default {
    name: "CardView",
    data() {
      return {
        summonerName: "",
        summonerLevel: "",
        imageSrc: "",
      };
    },
    created() {
      fetch("http://localhost:3000/api/current-summoner")
        .then((response) => response.json())
        .then((data) => {
          this.summonerName = data.displayName;
          this.summonerLevel = data.summonerLevel;
        })
        .catch((error) => {
          console.error(error);
          // Handle error
        });
    },
  };
  </script>