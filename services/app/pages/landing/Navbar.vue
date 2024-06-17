<template>
  <div class="container h-20 relative max-md:mb-10">
    <!-- logo fixed with position -->

    <a class="
    max-md-hidden
    absolute left-10 top-12" href="https://openqa.ai/">
      <img src="public/logo.png" class="w-35" alt="ethosAI Logo">
    </a>

    <!-- for mobile device -->
     <div class="flex justify-center items-center md:hidden mt-5">
      <a href="https://openqa.ai/">
      <img src="public/logo.png" class="w-35" alt="ethosAI Logo">
    </a>
     </div>
    
    <div class="flex max-md:justify-center lg:ml-140 max-md:ml-0 max-lg:justify-center max-lg:ml-18 px-1 py-10">

      <nav class="space-x-8 border-white px-2 py-4 md-px-8 md-py-4 border rounded-full max-w-3xl text-light">
        <NuxtLink to="/" class="hover:text-gray">Home</NuxtLink>
        <NuxtLink to="https://ethos-ai.gitbook.io/ethosai-whitepaper" class="hover:text-gray">Whitepaper
        </NuxtLink>
        <!-- <NuxtLink to="/" class="hover:text-gray">Blog</NuxtLink> -->
        <NuxtLink to="https://www.linkedin.com/company/ethosaione/jobs/" class="hover:text-gray">Careers</NuxtLink>
        <NuxtLink to="mailto: contactethosai@gmail.com" class="hover:text-gray">Contact</NuxtLink>
      </nav>
    </div>
  </div>
</template>