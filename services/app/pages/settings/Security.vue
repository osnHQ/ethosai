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

      

      <div class="border p-4 md:pr-18">
        <h1 class="font-bold text-2xl mb-2">Security</h1>
        <div class="flex flex-col md:flex-row mb-4">

          <div class="mr-4 w-full md:w-3/6 mb-2 md:mb-0">
            <b class="text-gray-700 text-sm">Current Password</b>
            <input
                    class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-light" placeholder="**********" type="password" />
          </div>
          <div class="w-full mb-2 md:mb-0 md:w-3/6">
            <b class="text-gray-700 text-sm">Confirm Current Password</b>
            <input
                    class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-light" placeholder="**********" type="password" />
          </div>
        </div>

        <div class="flex flex-col md:flex-row mb-4">

          <div class="mr-4 w-full md:w-3/6 mb-2 md:mb-0">
            <b class="text-gray-700 text-sm">Set New Password</b>
            <input
                    class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-light" placeholder="**********" type="password" />
          </div>
          <div class="w-full mb-2 md:mb-0 md:w-3/6">
            <b class="text-gray-700 text-sm">Confirm New Password</b>
            <input
                    class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-light" placeholder="**********" type="password" />
          </div>
        </div>

        <div class="mb-8">
          <b class="text-gray-700 text-sm mb-2">Set Up Two-Factor Authentication</b>
          <p class="text-xs text-gray-400 mb-2 font-medium">Set up two-factor authentication. You must set up two-factor authentication to continue sign-in. Use your authenticator app(such as microsoft authenticator or google authenticator) to scan the QR code below.</p>
          <img class="w-40 mb-2" src="/qr.png" alt="qr icon">
          <p class="text-sm">Status : <span class="text-sm text-blue font-medium">Connected</span></p>
        </div>

        <div class="grid place-content-center">

          <button class="cursor-pointer [border:none] py-[7px] px-3  bg-cyan-500 rounded overflow-hidden flex flex-row items-start justify-start whitespace-nowrap relative text-sm leading-[22px] font-inter text-white text-left inline-block">Update Password</button>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script setup>
import { ref } from 'vue';


const activeLink = ref('Security'); 
const tabs = ['General', 'Security', 'Notifications', 'Account Deletion'];

const setActive = (link) => {
activeLink.value = link;
};
</script>

