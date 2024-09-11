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
          <a href="#" @click.prevent="setActive('General')"
          :class="{'text-blue-500 border-b-2 border-blue-500': activeLink === 'General', 'text-gray-500': activeLink !== 'General'}" class="text-sm md:ml-8 mr-4 md:mr-24 text-sm text-gray-500 font-semibold">General</a>

          <a href="#" @click.prevent="setActive('Security')"
          :class="{'text-blue-500 border-b-2 border-blue-500': activeLink === 'Security', 'text-gray-500': activeLink !== 'Security'}" class="text-sm mr-4 md:mr-24 text-sm text-gray-500 font-semibold">Security</a>

          <a href="#" @click.prevent="setActive('Notifications')"
          :class="{'text-blue-500 border-b-2 border-blue-500': activeLink === 'Notifications', 'text-gray-500': activeLink !== 'Notifications'}" class="text-sm mr-4 md:mr-24 text-sm text-gray-500 font-semibold">Notifications</a>

          <a href="#" @click.prevent="setActive('Account Deletion')"
          :class="{'text-blue-500 border-b-2 border-blue-500': activeLink === 'Account Deletion', 'text-gray-500': activeLink !== 'Account Deletion'}" class="text-sm md:mr-20 text-sm text-gray-500 font-semibold">Account Deletion</a>
        </div>

        

        <div class="border p-4 md:pr-18">
          <h1 class="font-bold text-2xl mb-2">General</h1>
          <div class="flex flex-col md:flex-row mb-4">

            <div class="mr-4 w-full md:w-3/6 mb-2 md:mb-0">
              <b class="text-gray-700 text-sm">Full name</b>
              <input
                      class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-light" placeholder="Your full name" type="text" />
            </div>
            <div class="w-full mb-2 md:mb-0 md:w-3/6">
              <b class="text-gray-700 text-sm">Username</b>
              <input
                      class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-light" placeholder="Your user name" type="text" />
            </div>
          </div>

          <div class="mb-4">
            <b class="text-gray-700 text-sm block">Profession</b>
            <select class="w-full text-gray-500 border-none outline-none h-9 rounded flex items-center justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-light">
              <option value="" disabled selected hidden>-Select your title-</option>
            </select>
          </div>

          <div class="mb-4">
            <b class="text-gray-700 text-sm block">Location</b>
            <select class="w-full text-gray-500 border-none outline-none h-9 rounded flex items-center justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-light">
              <option value="" disabled selected hidden>-Select your location-</option>
            </select>
          </div>

          <div class="mb-4">
            <b class="text-gray-700 text-sm block">Bio</b>
            <input
                class="w-full self-stretch h-[35px] rounded px-3 box-border py-8 font-inter text-sm text-silver min-w-[110px] text-black bg-light"
                placeholder="Input text" type="text" />
          </div>

          <div class="mb-8">
            <b class="text-gray-700 text-sm block mb-2">Social Media</b>
            <div class="flex mb-2">
              <img class="w-10 md:w-8 mr-2" src="/instagram.png" alt="instagram icon">
              <button class="bg-red text-xs md:w-1/6 rounded-sm text-white mr-2">Connect your Instagram</button>
              <input class="border text-xs w-3/5" placeholder="...or paste your handle here" type="text">
            </div>
            <div class="flex mb-2">
              <img class="w-10 md:w-8 mr-2" src="/twitter1.png" alt="twitter icon">
              <button class="bg-black text-xs md:w-1/6 rounded-sm text-white mr-2">Connect your Twitter</button>
              <input class="border text-xs w-3/5" placeholder="...or paste your handle here" type="text">
            </div>
            <div class="flex mb-2">
              <img class="w-10 md:w-8 mr-2" src="/discord.png" alt="discord icon">
              <button class="bg-blue-500 text-xs md:w-1/6 rounded-sm text-white mr-2">Connect your Discord</button>
              <input class="border text-xs w-3/5" placeholder="...or paste your handle here" type="text">
            </div>
            <div class="flex">
              <img class="w-10 md:w-8 mr-2" src="/linkedin1.png" alt="twitter icon">
              <button class="bg-sky text-xs md:w-1/6 rounded-sm text-white mr-2">Connect your Linkedin</button>
              <input class="border text-xs w-3/5" placeholder="...or paste your handle here" type="text">
            </div>
          </div>
          <div class="grid place-content-center">

            <button class="cursor-pointer [border:none] py-[7px] px-3  bg-cyan-500 rounded overflow-hidden flex flex-row items-start justify-start whitespace-nowrap relative text-sm leading-[22px] font-inter text-white text-left inline-block">Save information</button>
          </div>
        </div>
      </div>
    </div>
    
  </template>

<script setup>
import { ref } from 'vue';

// Define a reactive reference for the active link
const activeLink = ref('General'); // Default active link

// Define a method to set the active link
const setActive = (link) => {
  activeLink.value = link;
};
</script>

  

  