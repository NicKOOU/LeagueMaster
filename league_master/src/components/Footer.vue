<template>
  <footer class="footer">
    <nav class="nav">
      <a href="#" class="nav-link">Terms of Service</a>
      <a href="#" class="nav-link">Privacy Policy</a>
      <a href="#" class="nav-link">FAQ</a>
    </nav>
    <p class="footer-text">&copy; 2023 League Master. All rights reserved.</p>
  </footer>
</template>

<style scoped>
.footer {
  background-color: white;
  padding: 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav {
  display: flex;
  justify-content: center;
}

.nav-link {
  color: black;
  text-decoration: none;
  margin: 0 10px;
}

.footer-text {
  color: black;
  margin: 0;
}
</style>



<script>
export default {
  name: "Footer_Section",
};
</script>