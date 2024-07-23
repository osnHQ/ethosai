<template>
    <div>
        <SelectConfig />
    </div>
</template>

<script setup>
import SelectConfig from "./SelectConfig.vue"

const color = useColorMode()
color.value === 'light'
color.preference = 'light'

</script>