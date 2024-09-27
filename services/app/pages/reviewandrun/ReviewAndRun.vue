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
          <NuxtImg loading="lazy" src="/Alarm.png" alt="" class="w-7 h-5 mt-4" />
          <p class="flex-auto max-md:max-w-full">
            Please go through the details carefully before running the config against the selected LLM as it takes time and cost for this!
          </p>
        </div>
        <button class="px-7 py-3.5 text-sm leading-5 text-orange-500 whitespace-nowrap bg-red-50 rounded max-md:px-5">
          Dismiss
        </button>
      </section>

      <!-- Config Data Section -->
      <section v-if="configData" class="mt-20 w-full max-w-300 max-md:mt-10 max-md:max-w-full border border-neutral-300 border-dashed border-2 px-10 py-3">
        <div class="flex gap-5 max-md:flex-col">
          <aside class="flex flex-col w-[35%] max-md:ml-0 max-md:w-full">
            <div class="flex flex-col grow items-start py-7 pr-20 pl-8 mx-auto w-full text-sm font-bold leading-5 bg-white rounded-md shadow max-md:px-5 max-md:mt-6">
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

          <!-- Selected LLM Info -->
          <div class="flex flex-col ml-5 w-[65%] max-md:ml-0 max-md:w-full">
            <article v-if="selectedLlm" class="mt-24 w-full bg-white rounded shadow-sm max-md:mt-10 max-md:max-w-full">
              <div class="flex gap-5 max-md:flex-col">
                <div class="flex flex-col w-[37%] max-md:ml-0 max-md:w-full">
                  <NuxtImg loading="lazy" :src="selectedLlm.image || '/default-llm.png'" alt="LLM Image" class="grow w-full aspect-[1.72] max-md:mt-5" />
                </div>
                <div class="flex flex-col ml-5 w-[63%] max-md:ml-0 max-md:w-full">
                  <div class="flex flex-col self-stretch my-auto text-zinc-900 max-md:mt-10 max-md:max-w-full">
                    <h3 class="text-lg leading-7 max-md:max-w-full">{{ selectedLlm.name || 'Selected LLM' }}</h3>
                    <p class="mt-5 text-xs leading-5 max-md:max-w-full">
                      {{ selectedLlm.description || 'LLM description goes here.' }}
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

      <!-- Action Buttons -->
      <div class="flex gap-4 mt-14 ml-24 text-lg leading-7 max-md:flex-wrap max-md:mt-10">
        <button @click="editSelection" class="px-5 py-2 text-white bg-amber-700 rounded">Edit the selection</button>
        <button @click="saveDraft" class="px-5 py-2 text-blue-700 bg-white rounded border border-blue-700 border-solid">
          Save Draft
        </button>
        <button @click="cancelAndExit" class="p-2 text-red-500 bg-red-200 rounded">
          Cancel and exit to Dashboard
        </button>
      </div>
      <button @click="runEvaluation" class="px-11 py-2 mt-9 text-lg leading-7 text-white bg-blue-600 rounded max-md:px-5">
        Run Evaluation
      </button>
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

    
    const editSelection = () => {
      //will write logic in next commit
    };

    const saveDraft = () => {
      // will write logic to save the current draft in next commit
    };

    const cancelAndExit = () => {
      router.push({ name: 'results' });
      
    };

    const runEvaluation = async () => {
      if (!selectedLlm.value || !configId.value) {
        console.error('Missing selected LLM or config ID.');
        return;
      }

      const payload = {
        configId: Number(configId.value),
        model: 'gpt-4o-mini', 
      };

      try {
        const response = await fetch('http://localhost:8787/eval/evaluateCsv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Evaluation result:', result); 
         router.push({ name: 'auditqueue' });
        } else {
          console.error('Failed to run evaluation');
        }
      } catch (error) {
        console.error('Error in evaluation:', error);
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
    };
  },
};
</script>
