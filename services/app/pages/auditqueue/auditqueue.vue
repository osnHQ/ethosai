<template>
    <div class="w-full relative shadow bg-white flex items-start justify-end text-left text-base text-dimgray font-inter">
    <main class="flex-1 flex flex-col items-start justify-start pt-6 px-0 pb-0 max-w-280">
      <section class="flex flex-col px-8 pt-8 pb-3.5 mt-10 w-full bg-white rounded shadow-sm max-w-[1676px] max-md:px-5 max-md:max-w-full">
        <header class="max-md:max-w-full">
          <div class="flex gap-5 max-md:flex-col max-md:gap-0">
            <div class="flex flex-col w-[81%] max-md:ml-0 max-md:w-full">
              <div class="flex flex-col max-md:mt-10 max-md:max-w-full">
                <div class="flex gap-5 justify-between px-0.5 w-full max-md:flex-wrap max-md:max-w-full">
                  <h1 class="flex gap-5 self-start text-3xl leading-10 text-zinc-900 max-md:flex-wrap max-md:max-w-full">
                    <span class="flex-auto">Audit Queue</span>
                    <img loading="lazy" src="public/loading.png" alt="" class="w-10" />
                  </h1>
                  <button class="justify-center px-6 py-2 text-lg leading-7 text-white bg-blue-500 rounded max-md:px-5">
                    Add a new config manually
                  </button>
                </div>
                <p class="mt-2 text-base leading-7 text-neutral-800 max-md:max-w-full">
                  List of all community generated config files and audits
                </p>
              </div>
            </div>
            <div class="flex flex-col ml-5 w-[35%] max-md:ml-0 max-md:w-full">
              <div class="flex flex-col grow max-md:mt-10">
                <button class="justify-center px-2 py-2 text-lg leading-7 text-white bg-orange-500 rounded max-md:px-5">
                  Or Upload a config file here
                </button>
                <p class="mt-3 text-xs leading-5 text-zinc-700">JSON, CSV or TXT supported</p>
                <a href="#" class="mt-3.5 text-sm leading-5 text-blue-500 underline">
                  Download an example JSON format
                </a>
              </div>
            </div>
          </div>
        </header>
        <div class="flex flex-wrap gap-5 mt-10 text-sm leading-5 items-center">
    <div class="flex gap-2 flex-grow items-center">
      <div class="flex py-2 rounded mr-3 border border-solid bg-black bg-opacity-0 border-zinc-900 text-neutral-300 flex-grow w-52">
        <img loading="lazy" src="public/search.png" alt="" class="w-5" />
        <input type="text" placeholder="Search for the configurations here (name, tags, category etc.)" class="flex-grow outline-none focus:outline-none focus:shadow-none text-black placeholder-text-2 text-3 w-50" />
      </div>
      <div class="flex">
        <label for="dateRange" class="text-[#323842] ml-5">Select date range</label>
        <div class="flex items-center mr-2 w-3/4 justify-center pr-2 py-2 bg-white rounded border border-solid border-neutral-300 text-zinc-900">
          <input type="text" id="dateRange" value="14/04/2019 - 14/06/2024" class="grow w-full md:w-auto outline-none focus:outline-none focus:shadow-none" />
          <img loading="lazy" src="public/downarrow.png" alt="" class="shrink-0 w-3.5 aspect-square" />
        </div>
      </div>
    </div>
    <div class="flex gap-x-5 items-center text-zinc-900 flex-grow">
      <select class="bg-white border border-solid border-zinc-900 rounded px-2 py-2 w-full md:w-auto">
        <option>Filter by category</option>
      </select>
      <select class="bg-white border border-solid border-zinc-900 rounded px-2 py-2 w-full md:w-auto">
        <option>Filter by status (audited, unaudited, under rev)</option>
      </select>
    </div>
  </div>
  
  
        <div class="flex gap-5 items-start mt-3.5 text-sm leading-6 text-right text-cyan-500 max-md:flex-wrap max-md:max-w-full">
          <img loading="lazy" src="public/question.png" alt="" class="shrink-0 w-6 aspect-square" />
          <p class="flex-auto mt-3">
            Total <span class="font-bold text-cyan-500">551287</span> configs
          </p>
        </div>
        <div class="overflow-x-auto">
      <table class="mt-6 w-full text-sm leading-5 rounded border border-gray-100 border-solid bg-black bg-opacity-0">
        <thead>
          <tr class="font-semibold text-gray-600 bg-gray-50">
            <th class="px-4 py-4 font-bold text-left">Config File Name</th>
            <th class="px-4 py-4 font-bold text-left">Category</th>
            <th class="px-4 py-4 font-bold text-left">Tags</th>
            <th class="px-4 py-5 font-bold text-left">Review Status</th>
            <th class="px-3.5 py-3.5 font-bold text-left">Date <span class="font-bold">Submitted</span></th>
            <th class="px-4 py-3.5 font-bold text-left">Last Reviewed</th>
            <th class="px-4 py-4 font-bold text-left">Submitted by</th>
            <th class="pl-10 py-5 font-bold text-left"># of reviews</th>
            <th class="px-8 py-5 font-bold text-center max-md:px-5 truncate">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-white">
            <td class="px-4 py-12 font-bold">Capital Cities of the world</td>
            <td class="px-4 py-12">History</td>
            <td class="px-4 py-11">
              <div class="flex gap-1 text-xs leading-5 text-blue-500">
                <span class="px-2 py-2.5 bg-sky-50 rounded-2xl">Capital Cities</span>
                <span class="px-2 py-2.5 bg-sky-50 rounded-2xl">History</span>
              </div>
            </td>
            <td class="px-4 py-12">Audited</td>
            <td class="px-4 py-12">11/09/2020</td>
            <td class="px-4 py-12">25/12/2022</td>
            <td class="px-4 py-10">
              <div class="flex gap-2">
                <img loading="lazy" src="public/avatar.png" alt="" class="w-9 aspect-square" />
                <span class="my-auto">Username</span>
              </div>
            </td>
            <td class="pl-10 py-12">71</td>
            <td class="px-8 py-12 text-center text-cyan-500 max-md:px-5">
              <a href="#" class="hover:underline">View/Start Review</a>
            </td>
          </tr>
          <!-- Repeat similar structure for other rows -->
          <tr class="bg-white">
            <td class="px-4 py-12 font-bold ">Best cars of 20th Century</td>
            <td class="px-4 py-12">Business</td>
            <td class="px-4 py-11">
              <div class="flex gap-1 text-xs leading-5 text-#8353E2">
                <span class="px-2 py-2.5 bg-#F5F2FD rounded-2xl">Cars</span>
                <span class="px-2 py-2.5 bg-#F5F2FD rounded-2xl">Luxury</span>
              </div>
            </td>
            <td class="px-4 py-12">Audited</td>
            <td class="px-4 py-12">23/02/2022</td>
            <td class="px-4 py-12">23/04/2022</td>
            <td class="px-4 py-10">
              <div class="flex gap-2">
                <img loading="lazy" src="public/avatar2.png" alt="" class="w-9 aspect-square" />
                <span class="my-auto">Paula</span>
              </div>
            </td>
            <td class="pl-10 py-12">37</td>
            <td class="px-8 py-12 text-center text-cyan-500 max-md:px-5">
              <a href="#" class="hover:underline">View/Start Review</a>
            </td>
          </tr>
          <!-- Repeat similar structure for other rows --><tr class="bg-white">
            <td class="px-4 py-12 font-bold">Oscar movies of 1990s</td>
            <td class="px-4 py-12">Entertainment</td>
            <td class="px-4 py-11">
              <div class="flex gap-1 text-xs leading-5 ">
                <span class="px-2 py-2.5 bg-#F5F2FD text-#8353E2 rounded-2xl">Movies</span>
                <span class="px-2 py-2.5 bg-#EBFDFF text-#00BDD6 rounded-2xl">Oscar</span>
              </div>
            </td>
            <td class="px-4 py-12">Under Review</td>
            <td class="px-4 py-12">10/07/2020</td>
            <td class="px-4 py-12">21/04/2024</td>
            <td class="px-4 py-10">
              <div class="flex gap-2">
                <img loading="lazy" src="public/avatar3.png" alt="" class="w-9 aspect-square" />
                <span class="my-auto">Username</span>
              </div>
            </td>
            <td class="pl-10 py-12">21</td>
            <td class="px-8 py-12 text-center text-cyan-500 max-md:px-5">
              <a href="#" class="hover:underline">View/Start Review</a>
            </td>
          </tr>
          <!-- Repeat similar structure for other rows --><tr class="bg-white">
            <td class="px-4 py-12 font-bold">Automobile Parts</td>
            <td class="px-4 py-12">Manufacturing</td>
            <td class="px-4 py-11">
              <div class="flex gap-1 text-xs leading-5 text-blue-500">
                <span class="px-2 py-2.5 bg-sky-50 rounded-2xl">Cars</span>
                <span class="px-2 py-2.5 bg-sky-50 rounded-2xl">Manufacturing</span>
              </div>
            </td>
            <td class="px-4 py-12">Audited</td>
            <td class="px-4 py-12">17/08/2021</td>
            <td class="px-4 py-12">12/03/2023</td>
            <td class="px-4 py-10">
              <div class="flex gap-2">
                <img loading="lazy" src="public/avatar4.png" alt="" class="w-9 aspect-square" />
                <span class="my-auto">Username</span>
              </div>
            </td>
            <td class="pl-10 py-12">50</td>
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
            <img loading="lazy" src="public/paginationleft.png" alt="Previous page" class="w-5 h-5 mt-3.5 mr-2" />
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
            <img loading="lazy" src="public/paginationdots.png" alt="" class="w-5 h-5 mt-3.5 aspect-square border-zinc-200" />
            <a href="#" class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
              10
            </a>
            <a href="#" class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
              11
            </a>
          </span>
          <a href="#" class="flex gap-0.5 text-zinc-400">
            <img loading="lazy" src="public/paginationright.png" alt="Next page" class="w-5 h-5 mt-3.5 ml-5" />
            <span class="sr-only">Next page</span>
          </a>
        </nav>
      </section>
    </main>
  </div>
  </template>