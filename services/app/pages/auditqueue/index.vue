<template>
    <div>
        <AuditQueue />
    </div>
</template>

<script setup>
import AuditQueue from "./AuditQueue.vue"
const color = useColorMode()
color.value === 'light'
color.preference = 'light'

</script>