<template>
  <div
    class="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
    <div class="container mx-auto px-6 py-12">
      <div class="max-w-5xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
        <div class="px-8 py-10">
          <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
            Create a New Configuration
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Provide a new configuration file by entering "Prompt" and "Ideal Output" below.
          </p>

          <div class="space-y-10">

            <!-- Here is the file upload code -->
            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md">
              <div>
                <button @click="triggerFileInput"
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
                    <img :src="fileTypeIcon" alt="File Type Icon"
                      class="w-16 h-16 object-cover border border-gray-300 rounded-md" />
                  </div>
                  <p v-if="selectedFileName" class="mt-2 text-gray-700 dark:text-gray-300">Selected file: {{
                    selectedFileName }}
                  </p>
                </div>

              </div>
              <!-- File Input types and handling it  -->
              <input ref="fileInput" type="file" accept=".json,.csv,.txt" style="display: none;"
                @change="handleFileUpload" />

              <div class="text-sm text-gray-500 dark:text-gray-400">
                <p>JSON, CSV, or TXT supported</p>
                <a href="#"
                  class="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline">
                  Download Example JSON Format</a>

              </div>
            </div>



            <div class="w-full flex flex-col items-start justify-start pt-0 px-0 gap-1">
              <b class="text-[#424955]">Name of Configuration File</b>
              <div class="w-full flex flex-row items-start justify-start pt-1 pb-1.5 text-silver">
                <input
                  class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]"
                  placeholder="Input text" type="text" />
              </div>
            </div>

            <div class="w-full flex flex-row items-start justify-start pt-0 px-0 pb-4 text-dimgray">
              <div class="flex-1 text-[#565E6C]">Enter a name that can be easily recognizable by community. e.g. Capital
                cities of the world, Famous Oscar winners of 1990s, Best Cars of 20th century etc.</div>
            </div>

            <div class="w-[323px] flex flex-col items-start justify-start pt-0 px-0 pb-2.5 gap-1">
              <b class="text-[#424955]">Enter a Category</b>
              <div class="w-full flex flex-row items-start justify-between pt-1 pb-1.5 pr-3 gap-5">
                <input
                  class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]"
                  placeholder="Enter Category" type="text" />
              </div>
            </div>

            <!-- tags -->
            <div class="w-[1036px] flex flex-col items-start justify-start pt-0 px-0 pb-4 gap-8">
              <div class="w-[1010px] flex flex-col items-start justify-start gap-1">
                <b class="text-[#424955]">Enter relevant tags</b>
                <div class="w-full flex flex-col items-start justify-start gap-10 text-gray-200 mq450:gap-5">
                  <div class="w-full flex flex-row flex-wrap items-start justify-start gap-1">
                    <input
                      class="w-[312px] border-none outline-none text-black bg-[#F3F4F6] h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm max-w-full"
                      placeholder="Input text" type="text" />
                    <div
                      class="flex-1 flex flex-row items-start text-[#34270D] justify-start gap-1 min-w-[333px] max-w-full mq450:flex-wrap">
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">CapitalCities
                      </div>
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">London</div>
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">Athens of Greece
                      </div>
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">Google Gemini
                        Capitals</div>
                      <div class="rounded-lg bg-[#EDDBB8] flex items-start justify-start py-1.5 px-3">Llama Capital
                        Cities</div>
                    </div>
                  </div>
                  <div
                    class="w-[680px] flex flex-row flex-wrap items-start justify-start gap-12 text-lg text-gray-400 mq450:gap-7">
                    <b class="flex-1 text-[#171A1F] mq450:min-w-full">Questions & Eval instructions / Answers for the
                      Prompt Eval File</b>
                    <div class="flex flex-col items-start mt-1 justify-start pt-px px-0 pb-0">
                      <img class="w-5" loading="lazy" alt="" src="public/info.png" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- input Fields for Q/A -->
              <div class="w-full flex flex-row flex-wrap items-start justify-start gap-7 ">
                <div class="w-md flex flex-col items-start justify-start gap-1">
                  <b class="text-[#424955]">Enter your Question</b>
                  <input v-model="newQuestion"
                    class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]"
                    placeholder="Enter Question" type="text" />
                </div>
                <div class="w-md flex flex-col items-start justify-start py-0 pr-3 pl-0 gap-1 min-w-[218px]">
                  <b class="text-[#424955]">Enter your Answer</b>
                  <input v-model="newAnswer"
                    class="w-full border-none outline-none h-9 rounded flex items-start justify-start pt-1 px-3 pb-1.5 font-inter text-sm text-black bg-[#F3F4F6]"
                    placeholder="Enter Answer" type="text" />
                </div>
                <div class="flex-3 flex flex-col items-start justify-start py-0 pr-3 pl-0 gap-1 min-w-[218px]">

                </div>
              </div>


              <!-- button to add Q&A -->
              <div class="flex flex-row items-center justify-center w-full mt-[-20px] mq700:flex-wrap">
                <button @click="addQA"
                  class="cursor-pointer [border:none] py-[7px] px-3 bg-[#00BDD6] rounded overflow-hidden flex flex-row items-start justify-start whitespace-nowrap">
                  <div
                    class="relative text-sm leading-[22px] font-inter text-white text-left inline-block min-w-[98px]">
                    Add Q&A
                  </div>
                </button>
              </div>

              <!-- Div to display dynamic ques/ans cards -->
              <div class="w-full flex flex-wrap items-start justify-start gap-5 ">
                <div v-for="(qa, index) in qas" :key="index"
                  class="w-[30%] flex flex-col items-start justify-start gap-3 p-4 bg-[#F3F4F6] rounded-md shadow-md">
                  <div class="w-full flex flex-col items-start justify-start gap-1">
                    <b class="text-[#424955]">Q{{ index + 1 }}. {{ qa.question }}</b>
                    <div class="flex ">
                      <b class="text-[#424955] mr-2">Ans.</b>
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


            <!-- Description box -->

            <div class="w-full flex flex-col items-start justify-start gap-1">
              <b class="text-[#424955]">Detailed Description / Notes</b>
              <input
                class="w-full self-stretch h-[35px] rounded flex flex-row items-start justify-start px-3 box-border py-12 font-inter text-sm text-silver min-w-[194px] text-black bg-[#F3F4F6]"
                placeholder="Write description in detail for this config file." type="text" />
            </div>


            <!-- Buttons to discard/save/submit changes to form -->
            <div class="w-full flex flex-row items-center justify-center pt-3 gap-5 text-lg text-darkslategray-100">
              <button @click="resetForm" class="rounded bg-[#FDF2F2] text-[#E05858] py-2 px-4">Discard changes</button>
              <button @click="saveDraft"
                class="rounded bg-[#FFFFFF] text-[#ED7D2D] py-2 px-4 border border-[#ED7D2D]">Save Draft</button>
              <button @click="submitForAudit" class="rounded bg-[#00BDD6] text-white py-2 px-4">Submit for
                Audit</button>
            </div>

          </div>

          <!-- Removing below div for now due to unsurity of their functionality -->

          <!-- <div class="mt-8 flex justify-end space-x-3">
            <button
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
              Cancel
            </button>
            <button
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
              Save Configuration
            </button>
          </div> -->

        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ky from 'ky';

export default {
  data() {
    return {
      newQuestion: '',
      newAnswer: '',
      qas: [],
      selectedFileName: '',
      fileTypeIcon: '',
    };
  },

  //describing all the methods here

  methods: {
    addQA() {
      if (this.newQuestion && this.newAnswer) {
        this.qas.push({ question: this.newQuestion, answer: this.newAnswer });
        this.newQuestion = '';
        this.newAnswer = '';
      } else {
        alert('Please enter both a question and an answer.');
      }
    },

    removeQA(index) {
      this.qas.splice(index, 1);
    },

    editQA(index) {
      const qa = this.qas[index];
      this.newQuestion = qa.question;
      this.newAnswer = qa.answer;
      this.qas.splice(index, 1); // Remove the old entry to replace with the updated one
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFileName = file.name;
        this.fileTypeIcon = this.getFileTypeIcon(file.type); // Setting the file type icon for image preview
        console.log('Selected file:', file);
      }
    },

    getFileTypeIcon(mimeType) {
      const fileIcons = {
        'application/json': '/json_icon.png',
        'text/csv': '/csv_icon.png',
        'text/plain': '/txt_icon.png',
      };

      return fileIcons[mimeType];
    },

    resetForm() {
      this.newQuestion = '';
      this.newAnswer = '';
      this.qas = [];
      this.selectedFileName = '';
      this.$refs.fileInput.value = '';
      this.fileTypeIcon = '';

      // Clear text inputs
      const textInputs = document.querySelectorAll('input[type="text"]');
      textInputs.forEach((input) => (input.value = ''));
    },

    //saving all data in local storage
    saveDraft() {
      if (process.client) {
        const draftData = {
          qas: this.qas,
          newQuestion: this.newQuestion,
          newAnswer: this.newAnswer,
          selectedFileName: this.selectedFileName,
          fileTypeIcon: this.fileTypeIcon,
          textInputs: Array.from(document.querySelectorAll('input[type="text"]')).map(input => input.value)

        };
        localStorage.setItem('draftData', JSON.stringify(draftData));
        alert('Draft saved successfully!');
      }
    },

    loadDraft() {
      if (process.client) {
        const draftData = JSON.parse(localStorage.getItem('draftData'));
        if (draftData) {
          this.qas = draftData.qas || [];
          this.newQuestion = draftData.newQuestion || '';
          this.newAnswer = draftData.newAnswer || '';
          this.selectedFileName = draftData.selectedFileName || '';
          this.fileTypeIcon = draftData.fileTypeIcon || '';


          //loading back the text inputs that were saved
          const textInputs = document.querySelectorAll('input[type="text"]');
          draftData.textInputs?.forEach((value, index) => {
            if (textInputs[index]) {
              textInputs[index].value = value;
            }
          });

        }
      }
    },

    async submitForAudit() {
      try {
        const payload = {
          qas: this.qas,
          newQuestion: this.newQuestion,
          newAnswer: this.newAnswer,
          selectedFileName: this.selectedFileName,
          fileTypeIcon: this.fileTypeIcon
        };

        // will replace with real api later, just did this to test what data i will send
        const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

        const response = await ky.post(apiUrl, {
          json: payload,
        });

        if (response.ok) {
          alert('Submission successful!');
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      } catch (error) {
        console.error('Submission error:', error);
        alert('Submission failed!');
      }
    },

  },

  mounted() {
    this.loadDraft(); // load the draft when the component is mounted on the client side
  },
};
</script>
