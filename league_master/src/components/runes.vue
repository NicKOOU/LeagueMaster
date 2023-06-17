<template>
    <div class="flex column align-center">
        <div class="container">
            <div class="primary-tree">
                <div class="primary-info">
                    <picture class="picture">
                        <img src="../assets/all/domination.png" alt="Domination" />
                    </picture>
                </div>
                <div class="primary1">
                    <picture class="picture">
                        <img src="../assets/all/8128.png" />
                    </picture>
                </div>
                <div class="primary2">
                    <picture class="picture">
                        <img src="../assets/all/8126.png" />
                    </picture>
                </div>
                <div class="primary3">
                    <picture class="picture">
                        <img src="../assets/all/8138.png" />
                    </picture>
                </div>
                <div class="primary4">
                    <picture class="picture">
                        <img src="../assets/all/8106.png" />
                    </picture>
                </div>
            </div>
            <div class="secondary-tree">
                <div class="secondary-info">
                    <picture class="picture">
                        <img src="../assets/all/precision.png" alt="Precision" />
                    </picture>
                </div>
                <div class="secondary1">
                    <picture class="picture">
                        <img src="../assets/all/8009.png" />
                    </picture>
                </div>
                <div class="secondary2">
                    <picture class="picture">
                        <img src="../assets/all/8014.png" />
                    </picture>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.primary-tree {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
}

.secondary-tree {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
}

.primary-info {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100px;
}

.secondary-info {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.primary1 {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.primary2 {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.primary3 {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.primary4 {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.secondary1 {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.secondary2 {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.picture {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
}
</style>

<script>
export default
    {
        name: 'RunePage',
    }
</script>