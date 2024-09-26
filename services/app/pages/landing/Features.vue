<template>
    <div class="flex md:flex-row flex-col justify-center mt-10 pr-8 md:pl-8">
        <div class="bg-[#1d1b26] mx-4 mb-6 px-8 py-12 rounded-[50px] w-full max-w-md h-auto text-center text-white">
            <img src="/Accuracy.png" alt="Accuracy" class="mx-auto mb-5 w-20" />
            <h2 class="mt-8 mb-4 font-bold text-2xl">Accuracy</h2>
            <p class="font-light text-gray text-sm text-opacity-80 leading-8">Evaluate and validate language model
                responses for
                accuracy and bias with community-contributed reviewed evals.</p>
        </div>

        <div class="bg-[#1d1b26] mx-4 mb-6 px-6 py-12 rounded-[50px] w-full max-w-md h-auto text-center text-white">
            <img src="/Bias.png" alt="Bias" class="mx-auto mb-5 w-20" />
            <h2 class="mt-8 mb-4 font-bold text-2xl">Bias-Free</h2>
            <p class="font-light text-gray text-sm text-opacity-80 leading-8">Mitigate bias in language models by leveraging
                reviewed and vetted evaluations and feedback.</p>
        </div>
    </div>

    <Framework />

</template>

<script setup>
import Framework from "./Framework";
</script>