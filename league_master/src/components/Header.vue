<template>
  <header class="header">
    <div class="logo-container">
      <img src="../assets/LeagueMasterLogo.png" class="logo" alt="Logo">
    </div>
    <nav class="nav">
      <a href="#" class="nav-link">Home</a>
      <a href="#" class="nav-link">About</a>
      <a href="#" class="nav-link">Contact</a>
    </nav>
    <nav class="nav">
      <a href="#" class="nav-link nav-icon-link">
        <img src="../assets/github_icon.svg" alt="GitHub" class="nav-icon-img">
      </a>
      <a href="#" class="nav-link nav-icon-link">
        <img src="../assets/twitter_icon.svg" alt="Twitter" class="nav-icon-img">
      </a>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  width: 100%;
  background-color: white;
  padding: 5px;
  display: flex;
  justify-content: space-between;
  z-index: 999;
  border-radius: 20px;
  margin: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  width: 100px;
  height: auto;
}

.nav {
  display: flex;
  align-items: center;
}

.nav-link {
  color: #141336;
  text-decoration: none;
  margin: 0 10px;
  padding: 8px 16px;
  background-color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 20px;
}

.nav-link:hover {
  background-color: white;
}

.nav-link:focus {
  outline: none;
}

.nav-icon-link {
  margin-left: 10px; /* Add margin to create spacing between icons */
  display: flex;
  align-items: center;
}

.nav-icon-img {
  width: 30px;
  height: 30px;
  vertical-align: middle;
}

.nav-icon-img:hover {
  filter: brightness(0.8); /* Add hover effect to the icons */
}
</style>

<script>
export default {
  name: "HeaderSection",
};
</script>
