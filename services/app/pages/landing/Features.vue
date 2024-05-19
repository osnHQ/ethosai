<template>
    <div class="flex justify-center mt-10 font-poppins">
        <div class="bg-[#1d1b26] mx-4 mb-6 px-8 py-12 rounded-[50px] w-full max-w-md h-auto text-center text-white">
            <img src="public/Accuracy.png" alt="Accuracy" class="mx-auto mb-5 w-20">
            <h2 class="mt-8 mb-4 font-bold text-2xl">Accuracy</h2>
            <p class="font-light text-gray text-sm text-opacity-80 leading-8">Evaluate and validate language model
                responses for
                accuracy and bias with community-contributed prompts.</p>
        </div>

        <div class="bg-[#1d1b26] mx-4 mb-6 px-6 py-12 rounded-[50px] w-full max-w-md h-auto text-center text-white">
            <img src="public/Bias.png" alt="Bias" class="mx-auto mb-5 w-20">
            <h2 class="mt-8 mb-4 font-bold text-2xl">Bias-Free</h2>
            <p class="font-light text-gray text-sm text-opacity-80 leading-8">Mitigate bias in language models by leveraging
                community-contributed evaluations and feedback.</p>
        </div>
    </div>

    <Framework />

    <div class="flex mx-auto mt-10 w-full max-w-screen-lg h-[508px]">
        <div class="flex-1 p-5 overflow-y-auto">
            <div class="mb-6 font-semibold text-3xl text-left text-white leading-tight">OpenQAs Scoring Engine</div>
            <p class="mb-6 font-light text-gray text-left text-sm text-opacity-80 leading-7">Our state-of-the-art Scoring
                Engine precisely measures the deviation between the AI-generated output and the ideal expected output.
                This distance-based method quantifies the accuracy of the AI response, ensuring a rigorous evaluation
                standard.</p>

            <div class="flex items-start mt-8 h-25 text-left">
                <div class="relative mb-6 w-25 h-auto">
                    <img src="public/Precision.png" alt="Precision" class="w-25 h-auto object-cover">
                    <img src="public/clock.png" alt="Clock image"
                        class="top-1/2 left-1/2 absolute p-2 w-15 h-auto transform -translate-x-1/2 -translate-y-1/2">
                </div>
                <div class="ml-4">
                    <h2 class="mb-2 text-lg">Precision</h2>
                    <p class="font-light text-gray text-justify text-sm text-opacity-80">Accurately pinpoints discrepancies to
                        ensure each response meets the highest quality standards.</p>
                </div> 
            </div>

            <div class="flex items-start mt-8 h-25 text-left">
                <div class="relative mb-6 w-25 h-auto">
                    <img src="public/Precision.png" alt="Precision" class="w-25 h-auto object-cover">
                    <img src="public/Cross.png" alt="Cross image"
                        class="top-1/2 left-1/2 absolute p-2 w-15 h-auto transform -translate-x-1/2 -translate-y-1/2">
                </div>
                <div class="ml-4">
                    <h2 class="mb-2 text-lg">Reliability</h2>
                    <p class="font-light text-gray text-justify text-sm text-opacity-80">Consistent and dependable scoring that
                        users can trust for evaluating AI outputs.</p>
                </div>
            </div>
        </div>
        <div class="flex justify-end items-center p-5">
            <img src="public/ScoringEngine.png" alt="Description of the image"
                class="max-w-full max-h-full object-contain">
        </div>
    </div>

    <div class="flex mx-auto mt-10 w-full max-w-screen-lg h-[508px]">
        <div class="flex justify-end items-center p-5">
            <img src="public/ScoringEngine2.png" alt="ScoringEngine2" class="ml-8 max-w-full max-h-full object-contain">
        </div>
        <div class="flex-1 ml-10 p-5 overflow-y-auto">
            <div class="flex items-start mt-8 h-30">
                <div class="relative mb-6 w-auto h-auto">
                    <img src="public/Precision.png" alt="Precision" class="mt-6 w-15 h-auto object-cover">
                    <img src="public/clock.png" alt="Clock image"
                        class="top-1/2 left-1/2 absolute w-12 h-auto transform -translate-x-1/2 -translate-y-1/2">
                </div>
                <div class="ml-4">
                    <h2 class="text-lg">Bias Free Testing</h2>
                    <p class="font-light text-justify text-sm text-opacity-80">Our scalable framework allows for
                        continuous auditing of large language models by evaluating the accuracy and bias of their
                        responses using community-contributed prompts and evaluations.</p>
                </div>
            </div>

            <div class="flex items-start mt-8 h-30">
                <div class="relative mb-6 w-auto h-auto">
                    <img src="public/Precision.png" alt="Precision" class="mt-6 w-15 h-auto object-cover">
                    <img src="public/Cross.png" alt="Cross image"
                        class="top-1/2 left-1/2 absolute w-12 h-auto transform -translate-x-1/2 -translate-y-1/2">
                </div>
                <div class="ml-4">
                    <h2 class="text-lg">Accuracy Assurance</h2>
                    <p class="font-light text-justify text-sm text-opacity-80">Utilize sophisticated algorithms to
                        measure the 'distance' between the AI's response and the expected output. This rigorous
                        validation process guarantees that the AI models perform accurately and reliably.</p>
                </div>
            </div>

            <div class="flex items-start mt-8 h-30">
                <div class="relative mb-6 w-auto h-auto">
                    <img src="public/Precision.png" alt="Precision" class="mt-6 w-15 h-auto object-cover">
                    <img src="public/Cross.png" alt="Cross image"
                        class="top-1/2 left-1/2 absolute w-12 h-auto transform -translate-x-1/2 -translate-y-1/2">
                </div>
                <div class="ml-4">
                    <h2 class="text-lg">Tokenization</h2>
                    <p class="font-light text-justify text-sm text-opacity-80">Earn tokens and build your reputation
                        within our community by contributing to the platform through submitting, reviewing, and refining
                        prompts, as well as engaging in other activities.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Framework from "./Framework";
</script>