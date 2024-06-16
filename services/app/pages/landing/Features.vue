<template>
    <div class="flex md:flex-row flex-col justify-center mt-10 pr-8 md:pl-8">
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

    <!-- OpenQA scoring engine component -->

    <div class="flex flex-col-reverse lg:flex-row mx-auto mt-10 w-full max-w-screen-lg h-auto lg:h-[508px]">
    <div class="flex justify-center items-center p-5 lg:order-2">
        <img src="public/flowchart3.png" alt="Flowchart" class="max-w-full max-h-full object-contain lg:w-2/2 lg:h-auto w-full">
    </div>
    <div class="flex-1 p-5 overflow-y-auto lg:order-1">
        <div class="mb-6 font-semibold text-3xl text-left text-white leading-tight">Ecosystem Flow</div>
        <ul class="list-disc pl-5 pt-5 text-xl text-justify text-gray-300">
        <li class="mb-2 py-3"><b>Decentralized Power</b>: Leverage the collective intelligence of a global network to identify and address issues in AI systems.</li>
        <li class="mb-2 py-3"><b>Community Insights</b>: Contribute your expertise and help shape the future of responsible AI development.</li>
        <li class="mb-2 py-3"><b>zk-Rollup Technology</b>: Ensure secure and efficient data processing while protecting user privacy.</li>
        <li class="mb-2 py-3"><b>Continuous Improvement</b>: Network insights are constantly fed back into the system, leading to a continuously evolving database of AI knowledge.</li>
    </ul>
    </div>
</div>


    <!-- Second component with image on left -->


    <div class="flex flex-col lg:flex-row mx-auto mt-10 w-full max-w-screen-lg h-auto lg:h-[508px]">
    <div class="flex-1 p-5 overflow-y-auto lg:order-2 lg:w-1/2">
        <div class="mb-6 font-semibold text-3xl text-left text-white leading-tight">Token Allocation for LLM Audits</div>
        <ul class="list-disc pl-5 pt-5 text-xl text-justify text-gray-300">
        <li class="mb-2 py-3">60% of tokens are allocated to the Creators for ethosAI Evals ( configuration files ), incentivizing users to contribute evaluations of  LLM audits.</li>
        <li class="mb-2 py-3">30% of tokens are allocated to the EAI LLM DePIN infrastructure.</li>
        <li class="mb-2 py-3">10% of tokens are allocated to the auditor staking pool, rewarding those who stake their tokens to support Evals reviews.</li>
    </ul>
    </div>
    <div class="flex justify-center items-center p-5 lg:order-1 lg:w-1/2">
        <img src="public/flowchart2.png" alt="flowchart" class="max-w-full max-h-full object-contain lg:w-2/2 lg:h-auto w-full">
    </div>
</div>

<div class="flex flex-col-reverse lg:flex-row mx-auto mt-10 w-full max-w-screen-lg h-auto lg:h-[508px]">
    <div class="flex justify-center items-center p-5 lg:order-2">
        <img src="public/flowchart1.png" alt="Flowchart" class="max-w-full max-h-full object-contain lg:w-2/2 lg:h-auto w-full">
    </div>
    <div class="flex-1 p-5 overflow-y-auto lg:order-1">
        <div class="mb-6 font-semibold text-3xl text-left text-white leading-tight">EAI Token Flow</div>
        <ul class="list-disc pl-5 pt-5 text-xl text-justify text-gray-300">
        <li class="mb-2 py-3">The EAI token is used to incentivize participation in the EthosAI platform.</li>
        <li class="mb-2 py-3">Community members submit LLM evaluation config files in exchange for EAI tokens.</li>
        <li class="mb-2 py-3">A committee of reviewers approves these contributions, which are then incorporated into the EAI Scorecard and EAI DePIN LLM, further improving the LLM auditing process.</li>
    </ul>
    </div>
</div>

</template>

<script setup>
import Framework from "./Framework";
</script>