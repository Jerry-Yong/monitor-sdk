
<script setup lang="ts">
import { onMounted, } from "vue";
import { initMonitor } from "./index";


const init = () => {
    const sdk = initMonitor({
        logType: "fsadf",
    });

    // 自定义事件上报
    // sdk.track("button_click", { btnId: 'submit' });
}

onMounted(() => {
    init();
})
</script>

<template>
    <h2>app.page</h2>
</template>

<style scoped>

</style>
