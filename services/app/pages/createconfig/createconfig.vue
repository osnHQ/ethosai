<template>
  <div
    class="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="container mx-auto px-6 py-12">
      <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
        <div class="px-8 py-10">
          <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
            Create a New Configuration
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Provide a new configuration file by entering "Prompt" and "Ideal Output" below.
          </p>

          <div class="space-y-10">

            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <button
                class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out">
                <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                Upload a Config File
              </button>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                <p>JSON, CSV, or TXT supported</p>
                <a href="#"
                  class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline">Download
                  Example JSON Format</a>
              </div>
            </div>


            <div>
              <label for="config-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name of Configuration File
              </label>
              <input id="config-name" type="text"
                class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Enter a recognizable name" />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Enter a name that can be easily recognized by the community.
              </p>
            </div>


            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select a Category
              </label>
              <select id="category"
                class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50 dark:bg-gray-700 transition duration-150 ease-in-out">
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
              </select>
            </div>


            <div>
              <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter Relevant Tags
              </label>
              <div class="mt-1 flex rounded-lg shadow-sm">
                <input id="tags" type="text"
                  class="flex-grow focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-l-lg sm:text-sm border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 transition duration-150 ease-in-out"
                  placeholder="Add a tag" />

              </div>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                  CapitalCities
                </span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                  London
                </span>

              </div>
            </div>


            <div>
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                Questions & Eval Instructions
                <span
                  class="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">Required</span>
              </h2>
              <div class="space-y-6">

                <div class="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Q1. What is the capital of India?
                  </label>
                  <input type="text"
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 transition duration-150 ease-in-out"
                    placeholder="New Delhi" />
                </div>

              </div>
              <div class="mt-6 flex flex-wrap gap-4">
                <button
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                  <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add More Q&A
                </button>
                <button
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                  <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                    </path>
                  </svg>
                  Remove / Edit Q&A
                </button>
              </div>
            </div>


            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detailed Description / Notes
              </label>
              <textarea id="description" rows="4"
                class="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Add detailed instructions, notes, or descriptions here..."></textarea>
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                This section can be used to provide any additional information or guidelines.
              </p>
            </div>
          </div>


          <div class="mt-8 flex justify-end space-x-3">
            <button
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
              Cancel
            </button>
            <button
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
