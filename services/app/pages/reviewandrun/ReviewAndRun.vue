<template>
  <div class="flex h-screen bg-white">
    <aside :class="{
      'hidden': !isSidebarOpen && isMobile,
      'block': isSidebarOpen || !isMobile,
      'fixed': true,
      'inset-y-0 left-0': true,
      'z-30': true,
      'min-h-screen': true,
      'transition-transform transform md:translate-x-0': true
    }" class="w-64 bg-white shadow-lg md:block">
      <Sidebar @toggleSidebar="toggleSidebar" />
    </aside>

    <div v-if="isSidebarOpen && isMobile" class="fixed inset-0 bg-black opacity-30 z-20" @click="toggleSidebar"></div>

    <main class="flex-1 ml-64 overflow-auto p-7">
      <h1 class="text-3xl leading-10 text-zinc-900">Review and Run Evaluation</h1>
      <p class="mt-5 text-base leading-7 text-neutral-800">
        Confirm your choices before running the evaluation.
      </p>

      <section v-if="showWarning" class="flex gap-5 self-stretch px-6 py-5 mt-2 w-full bg-cyan-500 rounded-lg">
        <div class="flex flex-auto gap-5 my-auto text-lg leading-7 text-white">
          <NuxtImg loading="lazy" src="/Alarm.png" alt="" class="w-7 h-5 mt-4" />
          <p class="flex-auto">
            Please go through the details carefully before running the config against the selected LLM as it takes time
            and cost for this!
          </p>
        </div>
        <button @click="dismissWarning"
          class="px-7 py-3.5 text-sm leading-5 text-orange-500 whitespace-nowrap bg-red-50 rounded">
          Dismiss
        </button>
      </section>

      <section v-if="configData" class="mt-5 w-full border border-neutral-300 rounded-2xl shadow-lg px-10 py-5">
        <div class="flex gap-5">
          <aside class="flex flex-col w-[35%]">
            <div
              class="flex flex-col grow items-start py-7 pr-20 pl-8 mx-auto w-full text-sm font-bold leading-5 bg-gray-100 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-102 hover:bg-gray-200">
              <h2 class="text-xl leading-8 text-zinc-900">{{ configData.name || 'Config Name' }}</h2>
              <div class="flex gap-2 mt-6 text-sky-600">
                <NuxtImg loading="lazy" src="/attachment.png" alt="" class="w-4.5" />
                <p class="flex-auto">Config File (JSON)</p>
              </div>
              <div class="flex gap-5 mt-7">
                <div class="w-50 flex flex-col flex-1 text-zinc-400">
                  <div class="flex gap-2 whitespace-nowrap">
                    <NuxtImg loading="lazy" src="/trending.png" alt="" class="w-4.5" />
                    <p>Category</p>
                  </div>
                  <div class="flex gap-2 mt-6">
                    <NuxtImg loading="lazy" src="/calendar.png" alt="" class="w-4.5" />
                    <p class="my-auto">Created on</p>
                  </div>
                  <div class="flex gap-2 mt-8">
                    <NuxtImg loading="lazy" src="/info2.png" alt="" class="w-4.5 h-4" />
                    <p class="my-auto">Audit Status</p>
                  </div>
                </div>
                <div class="flex flex-col flex-1 my-auto text-zinc-900">
                  <p>{{ configData.category || 'Business' }}</p>
                  <p class="mt-7">{{ formatDate(configData.dateSubmitted) || 'N/A' }}</p>
                  <p class="mt-8">{{ configData.reviewStatus || 'Unaudited' }}</p>
                </div>
              </div>
              <button class="self-center mt-6 text-base leading-7 text-cyan-500">
                View Details
              </button>
            </div>
          </aside>

          <div class="flex flex-col ml-5 w-[65%]">
            <article v-if="selectedLlm"
              class="mt-24 w-full bg-white rounded-2xl shadow-md transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-[1.02]">
              <div class="flex gap-5">
                <div class="flex flex-col w-[37%]">
                  <NuxtImg loading="lazy" :src="selectedLlm.image || '/default-llm.png'" alt="LLM Image"
                    class="grow w-full aspect-[1.72]" />
                </div>
                <div class="flex flex-col ml-5 w-[63%]">
                  <div class="flex flex-col self-stretch my-auto text-zinc-900">
                    <h3 class="text-lg leading-7">{{ selectedLlm.name || 'Selected LLM' }}</h3>
                    <p class="mt-5 text-xs leading-5">{{ selectedLlm.description || 'LLM description goes here.' }}</p>
                    <button class="mt-4 text-base font-bold leading-7 text-cyan-500">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div class="flex flex-col items-center gap-4 mt-14 text-lg leading-7">
        <div class="flex gap-4">
          <button @click="editSelection" class="px-5 py-2 text-white bg-amber-700 rounded">Edit the selection</button>
          <button @click="saveDraft" class="px-5 py-2 text-blue-700 bg-white rounded border border-blue-700">Save
            Draft</button>
          <button @click="cancelAndExit" class="p-2 text-red-500 bg-red-200 rounded">Cancel and exit to
            Dashboard</button>
        </div>
        <button @click="runEvaluation" class="px-11 py-2 mt-3 text-lg leading-7 text-white bg-blue-600 rounded">
          Run Evaluation
        </button>
      </div>


      <div v-if="loading"
        class="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center gap-4 text-white">
        <div class="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        <p class="text-xl">Your config file is being evaluated, please wait...</p>
      </div>
    </main>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ReviewAndRunEvaluation',
  setup() {
    const configData = ref(null);
    const selectedLlm = ref(null);
    const configId = ref(null);
    const router = useRouter();
    const loading = ref(false);
    const showWarning = ref(true);


    const isClient = () => typeof window !== 'undefined';


    const fetchConfigData = async () => {
      try {
        if (!configId.value) {
          console.error('Config ID is not available.');
          return;
        }

        const response = await fetch(`http://localhost:8787/configs/${configId.value}`);
        if (response.ok) {
          const data = await response.json();
          configData.value = data;
        } else {
          console.error('Failed to fetch config data');
        }
      } catch (error) {
        console.error('Error fetching config data:', error);
      }
    };


    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };

    onMounted(() => {
      if (isClient()) {
        configId.value = localStorage.getItem('configId');
        const storedLlm = localStorage.getItem('selectedLlm');
        selectedLlm.value = storedLlm ? JSON.parse(storedLlm) : null;
      }

      if (configId.value) {
        fetchConfigData();
      } else {
        console.error('No config ID found in localStorage.');
      }
    });

    const dismissWarning = () => {
      showWarning.value = false;
    };
    const editSelection = () => {
      //will write logic in next commit
    };

    const saveDraft = () => {
      // will write logic to save the current draft in next commit
    };

    const cancelAndExit = () => {
      router.push({ name: 'results' });

    };

    // Frontend code
    const runEvaluation = async () => {
      if (!selectedLlm.value || !configId.value) {
        console.error('Missing selected LLM or config ID.');
        return;
      }

      const payload = {
        configId: Number(configId.value),
        model: 'gpt-4o-mini',
      };
      loading.value = true;

      try {
        const response = await fetch('http://localhost:8787/eval/evaluateCsv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const contentDisposition = response.headers.get('Content-Disposition');
          console.log("Content-Disposition Header:", contentDisposition); 

          const filenameMatch = contentDisposition && contentDisposition.match(/filename="?(.+)"?/i);
          const filename = filenameMatch ? filenameMatch[1] : 'evaluation_results.csv';

          const blob = await response.blob();

          const url = window.URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();

          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);

          console.log('CSV file downloaded successfully');
          router.push({ name: 'auditqueue' });
        } else {
          console.error('Failed to run evaluation');
        }
      } catch (error) {
        console.error('Error in evaluation:', error);
      } finally {
        loading.value = false;  
      }
    };

    return {
      configData,
      selectedLlm,
      formatDate,
      editSelection,
      saveDraft,
      cancelAndExit,
      runEvaluation,
      loading,
      showWarning,  
      dismissWarning,
    };
  },
};
</script>
