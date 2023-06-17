<template>
    <div class="container">
      <div class="block">
        <img src="../assets/League-of-Legends-Embleme.png" class="logo" alt="League Logo">
        <div class="lds-heart"><div></div></div>
        <p class="message">Waiting for League of Legends to start</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HeartAnimation',
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
  
  .block {
    position: relative;
    width: 400px;
    height: 300px;
    background-color: white;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .logo {
  display: block;
  margin: 0 auto;
  width: 80px;
  height: auto;
}

  
  .lds-heart {
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
  }
  
  .lds-heart div {
  position: absolute;
  top: 24px;
  left: 24px;
  width: 24px;
  height: 24px;
  background: #B20F12;
  animation: lds-heart 1.2s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
}

.lds-heart div:after,
.lds-heart div:before {
  content: " ";
  position: absolute;
  display: block;
  width: 24px;
  height: 24px;
  background: #B20F12;
}

  
  .lds-heart div:before {
    left: -18px;
    border-radius: 50% 0 0 50%;
  }
  
  .lds-heart div:after {
    top: -18px;
    border-radius: 50% 50% 0 0;
  }
  
  @keyframes lds-heart {
    0% {
      transform: scale(0.95);
    }
    5% {
      transform: scale(1.1);
    }
    39% {
      transform: scale(0.85);
    }
    45% {
      transform: scale(1);
    }
    60% {
      transform: scale(0.95);
    }
    100% {
      transform: scale(0.9);
    }
  }
  
  .message {
    font-size: 20px;
    color: #141336;
    font-weight: bold;
    text-align: center;
  }
  </style>
  