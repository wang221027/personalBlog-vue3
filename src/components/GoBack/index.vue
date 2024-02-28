<template>
    <div :style="{ width: props.width, margin: '20px auto' }" class="container">
        <el-page-header @back="goBack" :content="props.content" :style="{ color: props.color }"></el-page-header>
    </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
const props = defineProps({ color: String, content: String, width: String });
const emit = defineEmits(['back']);
const goBack = () => { window.history.go(-1); }
</script>