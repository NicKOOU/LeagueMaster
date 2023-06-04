<template>
  <div>
    <h1>Loading...</h1>
  </div>
</template>

<script>
export default {
  mounted() {
    fetch('http://localhost:3000/api/login')
      .then(response => response.json())
      .then(data => {
        if (data.message === 'LCU login successful') {
          this.$router.push('/session');
        } else {
          console.log('Login unsuccessful:', data.message);
        }
      })
      .catch(error => {
        console.error('Error occurred while logging in:', error);
      });
  },
};
</script>
