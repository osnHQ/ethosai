<template>
  <div>
    <AuditQueue />
  </div>
</template>

<script setup>
import AuditQueue from "./auditqueue.vue";
const color = useColorMode();
color.value === "light";
color.preference = "light";
</script>
