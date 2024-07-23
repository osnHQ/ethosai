<template>
  <div class="w-full relative shadow bg-white flex items-start justify-end py-0 pr-7 pl-0 gap-2 text-left text-base text-dimgray font-inter">
    <main class="flex-1 flex flex-col items-start justify-start pt-6 px-0 pb-0 max-w-xl">
      <section class="w-full flex flex-col items-end justify-start gap-14 text-3xl text-white font-inter">
        <div class="w-full flex flex-row items-start justify-end py-0 pr-4 pl-0 text-sm text-darkslategray-100">
          <div class="flex-1 shadow rounded bg-white flex flex-col items-start justify-start pt-5 px-7 pb-6 gap-4">
            <div class="w-full flex flex-row items-start justify-between gap-5 text-4xl text-gray-400 font-epilogue">
              <div class="flex flex-col items-start justify-start pt-1">
                <div class="w-full flex flex-col items-start justify-start gap-1">
                  <h1 class="m-0 text-3xl text-[#171A1F] font-normal">Create a new configuration manually below</h1>
                  <div class="text-base font-inter text-[#1D2128]">Provide a new configuration file by entering "Prompt" and "Ideal Output" as below.</div>
                </div>
              </div>
              <div class="flex flex-col items-start justify-start gap-1.5 text-lg text-white font-inter">
                <button class="bg-[#ED7D2D] p-2 rounded">Or Upload a config file here</button>
                <div class="text-xs text-[#323842]">JSON, CSV or TXT supported</div>
                <div class="text-sm underline text-[#379AE6]">Download an example JSON format</div>
              </div>
            </div>
            <div class="w-full flex flex-col items-start justify-start pt-0 px-0 gap-1">
              <b class="text-[#424955]">Name of Configuration File</b>
              <div class="w-full flex flex-row items-start justify-start pt-1 pb-1.5 text-silver">
                <input class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black  bg-gray-1" placeholder="Input text" type="text"/>
              </div>
            </div>
            <div class="w-full flex flex-row items-start justify-start pt-0 px-0 pb-4 text-dimgray">
              <div class="flex-1 text-[#565E6C]">Enter a name that can be easily recognizable by community. e.g. Capital cities of the world, Famous oscar winners of 1990s, Best Cars of 20th century etc.</div>
            </div>
            <div class="w-78 flex flex-col items-start justify-start pt-0 px-0 pb-2.5 gap-1">
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
            <div class="w-250 flex flex-col items-start justify-start pt-0 px-0 pb-4 gap-8">
              <div class="w-250 flex flex-col items-start justify-start gap-1">
                <b class="text-[#424955]">Enter relevant tags</b>
                <div class="w-full flex flex-col items-start justify-start gap-10 text-gray-200">
                  <div class="w-full flex flex-row flex-wrap items-start justify-start gap-1">
                    <input class="w-75 border-none outline-none text-black bg-[#F3F4F6] h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm max-w-full" placeholder="Input text" type="text"/>
                    <div class="flex-1 flex flex-row items-start text-[#34270D] justify-start gap-1 min-w-[333px] max-w-full">
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">CapitalCities</div>
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">London</div>
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">Athens of Greece</div>
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">Google Gemini Capitals</div>
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">Llama Capital Cities</div>
                    </div>
                  </div>
                  <div class="w-180 flex flex-row flex-wrap items-start justify-start gap-12 text-lg text-gray-400">
                    <b class="flex-1 text-[#171A1F]">Questions & Eval instructions / Answers for the Prompt Eval File</b>
                    <div class="flex flex-col items-start mt-1 justify-start pt-px px-0 pb-0">
                      <img class="w-5" loading="lazy" alt="" src="public/info.png"/>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full flex flex-col items-start justify-start gap-4">
                <div class="w-full flex flex-row flex-wrap items-start justify-start gap-7">
                  <div class="w-80 flex flex-col items-start justify-start gap-1">
                    <b class="text-[#424955]">Q1. What is the capital of India</b>
                    <input class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]" placeholder="New Delhi" type="text"/>
                  </div>
                  <div class="flex-1 flex flex-col items-start justify-start py-0 pr-3 pl-0 gap-1 min-w-[218px]">
                    <b class="text-[#424955]">Q2. What is the capital of Greece</b>
                    <input class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]" placeholder="Athens" type="text"/>
                  </div>
                  <div class="w-80 flex flex-col items-start justify-start gap-1">
                    <b class="text-[#424955]">Q3. What is the capital of Pakistan</b>
                    <input class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]" placeholder="Islamabad" type="text"/>
                  </div>
                </div>
                <div class="w-full flex flex-row flex-wrap items-start justify-start gap-7">
                  <div class="w-80 flex flex-col items-start justify-start gap-4">
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
                  <div class="w-80 flex flex-col items-start justify-start gap-4">
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
              <div class="flex flex-row items-center justify-center w-full gap-5">
                <button class="cursor-pointer [border:none] py-2 px-3 bg-[#00BDD6] rounded overflow-hidden flex flex-row items-start justify-start whitespace-nowrap">
                  <div class="relative text-sm leading-5 font-inter text-white text-left inline-block">
                    Add more Q&A
                  </div>
                </button>
                <button class="cursor-pointer [border:none] py-2 px-3 bg-[#00BDD6] rounded overflow-hidden flex flex-row items-start justify-start whitespace-nowrap">
                  <div class="relative text-sm leading-5 font-inter text-white text-left inline-block">
                    Remove / Edit Q&A
                  </div>
                </button>
              </div>
            </div>
            <div class="w-full flex flex-col items-start justify-start gap-1">
              <b class="text-[#424955]">Detailed Description / Notes</b>
              <input  class="w-full self-stretch h-10 rounded flex flex-row items-start justify-start px-3 box-border py-12 font-inter text-sm text-silver text-black bg-[#F3F4F6]" placeholder="Write description in detail for this config file." type="text"/>
            </div>
            <div class="w-full flex flex-row items-center justify-center pt-3 gap-5 text-lg text-darkslategray-100">
              <button class="rounded bg-[#FDF2F2] text-[#E05858] py-2 px-4">Discard changes</button>
              <button class="rounded bg-[#FFFFFF] text-[#ED7D2D] py-2 px-4 border border-[#ED7D2D]">Save Draft</button>
              <button class="rounded bg-[#00BDD6] text-white py-2 px-4">Submit for Audit</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
