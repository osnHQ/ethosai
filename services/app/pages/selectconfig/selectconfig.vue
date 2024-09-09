<template>
      <div class="w-350 relative shadow bg-white flex items-start justify-end text-left text-base text-dimgray font-inter">
        <main class="flex-1 flex flex-col items-start justify-start pt-6 px-0 pb-0 max-w-280">

    <div class="flex flex-col px-7 py-7 bg-white rounded shadow-sm max-md:px-5">
      <h1 class="text-3xl leading-10 text-zinc-900 max-md:max-w-full">
        Select Configuration File
      </h1>
      <p class="mt-7 text-base leading-7 text-neutral-800 max-md:max-w-full">
        Pick a configuration file to run with the selected LLM.
      </p>
      <div class="self-center mt-8 w-full max-w-[1102px] max-md:max-w-full">
        <div class="flex gap-5 max-md:flex-col max-md:gap-0">
          <div class="flex flex-col w-[23%] max-md:ml-0 max-md:w-full">
            <div
              class="flex gap-4 px-2.5 py-2 w-70 text-lg leading-7 text-white bg-orange-500 rounded-lg shadow max-md:mt-5"
            >
              <NuxtImg
                loading="lazy"
                src="public/Alarm.png"
                alt=""
                class="w-6 h-6 mt-1"
              />
              <div class="flex-auto pl-3 w-full my-auto">You have selected</div>
              <NuxtImg
                loading="lazy"
                src="public/rightarrowwhite.png"
                alt=""
                class="w-6 h-6 mt-1"
              />
            </div>
          </div>
          <div class="flex flex-col ml-5 w-[77%] max-md:ml-0 max-md:w-full">
            <div
              class="grow pr-4 w-full bg-white rounded shadow-sm max-md:mt-5 max-md:max-w-full"
            >
              <div class="flex gap-5 max-md:flex-col max-md:gap-0">
                <div class="flex flex-col w-[33%] max-md:ml-0 max-md:w-full">
                  <NuxtImg
                    loading="lazy"
                    src="public/anthropiccard.png"
                    alt="Claude2 AI model illustration"
                    class="grow w-full aspect-[1.72] max-md:mt-5"
                  />
                </div>
                <div class="flex flex-col ml-5 w-[67%] max-md:ml-0 max-md:w-full">
                  <div
                    class="flex flex-col self-stretch my-auto max-md:mt-10 max-md:max-w-full"
                  >
                    <h2 class="text-lg leading-7 text-zinc-900 max-md:max-w-full">
                      Claude2
                    </h2>
                    <p
                      class="mt-5 text-xs leading-5 text-zinc-900 max-md:max-w-full"
                    >
                      Anthropic's latest addition Claude2 is friendly, personalized
                      and is able to perform much better than its pre-decessor
                      Claud1 in text generation, analysis and knowledge sharing.
                    </p>
                    <div class="flex justify-between items-center mt-4 w-full max-md:flex-wrap">
                        <button class="text-base font-bold leading-7 text-cyan-500">
                          View Details
                         </button>
                     <div class="text-xs leading-5 text-zinc-400">
                         2120 times tested
                     </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="flex gap-5 justify-between px-5 py-5 mt-7 w-full bg-blue-600 rounded-lg max-md:flex-wrap max-md:pl-5 max-md:max-w-full"
      >
        <div
          class="flex gap-5 my-auto text-lg leading-7 text-white max-md:flex-wrap"
        >
          <NuxtImg
            loading="lazy"
            src="public/Alarm.png"
            alt=""
            class="w-7 h-7 "
          />
          <p class="flex-auto max-md:max-w-full">
            Kindly pick from the list of configurations available from Ethos AI
            platform as below.
          </p>
        </div>
        <button
          class="justify-center px-3.5 py-3.5 text-sm leading-5 text-cyan-500 bg-cyan-50 rounded"
        >
          Learn more
        </button>
      </div>
      <div class="flex gap-5 justify-between mt-16 w-full text-sm leading-5 max-md:flex-wrap max-md:pr-5 max-md:mt-10 max-md:max-w-full">
            <div class="flex py-2 rounded mr-3 border border-solid bg-black bg-opacity-0 border-zinc-900 text-neutral-300 flex-grow w-52">
              <NuxtImg loading="lazy" src="public/search.png" alt="" class="w-5" />
              <input type="text" placeholder="Search for the configurations here (name, tags, category etc.)" aria-label="Search for LLMs" class="flex-grow outline-none focus:outline-none focus:shadow-none text-black placeholder-text-3.7 text-4 w-50" />
            </div>
            <select class="bg-white border border-solid border-zinc-900 rounded px-2 py-2 w-full md:w-auto">
              <option>Filter by category</option>
            </select>
            <select class="bg-white border border-solid border-zinc-900 rounded px-2 py-2 w-full md:w-auto">
              <option>Filter by status (audited, unaudited, under rev)</option>
            </select>
          </div>
      <div class="flex gap-5 self-start mt-5 text-sm leading-5 max-md:flex-wrap">
        <div class="flex flex-1 flex-auto gap-5">
          <label for="dateRange" class="grow my-auto text-zinc-700">Select date range</label>
          <div
            class="flex gap-5 justify-center px-3.5 py-3 bg-white rounded border border-solid border-neutral-300 text-zinc-900"
          >
          <input type="text" id="dateRange" value="14/04/2019 - 14/06/2024" class="grow w-full md:w-auto outline-none focus:outline-none focus:shadow-none" />
          <NuxtImg loading="lazy" src="public/downarrow.png" alt="" class=" w-5 h-5 " />
          </div>
        </div>
        <div
          class="flex flex-1 flex-auto gap-0 justify-center self-start p-0.5 bg-cyan-500 rounded"
        >
          <button
            class="justify-center px-9 py-2.5 text-white bg-cyan-500 rounded max-md:px-5"
          >
            My Configs only
          </button>
          <button class="justify-center px-3 py-2.5 text-cyan-500 bg-white rounded">
            All Community Configs
          </button>
        </div>
      </div>
      <div class="overflow-x-auto">
      <table class="mt-6 w-full text-sm leading-5 rounded border border-gray-100 border-solid bg-black bg-opacity-0">
        <thead>
          <tr class="font-semibold text-gray-600 bg-gray-50">
            <th class="px-4 py-4 font-bold text-left">Config File Name</th>
            <th class="px-4 py-4 font-bold text-left">Category</th>
            <th class="px-4 py-4 font-bold text-left">Submitted by</th>
            <th class="px-4 py-5 font-bold text-left">Review Status</th>
            <th class="px-3.5 py-3.5 font-bold text-left">Date <span class="font-bold">Submitted</span></th>
            <th class="px-4 py-3.5 font-bold text-left">Last Modified</th>
            <th class="pl-10 py-5 font-bold text-left">Cost of Eval</th>
            <th class="px-8 py-5 font-bold text-center max-md:px-5 truncate">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white">
            <td class="px-4 py-12 font-bold">Capital Cities of the world</td>
            <td class="px-4 py-12">History</td>
            <td class="px-4 py-10">
              <div class="flex gap-2">
                <NuxtImg loading="lazy" src="public/avatar.png" alt="" class="w-9 aspect-square" />
                <span class="my-auto">Brandon</span>
              </div>
            </td>
            <td class="px-4 py-12">Audited</td>
            <td class="px-4 py-12">11/09/2020</td>
            <td class="px-4 py-12">25/12/2022</td>
            
            <td class="pl-10 py-12">$ 1.2</td>
            <td class="px-8 py-12 text-center text-cyan-500 max-md:px-5">
              <a href="#" class="hover:underline">View/Start Review</a>
            </td>
          </tr>
          <!-- Repeat similar structure for other rows -->
          <tr class="bg-white">
            <td class="px-4 py-12 font-bold ">Best cars of 20th Century</td>
            <td class="px-4 py-12">Business</td>
            <td class="px-4 py-10">
              <div class="flex gap-2">
                <NuxtImg loading="lazy" src="public/avatar2.png" alt="" class="w-9 aspect-square" />
                <span class="my-auto">Paula</span>
              </div>
            </td>
            <td class="px-4 py-12">Audited</td>

            <td class="px-4 py-12">23/02/2022</td>
            <td class="px-4 py-12">23/04/2022</td>
            
            <td class="pl-10 py-12">$ 0.8</td>
            <td class="px-8 py-12 text-center text-cyan-500 max-md:px-5">
              <a href="#" class="hover:underline">View/Start Review</a>
            </td>
          </tr>
          <!-- Repeat similar structure for other rows --><tr class="bg-white">
            <td class="px-4 py-12 font-bold">Oscar movies of 1990s</td>
            <td class="px-4 py-12">Entertainment</td>
            <td class="px-4 py-10">
              <div class="flex gap-2">
                <NuxtImg loading="lazy" src="public/avatar3.png" alt="" class="w-9 aspect-square" />
                <span class="my-auto">Username</span>
              </div>
            </td>
            <td class="px-4 py-12">Under Review</td>
            <td class="px-4 py-12">10/07/2020</td>
            <td class="px-4 py-12">21/04/2024</td>
           
            <td class="pl-10 py-12">$ 0.05</td>
            <td class="px-8 py-12 text-center text-cyan-500 max-md:px-5">
              <a href="#" class="hover:underline">View/Start Review</a>
            </td>
          </tr>
          <!-- Repeat similar structure for other rows --><tr class="bg-white">
            <td class="px-4 py-12 font-bold">Automobile Parts</td>
            <td class="px-4 py-12">Manufacturing</td>
            <td class="px-4 py-10">
              <div class="flex gap-2">
                <NuxtImg loading="lazy" src="public/avatar4.png" alt="" class="w-9 aspect-square" />
                <span class="my-auto">Username</span>
              </div>
            </td>
            <td class="px-4 py-12">Audited</td>
            <td class="px-4 py-12">17/08/2021</td>
            <td class="px-4 py-12">12/03/2023</td>
           
            <td class="pl-10 py-12">$ 1.12</td>
            <td class="px-8 py-12 text-center text-cyan-500 max-md:px-5">
              <a href="#" class="hover:underline">View/Start Review</a>
            </td>
          </tr>
          <!-- Repeat similar structure for other rows -->
        </tbody>
      </table>
    </div>
      <nav class="flex gap-1 self-center mt-14 max-w-full text-sm leading-5 whitespace-nowrap text-zinc-400 w-[344px] max-md:mt-10" aria-label="Pagination">
        <a href="#" class="flex gap-0.5 text-white">
          <NuxtImg loading="lazy" src="public/paginationleft.png" alt="Previous page" class="w-5 h-5 mt-3.5 mr-2" />
          <span class="sr-only">Previous page</span>
        </a>
        <a href="#" aria-current="page" class="justify-center items-start px-4 py-3.5 bg-cyan-500 rounded text-white">
          1
        </a>
        <a href="#" class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
          2
        </a>
        <a href="#" class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
          3
        </a>
        <a href="#" class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
          4
        </a>
        <span class="flex gap-1">
          <NuxtImg loading="lazy" src="public/paginationdots.png" alt="" class="w-5 h-5 mt-3.5 aspect-square border-zinc-200" />
          <a href="#" class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
            10
          </a>
          <a href="#" class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
            11
          </a>
        </span>
        <a href="#" class="flex gap-0.5 text-zinc-400">
          <NuxtImg loading="lazy" src="public/paginationright.png" alt="Next page" class="w-5 h-5 mt-3.5 ml-5" />
          <span class="sr-only">Next page</span>
        </a>
      </nav>
    </div>
</main>

</div>

  </template>
  
  <script>
  export default {
    name: 'ConfigurationSelector',
    // Component logic can be added here
  }
  </script>