<template>
    <div>
      <Results />
    </div>
  </template>
  
  <script setup>
  import Results from "./results.vue";
  const color = useColorMode();
  color.value === "light";
  color.preference = "light";
  </script>
  