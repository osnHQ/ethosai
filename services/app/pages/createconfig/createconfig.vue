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
            <div class="w-full flex flex-col items-start justify-start pt-0 px-0 gap-1">
              <b class="text-[#424955]">Name of Configuration File</b>
              <div class="w-full flex flex-row items-start justify-start pt-1 pb-1.5 text-silver">
                <input class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]" placeholder="Input text" type="text"/>
              </div>
            </div>
            <div class="w-full flex flex-row items-start justify-start pt-0 px-0 pb-4 text-dimgray">
              <div class="flex-1 text-[#565E6C]">Enter a name that can be easily recognizable by community. e.g. Capital cities of the world, Famous oscar winners of 1990s, Best Cars of 20th century etc.</div>
            </div>
            <div class="w-[323px] flex flex-col items-start justify-start pt-0 px-0 pb-2.5 gap-1">
              <b class="text-[#424955]">Select a category</b>
              <div class="w-full flex flex-row items-start justify-between pt-1 pb-1.5 pr-3 gap-5">
                <select class="text-[#969aa1] bg-[#F3F4F6] border rounded py-2 px-2 w-full">
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="technology">Technology</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
            </div>
            <div class="w-[1036px] flex flex-col items-start justify-start pt-0 px-0 pb-4 gap-8">
              <div class="w-[1010px] flex flex-col items-start justify-start gap-1">
                <b class="text-[#424955]">Enter relevant tags</b>
                <div class="w-full flex flex-col items-start justify-start gap-10 text-gray-200 mq450:gap-5">
                  <div class="w-full flex flex-row flex-wrap items-start justify-start gap-1">
                    <input class="w-[312px] border-none outline-none text-black bg-[#F3F4F6] h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm max-w-full" placeholder="Input text" type="text"/>
                    <div class="flex-1 flex flex-row items-start text-[#34270D] justify-start gap-1 min-w-[333px] max-w-full mq450:flex-wrap">
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">CapitalCities</div>
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">London</div>
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">Athens of Greece</div>
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">Google Gemini Capitals</div>
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">Llama Capital Cities</div>
                    </div>
                  </div>
                  <div class="w-[680px] flex flex-row flex-wrap items-start justify-start gap-12 text-lg text-gray-400 mq450:gap-7">
                    <b class="flex-1 text-[#171A1F] mq450:min-w-full">Questions & Eval instructions / Answers for the Prompt Eval File</b>
                    <div class="flex flex-col items-start mt-1 justify-start pt-px px-0 pb-0">
                      <img class="w-5" loading="lazy" alt="" src="public/info.png"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full flex flex-col items-start justify-start gap-4">
                <div class="w-full flex flex-row flex-wrap items-start justify-start gap-7">
                  <div class="w-[323px] flex flex-col items-start justify-start gap-1">
                    <b class="text-[#424955]">Q1. What is the capital of India</b>
                    <input class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]" placeholder="New Delhi" type="text"/>
                  </div>
                  <div class="flex-1 flex flex-col items-start justify-start py-0 pr-3 pl-0 gap-1 min-w-[218px]">
                    <b class="text-[#424955]">Q2. What is the capital of Greece</b>
                    <input class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]" placeholder="Athens" type="text"/>
                  </div>
                  <div class="w-[323px] flex flex-col items-start justify-start gap-1">
                    <b class="text-[#424955]">Q3. What is the capital of Pakistan</b>
                    <input class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]" placeholder="Islamabad" type="text"/>
                  </div>
                </div>
                <div class="w-full flex flex-row flex-wrap items-start justify-start gap-7">
                  <div class="w-[323px] flex flex-col items-start justify-start gap-4">
                    <div class="w-full flex flex-col items-start justify-start gap-1">
                      <b class="text-[#424955]">Q4. What is the capital of USA</b>
                      <input class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]" placeholder="New York" type="text"/>
                    </div>
                    <div class="w-full flex flex-col items-start justify-start gap-1">
                      <b class="text-[#424955]">Q7. What is the capital of Sex City</b>
                      <input class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]" placeholder="We don't appreciate profanity please" type="text"/>
                    </div>
                  </div>
                  <div class="flex-1 flex flex-col items-start justify-start py-0 pr-3 pl-0 gap-4 min-w-[218px]">
                    <div class="w-full flex flex-col items-start justify-start gap-1">
                      <b class="text-[#424955]">Q5. What is the capital of Japan</b>
                      <input class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]" placeholder="Tokyo" type="text"/>
                    </div>
                    <div class="w-full flex flex-col items-start justify-start gap-1">
                      <b class="text-[#424955]">Q8. What is the capital of UK</b>
                      <input class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]" placeholder="London" type="text"/>
                    </div>
                  </div>
                  <div class="w-[323px] flex flex-col items-start justify-start gap-4">
                    <div class="w-full flex flex-col items-start justify-start gap-1">
                      <b class="text-[#424955]">Q6. What is the capital of Hogwarts</b>
                      <input class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]" placeholder="No such country exists" type="text"/>
                    </div>
                    <div class="w-full flex flex-col items-start justify-start gap-1">
                      <b class="text-[#424955]">Q9. What is the capital of UK in India?</b>
                      <input class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]" placeholder="Dehradun" type="text"/>
                    </div>
                  </div>
                </div>

              </div>
              <div class="flex flex-row items-center justify-center w-full gap-[17px] mq700:flex-wrap">
                <button class="cursor-pointer [border:none] py-[7px] px-3 bg-[#00BDD6] rounded overflow-hidden flex flex-row items-start justify-start whitespace-nowrap">
                  <div class="relative text-sm leading-[22px] font-inter text-white text-left inline-block min-w-[98px]">
                    Add more Q&A
                  </div>
                </button>
                <button class="cursor-pointer [border:none] py-[7px] px-3 bg-[#00BDD6] rounded overflow-hidden flex flex-row items-start justify-start whitespace-nowrap">
                  <div class="relative text-sm leading-[22px] font-inter text-white text-left inline-block min-w-[125px]">
                    Remove / Edit Q&A
                  </div>
                </button>
              </div>
            </div>
            <div class="w-full flex flex-col items-start justify-start gap-1">
              <b class="text-[#424955]">Detailed Description / Notes</b>
              <input  class="w-full self-stretch h-[35px] rounded flex flex-row items-start justify-start px-3 box-border py-12 font-inter text-sm text-silver min-w-[194px] text-black bg-[#F3F4F6]" placeholder="Write description in detail for this config file." type="text"/>
            </div>
            <div class="w-full flex flex-row items-center justify-center pt-3 gap-5 text-lg text-darkslategray-100">
              <button class="rounded bg-[#FDF2F2] text-[#E05858] py-2 px-4">Discard changes</button>
              <button class="rounded bg-[#FFFFFF] text-[#ED7D2D] py-2 px-4 border border-[#ED7D2D]">Save Draft</button>
              <button class="rounded bg-[#00BDD6] text-white py-2 px-4">Submit for Audit</button>
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
