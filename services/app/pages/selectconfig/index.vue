<template>
    <div>
        <SelectConfig />
    </div>
</template>

<script setup>
import SelectConfig from "./selectconfig.vue"

const color = useColorMode()
color.value === 'light'
color.preference = 'light'

</script>