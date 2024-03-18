<template>
    <div :style="{ width: width, margin: '20px auto' }" class="container">
        <el-page-header @back="goBack" :content="content" :style="{ color: color }"></el-page-header>
    </div>
</template>
<script setup lang="ts">
import { defineEmits } from 'vue';
defineProps({ color: String, content: String, width: String });
const emit = defineEmits(['back']);
const goBack = () => { window.history.go(-1); }
</script>