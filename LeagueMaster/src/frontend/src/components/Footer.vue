<template>
  <footer class="footer">
    <nav class="nav">
      <a href="#" class="nav-link">Terms of Service</a>
      <a href="#" class="nav-link">Privacy Policy</a>
      <a href="#" class="nav-link">FAQ</a>
    </nav>
    <p class="footer-text">© 2023 League Master. All rights reserved.</p>
  </footer>
</template>

<style scoped>
.footer {
  overflow-y: auto;
  background-color: white;
  padding: 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-radius: 20px;
  margin: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav {
  display: flex;
  justify-content: flex-start;
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

.footer-text {
  color: #141336;
  margin: 0;
  font-size: 16px;
  margin-left: auto;
  margin-right: 10px;
  font-family: Arial, Helvetica, sans-serif;
}

.nav-link:first-child {
  margin-left: 0;
}

.nav-link:last-child {
  margin-right: 0;
}
</style>

<script>
export default {
  name: "Footer_Section",
};
</script>
