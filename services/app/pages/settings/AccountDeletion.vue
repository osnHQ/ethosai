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
        :class="{'text-blue-500 border-b-2 border-blue-500': activeLink === 'Account Deletion', 'text-gray-500': activeLink !== 'Account Deletion'}" class="text-sm md:mr-24 text-sm text-gray-500 font-semibold">Account Deletion</a>
      </div>

      

      <div class="border p-4">
        <div class="mb-8">
          <h1 class="font-bold text-2xl mb-4">Account Deletion</h1>
          <p class="text-base font-semibold">We are sad to see you go but totally understand there must be some reason. (which btw you can email us at founders@ethosai.one)</p>
        </div>

        <p class="text-gray-500 text-sm font-semibold mb-4">Are you sure you want to delete your account?</p>

        <div class="mb-8">
          <a href="#" class="bg-red-600 px-4 py-1 text-white text-sm w-20 text-center inline-block rounded-sm mr-4">Yes</a>
          <a href="#" class="bg-blue-600 mt-4 md:mt-0 px-4 py-1 text-white text-sm text-center inline-block rounded-sm mr-4">Naah' man. I was kidding lol!</a>
        </div>

        <p class="text-sm font-semibold md:pr-20 mb-4">Before you delete your account, I want to say that I have always loved you from the bottom of my heart and never ever thought this day would ever come in our lives that we had to part ways just like that but now that you have decided to go, I will say few last things to you: </p>

        <label class="font-medium text-sm block mb-4">
            <input type="checkbox">
              You will always respect your parents, and remember them wherever they are!
        </label>

        <label class="font-medium text-sm block mb-4">
              <input type="checkbox">
                You will never ever pick someone else's pizza from their plate. It is just so cruel!
            </label>

        <label class="font-medium text-sm block mb-4">
          <input type="checkbox">
            Don't ever say that "The Friends" was just a comedy TV series. It was more than that - It was "Life"
        </label>
 
        <label class="font-medium text-sm block mb-4">
              <input type="checkbox">
                And also btw, one more thing....
            </label>

        <div>
          <a href="#" class="bg-red-600 px-4 py-1 text-white text-sm text-center inline-block rounded-sm mr-8">Shut up and let me go!</a>
          <a href="#" class="bg-blue-600 mt-4 md:mt-0 px-4 py-1 text-white text-sm text-center inline-block rounded-sm mr-4">On a second thought, I would say and hear more...</a>
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

