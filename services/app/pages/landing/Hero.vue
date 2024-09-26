<template>
    <div class="lg:h-[80vh] sm:h-auto lg:flex lg:flex-row lg:items-center lg:justify-between">

        
        <div class="max-md-w-full sm:w-full lg:w-1/2 md:ml-10">

            <div class="max-md-text-center sm:text-center lg:text-left pt-12 pb-12 max-w-4xl font-bold max-md-text-4xl md:text-3xl lg:text-6xl">
                World's first <br> AI Audit Network
            </div>

            <div class="max-md-text-center sm:text-center lg:text-left text-gray-400 text-md md:text-lg">
                AI is reshaping our world, but its development happens in secret. EthosAI creates an open network to test AI systems, with a mission to make AI fair and trustworthy for all.
            </div>

            <div class="flex lg:justify-start max-md-justify-center sm:justify-center">
                <a href="https://ethos-ai.gitbook.io/ethosai-whitepaper" class="flex justify-center my-8 lg:mr-5">
                    <button
                        class="bg-transparent hover:bg-gray-100 mr-4 px-6 py-3 border border-light rounded font-bold text-gray-800 text-light hover:text-dark">
                        Whitepaper
                    </button>
                </a>
                <a href="https://tally.so/r/nGrMK2" class="flex justify-center my-8">
                    <button
                        class="bg-dark hover:bg-gray-100 px-6 py-3 border border-light rounded font-bold text-gray-800 text-light hover:text-dark">
                        Join Waitlist
                    </button>
                </a>
            </div>



        </div>


<!-- 
        <div class="max-w-lg max-md-hidden sm:hidden w-1/2 lg:flex items-center justify-center">
            <img src="/Hero Image.png" alt="" />
        </div> -->
        <div class="max-w-lg max-md-hidden sm:hidden w-1/2 lg:flex items-center justify-left mr-10 mt-20">
    <LottieAnimation :animationData="animationData" :width="'90%'" :height="'100%'" />
  </div>

    </div>
</template>

<script>
import LottieAnimation from '/components/LottieAnimation.vue'; // Adjust the path as needed
import animationData from 'public/animations/lottie.json' // Adjust the path as needed

export default {
  components: {
    LottieAnimation
  },
  data() {
    return {
      animationData
    };
  }
};
</script>
