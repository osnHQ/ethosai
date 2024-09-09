<template>
    <div class="w-full relative shadow bg-white flex items-start justify-end py-0 pr-7 pl-0 gap-2 text-left text-base text-dimgray font-inter">
    <main class="w-290 flex flex-col items-center px-7 py-9 bg-white rounded border-4 border-white border-solid shadow-sm max-md:px-5">
      <h1 class="self-stretch text-3xl leading-10 text-zinc-900 max-md:max-w-full">
        Review and Run Evaluation
      </h1>
      <p class="self-stretch mt-9 text-base leading-7 text-neutral-800 max-md:max-w-full">
        Confirm your choices before running the evaluation.
      </p>
      <section class="flex gap-5 self-stretch px-6 py-5 mt-8 w-full bg-cyan-500 rounded-lg max-md:flex-wrap max-md:pl-5 max-md:max-w-full">
        <div class="flex flex-auto gap-5 my-auto text-lg leading-7 text-white max-md:flex-wrap">
          <NuxtImg loading="lazy" src="public/Alarm.png" alt="" class="w-7 h-5 mt-4" />
          <p class="flex-auto max-md:max-w-full">
            Please go through the details carefully before running the config against the selected LLM as it takes time and cost for this!
          </p>
        </div>
        <button class="px-7 py-3.5 text-sm leading-5 text-orange-500 whitespace-nowrap bg-red-50 rounded max-md:px-5">
          Dismiss
        </button>
      </section>
      <section class="mt-20 w-full max-w-300 max-md:mt-10 max-md:max-w-full border border-neutral-300 border-dashed border-2 px-10 py-3">
        <div class="flex gap-5 max-md:flex-col">
          <aside class="flex flex-col w-[35%] max-md:ml-0 max-md:w-full">
            <div class="flex flex-col grow items-start py-7 pr-20 pl-8 mx-auto w-full text-sm font-bold leading-5 bg-white rounded-md shadow max-md:px-5 max-md:mt-6">
              <h2 class="text-xl leading-8 text-zinc-900">Best cars of 20th century</h2>
              <div class="flex gap-2 mt-6 text-sky-600">
                <NuxtImg loading="lazy" src="public/attachment.png" alt="" class="w-4.5" />
                <p class="flex-auto">Config File (JSON)</p>
              </div>
              <div class="flex gap-5 mt-7">
                <div class="w-50 flex flex-col flex-1 text-zinc-400">
                  <div class="flex gap-2 whitespace-nowrap">
                    <NuxtImg loading="lazy" src="public/trending.png" alt="" class="w-4.5" />
                    <p>Category</p>
                  </div>
                  <div class="flex gap-2 mt-6">
                    <NuxtImg loading="lazy" src="public/calendar.png" alt="" class="w-4.5" />
                    <p class="my-auto">Created on</p>
                  </div>
                  <div class="flex gap-2 mt-8">
                    <NuxtImg loading="lazy" src="public/info2.png" alt="" class="w-4.5 h-4" />
                    <p class="my-auto">Audit Status</p>
                  </div>
                </div>
                <div class="flex flex-col flex-1 my-auto text-zinc-900">
                  <p>Business</p>
                  <p class="mt-7">February 22, 2022</p>
                  <p class="mt-8">Audited</p>
                </div>
              </div>
              <button class="self-center mt-6 text-base leading-7 text-cyan-500">
                View Details
              </button>
            </div>
          </aside>
          <div class="flex flex-col ml-5 w-[65%] max-md:ml-0 max-md:w-full">
            <article class="mt-24 w-full bg-white rounded shadow-sm max-md:mt-10 max-md:max-w-full">
              <div class="flex gap-5 max-md:flex-col">
                <div class="flex flex-col w-[37%] max-md:ml-0 max-md:w-full">
                  <NuxtImg loading="lazy" src="public/anthropiccard.png" alt="Claude2 AI model representation" class="grow w-full aspect-[1.72] max-md:mt-5" />
                </div>
                <div class="flex flex-col ml-5 w-[63%] max-md:ml-0 max-md:w-full">
                  <div class="flex flex-col self-stretch my-auto text-zinc-900 max-md:mt-10 max-md:max-w-full">
                    <h3 class="text-lg leading-7 max-md:max-w-full">Claude2</h3>
                    <p class="mt-5 text-xs leading-5 max-md:max-w-full">
                      Anthropic's latest addition Claude2 is friendly, personalized and is able to perform much better than its predecessor Claude1 in text generation, analysis and knowledge sharing.
                    </p>
                    <button class="mt-4 text-base font-bold leading-7 text-cyan-500 max-md:max-w-full">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section class="mt-28 w-full max-w-500 max-md:mt-10 max-md:max-w-full">
        <div class="flex gap-5 max-md:flex-col">
          <div class="flex flex-col w-6/12 max-md:ml-0 max-md:w-full">
            <div class="px-2.5 py-4 mt-1 w-full border-2 border-dashed bg-white bg-opacity-20 border-neutral-300 max-md:mt-10 max-md:max-w-full">
              <div class="flex gap-5 max-md:flex-col">
                <div class="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
                  <div class="flex flex-col grow justify-end pb-3.5 mx-auto w-full rounded max-md:mt-7">
                    <div class="flex gap-1.5 py-4.5 justify-start px-4 py-2 text-xs font-semibold leading-5 text-white bg-cyan-500 rounded">
                      <NuxtImg loading="lazy" src="public/user.png" alt="" class="w-5" />
                      <p class="my-auto">Creator</p>
                    </div>
                    <div class="flex gap-2 self-center mt-2.5 text-cyan-500">
                      <p class="my-auto text-xs leading-5">EAI</p>
                      <p class="text-2xl font-bold leading-9">0.47</p>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
                  <div class="flex flex-col grow justify-end pb-3.5 mx-auto w-full bg-cyan-50 rounded max-md:mt-7">
                    <div class="flex gap-1.5 justify-end px-4 py-2 text-xs font-semibold leading-5 text-white bg-violet-500 rounded">
                      <NuxtImg loading="lazy" src="public/users.png" alt="" class="w-5 h-5 mt-2" />
                      <p class="my-auto">Auditor Staking</p>
                    </div>
                    <div class="flex gap-2 self-center mt-2.5 text-cyan-500 whitespace-nowrap">
                      <p class="my-auto text-xs leading-5">EAI</p>
                      <p class="text-2xl font-bold leading-9">0.08</p>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full">
                  <div class="flex flex-col grow pb-4 mx-auto w-full bg-gray-50 rounded max-md:mt-7">
                    <div class="flex gap-1.5 px-4 py-4.4 text-xs font-semibold leading-5 text-white bg-blue-600 rounded">
                      <NuxtImg loading="lazy" src="public/file.png" alt="" class="w-5 h-5" />
                      <p class="my-auto">LLM Depin</p>
                    </div>
                    <div class="flex gap-2 self-center mt-2 text-cyan-500 whitespace-nowrap">
                      <p class="my-auto text-xs leading-5">EAI</p>
                      <p class="text-2xl font-bold leading-9">0.23</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full">
            <div class="flex grow gap-3 items-start max-md:flex-wrap max-md:mt-10 max-md:max-w-full">
              <div class="flex flex-col pb-4 mt-3 bg-gray-50">
                <div class="flex gap-2 justify-end items-start px-3 py-1.5 text-lg font-semibold leading-7 text-white bg-blue-600 rounded">
                  <NuxtImg loading="lazy" src="public/user.png" alt="" class="self-start w-6" />
                  <p class="my-auto">Total Cost</p>
                </div>
                <div class="flex gap-3 self-center mt-2.5 text-cyan-500 whitespace-nowrap">
                  <p class="text-base leading-7">EAI</p>
                  <p class="text-3xl font-bold leading-10">0.78</p>
                </div>
              </div>
              <NuxtImg loading="lazy" src="public/questioncyan.png" alt="" class="w-9" />
              <div class="flex flex-col justify-center self-stretch text-sm text-white rounded shadow bg-black bg-opacity-0">
                <div class="flex flex-col px-3 pt-5 pb-3 bg-cyan-500 rounded">
                  <h4 class="text-base font-bold leading-7">
                    Is this cost higher?
                  </h4>
                  <p class="mt-7 leading-6">
                    Audited LLMs are costlier than Unaudited LLMs.
                  </p>
                  <button class="self-end px-4 py-3.5 mt-1 bg-white rounded leading-10 text-zinc-900">
                    Got it
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="flex gap-4 mt-14 ml-24 text-lg leading-7 max-md:flex-wrap max-md:mt-10">
        <button class="px-5 py-2 text-white bg-amber-700 rounded">Edit the selection</button>
        <button class="px-5 py-2 text-blue-700 bg-white rounded border border-blue-700 border-solid">
          Save Draft
        </button>
        <button class="p-2 text-red-500 bg-red-200 rounded">
          Cancel and exit to Dashboard
        </button>
      </div>
      <button class="px-11 py-2 mt-9 text-lg leading-7 text-white bg-blue-600 rounded max-md:px-5">
        Run Evaluation
      </button>
    </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ReviewAndRunEvaluation',
  }
  </script>