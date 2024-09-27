<template>
  <div class="flex flex-col md:flex-row mt-4 ml-10 md:ml-4">
    <div class="w-full md:w-1/4 mb-4 md:mb-0">
      <h1 class="font-bold text-2xl mb-8 md:mb-14">Account Settings</h1>

      <div class="flex flex-col items-center border max-w-xs p-6">
        <div class="w-20">
          <img src="/avatar31.png" alt="Avatar">
        </div>
        <p class="text-sky-400 font-bold">Jay Rutherford</p>
        <p class="text-xs mb-4">Professional title</p>
        <p class="text-xs text-gray-400 text-center mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <hr class="border-gray-200 w-full mb-4">
        <div class="flex flex-col items-start">
          <p class="font-semibold text-xs mb-1">Profile link</p>
          <div class="flex items-center bg-gray-100 px-2 py-1">
            <a href="#" class="text-xs font-extralight font-semibold mr-4">https://www.profilelink.com</a>
            <img class="w-4" src="/copypaste.png" alt="copy paste">  
          </div>
        </div>
      </div>
    </div>

    <div class="ml-6 md:ml-8 w-3/4 md:mr-8 mt-2">
  
      <div class="mb-8 md:mb-14 flex flex-nowrap md:ml-2">
        <a
      v-for="(tab, index) in tabs" :key="index" href="#" @click.prevent="setActive(tab)" :class="{
        'text-blue-500 border-b-2 border-blue-500': activeLink === tab,
        'text-gray-500': activeLink !== tab
      }"
      class="text-sm mr-4 md:mr-24 text-gray-500 font-semibold">
      {{ tab }}
    </a>
      </div>

      

      <div class="border p-4">
        <div class="mb-8">
          <h1 class="font-bold text-2xl mb-4">Notification</h1>
          <p class="text-sm font-semibold">We may still send you important notifications about your account outside of your notification settings.</p>
        </div>

        <div class="flex flex-col md:flex-row justify-between mb-8">
          <div>
            <p class="font-bold text-lg">Notification from us</p>
            <p class="text-sm text-gray-500 font-semibold mb-2">Notification from Ethos AI team</p>
          </div>

          <div class="md:pr-14">
            <label class="font-semibold text-sm">
              <input type="checkbox">
                News and Updates
            </label>
            <p class="text-gray-500 text-xs mb-4">New AI LLM added of Eval added</p>

            <label class="font-semibold text-sm block mb-2">
              <input type="checkbox">
                Tips and tutorials
            </label>

            <label class="font-semibold text-sm">
              <input type="checkbox">
                Feature updates on Eval AI
            </label>

          </div>
        </div>

        <hr class="mb-4">

        <div class="flex flex-col md:flex-row justify-between">
          <div>
            <p class="font-bold text-lg mb-2">Transactions</p>
            <p class="text-sm text-gray-500 max-w-sm mb-2">There are notifications for updates on the transactions done by you. (e.g Staking requests, EAI purchases, Rewards, Requests / Applications etc.)</p>
          </div>

          <div>
            <label class="block font-semibold text-sm mb-4">
              <input type="radio" name="subscription" value="none">
              Do not notify me
            </label>

            <label class="block font-semibold text-sm mb-4">
              <input type="radio" name="subscription" value="all">
              Notify for all
            </label>

            <label class="block font-semibold text-sm mb-4">
              <input type="radio" name="subscription" value="approval-only">
              Notify for only approval of requests
            </label>

          </div>
        </div>
        
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref } from 'vue';


const activeLink = ref('Notifications'); 
const tabs = ['General', 'Security', 'Notifications', 'Account Deletion'];

const setActive = (link) => {
activeLink.value = link;
};
</script>

