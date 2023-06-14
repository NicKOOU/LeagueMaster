<template>
    <div class="container">
        <div id="progress" class="skills html"></div>
    </div>
</template>

<style scoped>
/* Make sure that padding behaves as expected */
* {
    box-sizing: border-box
}

/* Container for skill bars */
.container {
    margin-top: 10px;
    width: 80%;
    /* Full width */
    background-color: #ddd;
    /* Grey background */
}

.skills {
    text-align: right;
    /* Right-align text */
    padding-top: 10px;
    /* Add top padding */
    padding-bottom: 10px;
    /* Add bottom padding */
    color: white;
    /* White text color */
}

.html {
    width: 90%;
    background-color: #04AA6D;
}
</style>

<script>

export default {
    name: 'XpSection',
    data() {
        return {
            percentage: 0
        }
    },
    created() {
    fetch("http://localhost:3000/api/current-summoner")
        .then((response) => response.json())
        .then((data) => {
            this.percentage = data.percentCompleteForNextLevel;
            var element = document.getElementsByClassName("html")[0];
            element.style.width = this.percentage + '%';
        })
        .catch((error) => {
            console.error(error);
        });
}

}
</script>