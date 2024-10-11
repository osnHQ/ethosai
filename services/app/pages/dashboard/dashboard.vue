<template>
    <div
        class="w-full relative shadow bg-white flex items-start justify-between text-left text-base text-dimgray font-inter">
       <div>
       <aside :class="{
        'hidden': !isSidebarOpen && isMobile,
        'block': isSidebarOpen || !isMobile,
        'fixed md:relative': true,
        'inset-0': isSidebarOpen && isMobile,
        'z-30': true,
        'min-h-screen': true,
        'transition-transform transform md:translate-x-0': true
    }" class="w-64 min-h-screen bg-white shadow-lg md:block">
      <Sidebar @toggleSidebar="toggleSidebar" />
    </aside>
</div>
    
    <!-- Overlay for Mobile -->
    <div v-if="isSidebarOpen && isMobile" class="fixed inset-0 bg-black opacity-30 z-20" @click="toggleSidebar"></div>
    <div>    
    <main class="flex-1 flex flex-col items-start justify-start max-w-280">
            <section
                class="flex flex-col px-8 pb-3.5 mt-4 w-full bg-white rounded shadow-sm max-w-[1676px] max-md:px-5 max-md:max-w-full">
                <header class="max-md:max-w-full">
                    <div class="flex gap-5 max-md:flex-col max-md:gap-0">
                        <div class="flex flex-col w-[81%] max-md:ml-0 max-md:w-full">
                            <div class="flex flex-col max-md:mt-10 max-md:max-w-full">
                                <div
                                    class="flex gap-5 justify-between px-0.5 w-full max-md:flex-wrap max-md:max-w-full">
                                    <h1
                                        class="flex gap-5 self-start text-3xl leading-10 text-zinc-900 max-md:flex-wrap max-md:max-w-full">
                                        <span class="flex-auto font-bold">User Dashboard</span>
                                        <NuxtImg loading="lazy" src="/loading.png" alt="" class="w-10" />
                                    </h1>

                                </div>
                                <p class="ml-1 text-base leading-7 text-md text-gray-800 max-md:max-w-full">
                                    Your personalized overview of Ethos AI activities and metrics. </p>
                            </div>
                        </div>
                        <div class="flex flex-col ml-5 w-[35%] max-md:ml-0 max-md:w-full">
                            <div class="flex flex-col grow max-md:mt-10">
                                <div class="flex flex-row gap-3 items-center mt-3">
                                    <div v-if="fileTypeIcon" class="mt-2">
                                        <NuxtImg :src="fileTypeIcon" alt="File Type Icon"
                                            class="w-16 h-16 object-cover border border-gray-300 rounded-md" />
                                    </div>
                                    <p v-if="selectedFileName" class="mt-2 text-gray-700 dark:text-gray-300">Selected
                                        file: {{
                                            selectedFileName }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <div class="dark:bg-gray-700 h-[595px] mt-2 border border-gray-300 shadow-lg rounded-lg">
                    <h1 class="text-xl font-extrabold ml-3 mt-4">Overview</h1>

                    <!-- 1stttt-->
                    <div class=" flex flex-row justify-between ml-5 mr-5">
                        <div
                            class="relative flex flex-col my-3 mx-3 bg-white shadow-md border border-slate-200 rounded-lg w-76">
                            <div class="mx-3 mb-0 border-b border-slate-200 pt-3 pb-2 px-1 flex justify-between">
                                <span class="text-xl text-slate-600 font-medium">
                                    Evals Submitted
                                </span>
                                <div
                                    class="w-8 h-8 flex items-center justify-center rounded-full bg-purple-500 text-white ml-2">
                                    <!-- Icon inside the circle (you can replace with any icon SVG) -->
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                        <path d="M20 2H6.5A2.5 2.5 0 0 0 4 4.5v15" />
                                        <path d="M20 2v15a2.5 2.5 0 0 1-2.5 2.5H4" />
                                        <path d="M8 6h8" />
                                        <path d="M8 10h8" />
                                    </svg>
                                </div>
                            </div>
                            <div class="p-4">
                                <h5 class="mb-3 ml-2 text-slate-800 text-3xl font-semibold">
                                    24
                                </h5>
                                <p class="text-slate-600 leading-normal font-light">
                                <div
                                    class="bg-red-100 text-red-700 rounded-full px-4 py-2 inline-flex items-center space-x-2">
                                    <span>25%</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 3v18m7-7l-7 7-7-7" />
                                    </svg>
                                </div>
                                </p>
                            </div>
                        </div>


                        <div
                            class="relative flex flex-col my-3 mx-3 bg-white shadow-md border border-slate-200 rounded-lg w-76">
                            <div class="mx-3 mb-0 border-b border-slate-200 pt-3 pb-2 px-1 flex justify-between">
                                <span class="text-xl text-slate-600 font-medium">
                                    Audited Evals
                                </span>
                                <div
                                    class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white ml-2">
                                    <!-- Icon inside the circle (you can replace with any icon SVG) -->
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="h-6 w-6">
                                        <rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect>
                                        <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M6 14h8"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="p-4">
                                <h5 class="mb-3 ml-2 text-slate-800 text-3xl font-semibold">
                                    11
                                </h5>
                                <p class="text-slate-600 leading-normal font-light">
                                <div
                                    class="bg-green-100 text-green-700 rounded-full px-4 py-2 inline-flex items-center space-x-2">
                                    <span>25%</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 21V3m-7 7l7-7 7 7" />
                                    </svg>
                                </div>
                                </p>
                            </div>
                        </div>

                        <!-- 3rdddd-->
                        <div
                            class="relative flex flex-col my-3 mx-3 bg-white shadow-md border border-slate-200 rounded-lg w-76">
                            <div class="mx-3 mb-0 border-b border-slate-200 pt-3 pb-2 px-1 flex justify-between">
                                <span class="text-xl text-slate-600 font-medium">
                                    LLM Eval Runs
                                </span>
                                <div
                                    class="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white ml-2">
                                    <!-- Icon inside the circle (you can replace with any icon SVG)  width="250" height="250" viewBox="-40 -20 350 350"-->
                                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                        version="1.1" width="250" height="250" viewBox="-20 -20 300 300"
                                        xml:space="preserve">

                                        <defs>
                                        </defs>
                                        <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;"
                                            transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)">
                                            <path
                                                d="M 42.918 50.129 c -1.144 0 -2.277 -0.497 -3.054 -1.454 c -1.367 -1.685 -1.108 -4.159 0.577 -5.526 l 22.419 -18.18 c 1.685 -1.364 4.159 -1.108 5.526 0.577 c 1.366 1.686 1.108 4.159 -0.577 5.526 L 45.39 49.251 C 44.662 49.842 43.787 50.129 42.918 50.129 z"
                                                style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                            <path
                                                d="M 71.946 43.083 c -1.343 0 -2.648 -0.69 -3.381 -1.924 l -6.608 -11.133 c -1.108 -1.865 -0.493 -4.276 1.372 -5.383 c 1.866 -1.107 4.277 -0.492 5.383 1.373 l 4.664 7.857 l 10.793 -5.967 c 1.9 -1.05 4.289 -0.361 5.339 1.537 c 1.049 1.899 0.362 4.289 -1.537 5.339 l -14.128 7.81 C 73.242 42.925 72.59 43.083 71.946 43.083 z"
                                                style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                            <path
                                                d="M 38.608 34.788 c -1.203 0 -2.391 -0.551 -3.161 -1.593 c -1.29 -1.744 -0.922 -4.204 0.822 -5.494 l 11.837 -8.758 c 1.092 -0.808 2.525 -0.995 3.787 -0.492 l 14.893 5.92 c 2.016 0.801 3.001 3.085 2.199 5.102 c -0.801 2.017 -3.086 3 -5.101 2.2 l -12.862 -5.112 l -10.08 7.458 C 40.239 34.537 39.42 34.788 38.608 34.788 z"
                                                style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                            <circle cx="76.622" cy="19.962" r="6.782"
                                                style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                transform="  matrix(1 0 0 1 0 0) " />
                                            <path
                                                d="M 20.115 74.459 c -1.237 0 -2.455 -0.582 -3.219 -1.673 c -1.246 -1.776 -0.816 -4.226 0.96 -5.472 l 15.626 -10.962 l 5.916 -11.901 c 0.966 -1.943 3.325 -2.733 5.266 -1.77 c 1.943 0.966 2.735 3.324 1.77 5.266 l -6.36 12.795 c -0.292 0.587 -0.726 1.091 -1.262 1.467 L 22.368 73.746 C 21.681 74.228 20.894 74.459 20.115 74.459 z"
                                                style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                            <path
                                                d="M 57.856 56.365 c -0.504 0 -1.017 -0.098 -1.511 -0.304 l -14.943 -6.235 c -2.002 -0.835 -2.948 -3.136 -2.112 -5.138 c 0.836 -2.002 3.137 -2.946 5.138 -2.112 L 59.37 48.81 c 2.003 0.835 2.948 3.136 2.113 5.138 C 60.854 55.455 59.394 56.365 57.856 56.365 z"
                                                style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                            <path
                                                d="M 50.014 76.82 c -0.467 0 -0.943 -0.083 -1.405 -0.261 c -2.026 -0.777 -3.039 -3.049 -2.262 -5.075 l 7.842 -20.456 c 0.777 -2.026 3.048 -3.04 5.075 -2.263 s 3.038 3.049 2.263 5.075 l -7.843 20.456 C 53.084 75.86 51.594 76.82 50.014 76.82 z"
                                                style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                            <path
                                                d="M 31.603 45.981 H 1.964 C 0.879 45.981 0 45.102 0 44.017 c 0 -1.085 0.879 -1.964 1.964 -1.964 h 29.639 c 1.085 0 1.964 0.879 1.964 1.964 C 33.568 45.102 32.688 45.981 31.603 45.981 z"
                                                style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                            <path
                                                d="M 27.581 35.524 H 9.204 c -1.085 0 -1.964 -0.879 -1.964 -1.964 s 0.879 -1.964 1.964 -1.964 h 18.377 c 1.085 0 1.964 0.879 1.964 1.964 S 28.666 35.524 27.581 35.524 z"
                                                style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                            <path
                                                d="M 25.168 56.438 H 9.204 c -1.085 0 -1.964 -0.879 -1.964 -1.964 s 0.879 -1.964 1.964 -1.964 h 15.964 c 1.085 0 1.964 0.879 1.964 1.964 S 26.253 56.438 25.168 56.438 z"
                                                style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"
                                                transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
                                        </g>
                                    </svg>

                                </div>

                        



                            </div>

                            
                            <div class="p-4">
                                <h5 class="mb-3 ml-2 text-slate-800 text-3xl font-semibold">
                                    23
                                </h5>
                                <p class="text-slate-600 leading-normal font-light">
                                <div
                                    class="bg-green-100 text-green-700 rounded-full px-4 py-2 inline-flex items-center space-x-2">
                                    <span>25%</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 21V3m-7 7l7-7 7 7" />
                                    </svg>
                                </div>
                                </p>
                            </div>
                        </div>

                          


                  </div>
                    <div class="flex justify-center space-x-22 mt-3">
                         <!-- chart-->
                         <ChartCard
      title="Community Eval Audits"
      :percent="72"
      :completed="397000"
      :total="551000"
      chartBackgroundColor="#00bcd4"
      chartBorderColor="#00bcd4"
      buttonText="View report"
    />

    <ChartCard
      title="Sales Progress"
      :percent="30"
      :completed="30"
      :total="100"
      theme="red"
      buttonText="View Report"
    />

</div>

                </div>
                <div class="flex flex-wrap gap-5 mt-10 text-sm leading-5 items-center">
                    <div class="flex gap-2 flex-grow items-center">
                        <div
                            class="flex py-2 rounded mr-3 border border-solid bg-black bg-opacity-0 border-zinc-900 text-neutral-300 flex-grow w-52">
                            <NuxtImg loading="lazy" src="/search.png" alt="" class="w-5" />
                            <input v-model="searchQuery" type="text"
                                placeholder="Search for the configurations here (name, tags, category etc.)"
                                class="flex-grow outline-none focus:outline-none focus:shadow-none text-black placeholder-text-2 text-3 w-50" />
                        </div>
                        <div class="flex">
                            <label for="dateRange" class="text-[#323842] ml-5">Select date range</label>
                            <div
                                class="flex items-center mr-2 w-3/4 justify-center pr-2 py-2 bg-white rounded border border-solid border-neutral-300 text-zinc-900">
                                <Flatpickr v-model="dateRange" :config="flatpickrConfig"
                                    class="grow w-full md:w-auto outline-none focus:outline-none focus:shadow-none" />

                                <NuxtImg loading="lazy" src="/downarrow.png" alt=""
                                    class="shrink-0 w-3.5 aspect-square" />
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-x-5 items-center text-zinc-900 flex-grow">

                        <select v-model="selectedCategory"
                            class="bg-white border border-solid border-zinc-900 rounded px-2 py-2 w-full md:w-auto">
                            <option value="">Filter by category</option>
                            <option v-for="category in categories" :key="category" :value="category">
                                {{ category }}
                            </option>
                        </select>


                        <select v-model="selectedReviewStatus"
                            class="bg-white border border-solid border-zinc-900 rounded px-2 py-2 w-full md:w-auto">
                            <option value="">Filter by status (audited, unaudited, under rev)</option>
                            <option v-for="status in reviewStatuses" :key="status" :value="status">
                                {{ status }}
                            </option>
                        </select>
                    </div>
                </div>


                <div
                    class="flex gap-5 items-start mt-3.5 text-sm leading-6 text-right text-cyan-500 max-md:flex-wrap max-md:max-w-full">
                    <NuxtImg loading="lazy" src="/question.png" alt="" class="shrink-0 w-6 aspect-square" />
                    <p class="flex-auto mt-3">
                        Total <span class="font-bold text-cyan-500">551287</span> configs
                    </p>
                </div>
                <div class="overflow-x-auto">
                    <table
                        class="mt-6 w-full text-sm leading-5 rounded border border-gray-100 border-solid bg-black bg-opacity-0">
                        <thead>
                            <tr class="font-semibold text-gray-600 bg-gray-50">
                                <th class="px-4 py-4 font-bold text-left">Config File Name</th>
                                <th class="px-4 py-4 font-bold text-left">Category</th>
                                <th class="px-4 py-4 font-bold text-left">Tags</th>
                                <th class="px-4 py-5 font-bold text-left">Review Status</th>
                                <th class="px-3.5 py-3.5 font-bold text-left">Date <span
                                        class="font-bold">Submitted</span></th>
                                <th class="px-4 py-3.5 font-bold text-left">Last Reviewed</th>
                                <th class="px-4 py-4 font-bold text-left">Submitted by</th>
                                <th class="pl-10 py-5 font-bold text-left"># of reviews</th>
                                <th class="px-8 py-5 font-bold text-center max-md:px-5 truncate">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="config in filteredConfigs" :key="config.id" class="bg-white">

                                <td class="px-4 py-12 font-bold">{{ config.name }}</td>


                                <td class="px-4 py-12">{{ config.category || 'N/A' }}</td>


                                <td class="px-4 py-11">
                                    <div class="flex gap-1 text-xs leading-5 text-blue-500">
                                        <span v-for="tag in config.tags" :key="tag"
                                            class="px-2 py-2.5 bg-sky-50 rounded-2xl">{{ tag }}</span>
                                    </div>
                                </td>


                                <td class="px-4 py-12">{{ config.reviewStatus }}</td>


                                <td class="px-4 py-12">{{ new Date(config.dateSubmitted).toLocaleDateString() }}</td>


                                <td class="px-4 py-12">{{ new Date(config.lastReviewed).toLocaleDateString() }}</td>


                                <td class="px-4 py-10">
                                    <div class="flex gap-2">

                                        <span class="my-auto">{{ config.submittedBy }}</span>
                                    </div>
                                </td>


                                <td class="pl-10 py-12">{{ config.numOfReviews || 0 }}</td>


                                <td class="px-8 py-12 text-center text-cyan-500 max-md:px-5">
                                    <a href="#" class="hover:underline">View/Start Review</a>
                                </td>
                            </tr>
                        </tbody>

                    </table>
                </div>
                <nav class="flex gap-1 self-center mt-14 max-w-full text-sm leading-5 whitespace-nowrap text-zinc-400 w-[344px] max-md:mt-10"
                    aria-label="Pagination">
                    <a href="#" class="flex gap-0.5 text-white">
                        <NuxtImg loading="lazy" src="/paginationleft.png" alt="Previous page"
                            class="w-5 h-5 mt-3.5 mr-2" />
                        <span class="sr-only">Previous page</span>
                    </a>
                    <a href="#" aria-current="page"
                        class="justify-center items-start px-4 py-3.5 bg-cyan-500 rounded text-white">
                        1
                    </a>
                    <a href="#"
                        class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
                        2
                    </a>
                    <a href="#"
                        class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
                        3
                    </a>
                    <a href="#"
                        class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
                        4
                    </a>
                    <span class="flex gap-1">
                        <NuxtImg loading="lazy" src="/paginationdots.png" alt=""
                            class="w-5 h-5 mt-3.5 aspect-square border-zinc-200" />
                        <a href="#"
                            class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
                            10
                        </a>
                        <a href="#"
                            class="justify-center items-start px-4 py-3.5 bg-white rounded border border-solid border-zinc-200">
                            11
                        </a>
                    </span>
                    <a href="#" class="flex gap-0.5 text-zinc-400">
                        <NuxtImg loading="lazy" src="/paginationright.png" alt="Next page"
                            class="w-5 h-5 mt-3.5 ml-5" />
                        <span class="sr-only">Next page</span>
                    </a>
                </nav>
            </section>
        </main>
    </div>
    </div>
</template>

<script lang="ts">
import ChartCard from '@/components/ChartCard.vue';

export default {
  components: {
    ChartCard,
  },
};</script>
