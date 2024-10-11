<template>
  <div
    class="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="container mx-auto px-6 py-12">

      <div v-if="notification.message" :class="[
        'fixed top-5 right-5 px-4 py-2 rounded-md shadow-lg transition-all duration-300',
        notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
      ]">
        {{ notification.message }}
      </div>

      <div class="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
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
              <div>
                <button @click.prevent="triggerFileInput"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-lg text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition duration-150 ease-in-out">
                  <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  Upload a Config File
                </button>


                <div class="flex flex-row gap-3 items-center mt-3">
                  <div v-if="fileTypeIcon" class="mt-2">
                    <NuxtImg :src="fileTypeIcon" alt="File Type Icon"
                      class="w-16 h-16 object-cover border border-gray-300 rounded-md" />
                  </div>
                  <p v-if="selectedFileName" class="mt-2 text-gray-700 dark:text-gray-300">Selected file: {{
                    selectedFileName }}</p>
                </div>
              </div>

              <input ref="fileInput" id="fileInput" type="file" accept=".json,.csv,.txt" style="display: none;"
                @change="handleFileUpload" />




              <div class="text-sm text-gray-500 dark:text-gray-400">
                <p>JSON, CSV, or TXT supported</p>
                <a href="#"
                  class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline">
                  Download Example JSON Format</a>

              </div>
            </div>



            <div class="w-full flex flex-col items-start justify-start pt-0 px-0 gap-1">
              <b class="text-gray-700">Name of Configuration File</b>
              <div class="w-full flex flex-row items-start justify-start pt-1 pb-1.5 text-silver">

                <input v-model="config.fileName"
                  class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-light"
                  placeholder="Input text" type="text" />
              </div>
            </div>

            <div class="w-full flex flex-row items-start justify-start pt-0 px-0 pb-4 text-dimgray">

              <div class="flex-1 text-gray-700">Enter a name that can be easily recognizable by community. e.g. Capital
                cities of the world, Famous Oscar winners of 1990s, Best Cars of 20th century etc.</div>
            </div>

            <div class="w-[323px] flex flex-col items-start justify-start pt-0 px-0 pb-2.5 gap-1">

              <b class="text-gray-700">Enter a Category</b>
              <div class="w-full flex flex-row items-start justify-between pt-1 pb-1.5 pr-3 gap-5">
                <input
                  class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-light"
                  placeholder="Enter Category" type="text" />
              </div>
            </div>




            <div class="w-[1036px] flex flex-col items-start justify-start pt-0 px-0 pb-4 gap-8">
              <div class="w-[1010px] flex flex-col items-start justify-start gap-1">



                <b class="text-gray-700">Enter relevant tags</b>
                <div class="w-full flex flex-col items-start justify-start gap-10 text-gray-200 mq450:gap-5">
                  <div class="w-full flex flex-row flex-wrap items-start justify-start gap-1">
                    <input v-model="config.inputText" @keydown.enter="addTag"
                      class="w-[312px] border-none outline-none text-black bg-light h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm max-w-full"
                      placeholder="Input text" type="text" />
                    <div
                      class="flex-1 flex flex-row items-start text-[#34270D] justify-start gap-1 min-w-[333px] max-w-full mq450:flex-wrap">
                      <div v-for="(tag, index) in config.tags" :key="index"
                        class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3"><span>{{ tag
                          }}</span>
                        <button @click="removeTag(index)" class="ml-2 text-red-500 hover:text-red-700">x</button>
                      </div>


                    </div>
                  </div>

                  <div
                    class="w-[680px] flex flex-row flex-wrap items-start justify-start gap-12 text-lg text-gray-400 mq450:gap-7">

                    <b class="flex-1 text-gray-900 mq450:min-w-full">Questions & Eval instructions / Answers for the

                      Prompt Eval File</b>
                    <div class="flex flex-col items-start mt-1 justify-start pt-px px-0 pb-0">
                      <NuxtImg class="w-5" loading="lazy" alt="" src="public/info.png" />
                    </div>
                  </div>
                </div>
              </div>


              <div class="w-full flex flex-row flex-wrap items-start justify-start gap-7 ">
                <div class="w-md flex flex-col items-start justify-start gap-1">
                  <b class="text-gray-700">Enter your Question</b>
                  <input v-model="newQuestion"
                    class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-light"
                    placeholder="What's your Question" type="text" />
                </div>
                <div class="w-md flex flex-col items-start justify-start py-0 pr-3 pl-0 gap-1 min-w-[218px]">
                  <b class="text-gray-700">Enter your Answer</b>
                  <input v-model="newAnswer"
                    class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-light"
                    placeholder="What's your Answer" type="text" />

                </div>
                <div class="flex-3 flex flex-col items-start justify-start py-0 pr-3 pl-0 gap-1 min-w-[218px]">

                </div>
              </div>



              <div class="flex flex-row items-center justify-center w-full mt-[-20px] mq700:flex-wrap">
                <button @click="addQA"
                  class="cursor-pointer [border:none] py-[7px] px-3  bg-cyan-500 rounded overflow-hidden flex flex-row items-start justify-start whitespace-nowrap">

                  <div
                    class="relative text-sm leading-[22px] font-inter text-white text-left inline-block min-w-[98px]">
                    Add Q&A
                  </div>
                </button>
              </div>


              <div class="w-full flex flex-wrap items-start justify-start gap-5 ">
                <div v-for="(qa, index) in questionAnswerPairs" :key="index"
                  class="w-[30%] flex flex-col items-start justify-start gap-3 p-4 bg-light rounded-md shadow-md">

                  <div class="w-full flex flex-col items-start justify-start gap-1">
                    <b class="text-gray-700">Q{{ index + 1 }}. {{ qa.question }}</b>
                    <div class="flex ">
                      <b class="text-gray-700 mr-2">Ans.</b>

                      <p class="text-black">{{ qa.answer }}</p>
                    </div>
                  </div>
                  <div class="flex flex-row gap-2">
                    <button @click="editQA(index)" class="text-blue-500">Edit</button>
                    <button @click="removeQA(index)" class="text-red-500">Remove</button>
                  </div>
                </div>
              </div>
            </div>




            <div class="w-full flex flex-col items-start justify-start gap-1">
              <b class="text-gray-700">Detailed Description / Notes</b>
              <input v-model="config.description"
                class="w-full self-stretch h-[35px] rounded flex flex-row items-start justify-start px-3 box-border py-12 font-inter text-sm text-silver min-w-[194px] text-black bg-light"
                placeholder="Write description in detail for this config file." type="text" />
            </div>


            <div class="w-full flex flex-row items-center justify-center pt-3 gap-5 text-lg text-darkslategray-100">
              <button @click="resetForm" class="rounded bg-red-50 text-red-500 py-2 px-4">Discard changes</button>
              <button @click="saveDraft"
                class="rounded bg-white text-orange-500 py-2 px-4 border border-orange-500">Save Draft</button>
              <button @click="submitForAudit" class="rounded bg-cyan-500 text-white py-2 px-4">Submit for

                Audit</button>
            </div>

          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ky from 'ky';

interface QA {
  question: string;
  answer: string;
}

interface ConfigResponse {
  message: string;
  id: number;
}

const FILE_ICONS: Record<string, string> = {
  'application/json': '/json_icon.png',
  'text/csv': '/csv_icon.png',
  'text/plain': '/txt_icon.png',
};

const fileInput = ref<HTMLInputElement | null>(null);
const questionAnswerPairs = ref<QA[]>([]);
const newQuestion = ref('');
const newAnswer = ref('');
const selectedFileName = ref('');
const fileTypeIcon = ref('');
const notification = reactive({
  message: '',
  type: '',
});
const config = reactive({
  fileName: '',
  description: '',
  inputText: '',
  tags: [] as string[],
  uploadedFile: null as File | null,
});

const isLocalhost =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'

const apiUrl = isLocalhost ? 'http://localhost:8787/' : 'https://ethos.lulz.workers.dev/';

const router = useRouter();

const showNotification = (message: string, type: 'success' | 'error') => {
  notification.message = message;
  notification.type = type;
  setTimeout(() => {
    notification.message = '';
    notification.type = '';
  }, 8000);
};

const addQA = () => {
  if (newQuestion.value && newAnswer.value) {
    questionAnswerPairs.value.push({
      question: newQuestion.value,
      answer: newAnswer.value,
    });
    newQuestion.value = '';
    newAnswer.value = '';
    showNotification('Q&A added successfully!', 'success');
  } else {
    showNotification('Please enter both a question and an answer.', 'error');
  }
};

const removeQA = (index: number) => {
  questionAnswerPairs.value.splice(index, 1);
};

const editQA = (index: number) => {
  const qa = questionAnswerPairs.value[index];
  newQuestion.value = qa.question;
  newAnswer.value = qa.answer;
  removeQA(index);
};

const addTag = () => {
  const tag = config.inputText.trim();
  if (tag) {
    config.tags.push(tag);
    config.inputText = '';
  }
};

const removeTag = (index: number) => {
  config.tags.splice(index, 1);
};

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click(); // Use ref to access the input element and trigger the click event
  }
};


const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    selectedFileName.value = file.name;
    fileTypeIcon.value = FILE_ICONS[file.type] || '';
    config.uploadedFile = file;
  }
};


const getFileTypeIcon = (mimeType: string): string => FILE_ICONS[mimeType] || '';

const resetForm = () => {
  newQuestion.value = '';
  newAnswer.value = '';
  questionAnswerPairs.value = [];
  selectedFileName.value = '';
  fileTypeIcon.value = '';
  config.fileName = '';
  config.description = '';
  config.inputText = '';
  config.tags = [];
  config.uploadedFile = null;
};

const saveDraft = () => {
  const draftData = {
    questionAnswerPairs: questionAnswerPairs.value,
    newQuestion: newQuestion.value,
    newAnswer: newAnswer.value,
    selectedFileName: selectedFileName.value,
    fileTypeIcon: fileTypeIcon.value,
    config,
  };
  localStorage.setItem('draftData', JSON.stringify(draftData));
  showNotification('Draft saved successfully!', 'success');
};

const loadDraft = () => {
  const draftData = JSON.parse(localStorage.getItem('draftData') || '{}');
  if (draftData) {
    questionAnswerPairs.value = draftData.questionAnswerPairs || [];
    newQuestion.value = draftData.newQuestion || '';
    newAnswer.value = draftData.newAnswer || '';
    selectedFileName.value = draftData.selectedFileName || '';
    fileTypeIcon.value = draftData.fileTypeIcon || '';
    Object.assign(config, draftData.config || {});
  }
};

const submitForAudit = async () => {
  try {
    if (!config.uploadedFile) throw new Error('No file selected for upload');

    const formData = new FormData();
    formData.append('file', config.uploadedFile);

    const payload = {
      name: config.fileName,
      category: config.description,
      tags: config.tags,
      questionAnswerPairs: questionAnswerPairs.value,
      reviewStatus: 'Pending',
      dateSubmitted: new Date().toISOString(),
      lastReviewed: null,
      submittedBy: 'user123',
    };

    formData.append('metadata', JSON.stringify(payload));
    formData.append('questionAnswerPairs', JSON.stringify(questionAnswerPairs.value));

    const endpoint = apiUrl + 'configs';
    const response = await ky.post(endpoint, { body: formData });

    if (!response.ok) throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);

    const data: ConfigResponse = await response.json();

    if (data.id) {
      localStorage.setItem('configId', data.id.toString());
      router.push({ name: 'llmselector' }).then(() => {
        window.location.reload();
      });
      showNotification('Submission successful!', 'success');
      resetForm();
    } else {
      throw new Error('Config ID is missing in the response');
    }
  } catch (error) {
    console.error('Submission error:', error);
    showNotification('Submission Failed!', 'error');
  }
};

onMounted(() => {
  loadDraft();
});
</script>
