<template>
  <div
    class="w-full relative shadow-[0px_3px_6px_rgba(18,_15,_40,_0.12)] bg-white overflow-hidden flex flex-row items-start justify-end py-0 pr-7 pl-0 box-border gap-[2px] leading-[normal] tracking-[normal] text-left text-base text-dimgray font-inter mq975:pl-7 mq975:box-border"
  >
    
    <main
      class="flex-1 flex flex-col items-start justify-start pt-6 px-0 pb-0 box-border max-w-[calc(100%_-_287px)] mq975:max-w-full"
    >
      <section
        class="self-stretch flex flex-col items-end justify-start gap-[57px] max-w-full text-left text-3xl text-white font-inter mq450:gap-[28px]"
      >
        
        <div
          class="self-stretch flex flex-row items-start justify-end py-0 pr-4 pl-0 box-border max-w-full text-sm text-darkslategray-100"
        >
          <div
            class="flex-1 shadow-[0px_0px_2px_rgba(23,_26,_31,_0.12),_0px_0px_1px_rgba(23,_26,_31,_0.07)] rounded bg-white overflow-hidden flex flex-col items-start justify-start pt-5 px-7 pb-6 box-border gap-[18px] max-w-full"
          >
            <div
              class="self-stretch flex flex-row items-start justify-between max-w-full gap-[20px] text-13xl text-gray-400 font-epilogue"
            >
              <div
                class="w-[713px] flex flex-col items-start justify-start pt-1 px-0 pb-0 box-border max-w-full"
              >
                <div
                  class="self-stretch flex flex-col items-start justify-start gap-[4px] max-w-full"
                >
                  <h1
                    class="m-0 relative leading-[48px] text-3xl text-[#171A1F] font-normal font-inherit inline-block max-w-full mq975:text-7xl mq975:leading-[38px] mq700:text-lgi mq700:leading-[29px]"
                  >
                    Create a new configuration manually below
                  </h1>
                  <div
                    class="self-stretch relative text-base leading-[26px] font-inter text-[#1D2128] "
                  >
                    Provide a new configuration file by entering "Prompt" and
                    "Ideal Output" as below.
                  </div>
                </div>
              </div>
              <div
                class="flex flex-col items-start justify-start gap-[5px] min-w-[301px] text-lg text-white font-inter"
              >
                <button class="relative leading-[28px] bg-[#ED7D2D] p-2 rounded">
                    Or Upload. a config file here
                </button>
                <div
                  class="w-[210px] relative text-xs leading-[20px] text-[#323842] inline-block"
                >
                  JSON, CSV or TXT supported
                </div>
                <div
                  class="w-[271px] relative text-sm [text-decoration:underline] leading-[22px] text-[#379AE6] inline-block"
                >
                  Download an example JSON format
                </div>
              </div>
            </div>
            <div
              class="self-stretch flex flex-col items-start justify-start pt-0 px-0 gap-[1px]"
            >
              <b class="relative leading-[22px] text-[#424955]">Name of Configuration File</b>
              <div
                class="self-stretch rounded flex flex-row items-start justify-start pt-[7px] pb-1.5 text-silver"
              >
              <input
                      class="w-full [border:none] [outline:none] self-stretch h-[35px] rounded flex flex-row items-start justify-start pt-[7px] px-3 pb-1.5 box-border font-inter text-sm text-silver min-w-[194px] text-black bg-[#F3F4F6]"
                      placeholder="Input text"
                      type="text"
                    />
              </div>
            </div>
            <div
              class="w-[1106px] flex flex-row items-start justify-start pt-0 px-0 pb-4 box-border max-w-full text-dimgray"
            >
              <div
                class="flex-1 relative leading-[22px] inline-block max-w-full text-[#565E6C]"
              >
                Enter a name that can be easily recognizable by community. e.g.
                Capital cities of the world, Famous oscar winners of 1990s, Best
                Cars of 20th century etc.
              </div>
            </div>
            <div
                class="w-[323px] flex flex-col items-start justify-start pt-0 px-0 pb-[11px] box-border gap-[1px] max-w-full"
              >
                <b class="relative leading-[22px] inline-block min-w-[120px] text-[#424955]">
                  Select a category
                </b>
                <div
                  class="self-stretch rounded flex flex-row items-start justify-between pt-[7px] pb-1.5 pr-[11px] gap-[20px]"
                >
                  <div class="relative leading-[22px] inline-block w-full">
                    <select class="text-[#969aa1] bg-[#F3F4F6] border rounded py-2 px-2 w-full">
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                    </select>
                  </div>
                </div>
              </div>

            <div
              class="w-[1036px] flex flex-col items-start justify-start pt-0 px-0 pb-[18px] box-border gap-[35px] max-w-full mq450:gap-[17px]"
            >
              <div
                class="w-[1010px] flex flex-col items-start justify-start gap-[1px] max-w-full"
              >
                <b class="relative leading-[22px] text-[#424955]">Enter relevant tags</b>
                <div
                  class="self-stretch flex flex-col items-start justify-start gap-[41px] max-w-full text-gray-200 mq450:gap-[20px]"
                >
                  <div
                    class="self-stretch flex flex-row flex-wrap items-start justify-start gap-[4px] max-w-full"
                  >
                    <input
                      class="w-[312px] [border:none] [outline:none] text-black bg-[#F3F4F6] h-[35px] rounded flex flex-col items-start justify-start pt-[7px] px-3 pb-1.5 box-border font-inter text-sm text-silver max-w-full"
                      placeholder="Input text"
                      type="text"
                    />
                    <div
                      class="flex-1 flex flex-row items-start text-[#34270D] justify-start gap-[4px] min-w-[333px] max-w-full mq450:flex-wrap"
                    >
                      <div
                        class="rounded-lg bg-wheat overflow-hidden bg-[#EDDBB8] flex flex-row items-start justify-start py-[7px] px-3"
                      >
                        <div
                          class="relative leading-[22px] inline-block min-w-[84px]"
                        >
                          CapitalCities
                        </div>
                      </div>
                      <div
                        class="rounded-lg bg-wheat overflow-hidden bg-[#EDDBB8] flex flex-row items-start justify-start py-[7px] px-3"
                      >
                        <div
                          class="relative leading-[22px] inline-block min-w-[50px]"
                        >
                          London
                        </div>
                      </div>
                      <div
                        class="rounded-lg bg-wheat overflow-hidden bg-[#EDDBB8] flex flex-row items-start justify-start py-[7px] px-3 whitespace-nowrap"
                      >
                        <div
                          class="relative leading-[22px] inline-block min-w-[116px]"
                        >
                          Athens of Greece
                        </div>
                      </div>
                      <div
                        class="rounded-lg bg-wheat overflow-hidden bg-[#EDDBB8] flex flex-row items-start justify-start py-[7px] px-3 whitespace-nowrap"
                      >
                        <div class="relative leading-[22px]">
                          Google Gemini Capitals
                        </div>
                      </div>
                      <div
                      class="rounded-lg bg-wheat overflow-hidden bg-[#EDDBB8] flex flex-row items-start justify-start py-[7px] px-3 whitespace-nowrap"
                    >
                      <div class="relative leading-[22px]">
                        Llama Capital Cities
                      </div>
                    </div>
                    </div>
                  </div>
                  <div
                    class="w-[680px] flex flex-row flex-wrap items-start justify-start gap-[52px] max-w-full text-lg text-gray-400 mq450:gap-[26px]"
                  >
                    <b
                      class="flex-1 relative leading-[28px] inline-block min-w-[393px] max-w-full text-[#171A1F] mq450:min-w-full"
                      >Questions & Eval instructions / Answers for the Prompt
                      Eval File</b
                    >
                    <div
                      class="flex flex-col items-start mt-1 justify-start pt-px px-0 pb-0"
                    >
                      <img
                        class="w-5 relative overflow-hidden"
                        loading="lazy"
                        alt=""
                        src="public/info.png"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="self-stretch flex flex-col items-start justify-start gap-[16px] max-w-full"
              >
                <div
                  class="self-stretch flex flex-row flex-wrap items-start justify-start gap-[27px] max-w-full"
                >
                  <div
                    class="w-[323px] flex flex-col items-start justify-start gap-[1px] max-w-full"
                  >
                    <b class="relative leading-[22px] text-[#424955]"
                      >Q1. What is the capital of India</b
                    >
                    <input
                      class="w-full [border:none] [outline:none] self-stretch h-[35px] rounded flex flex-row items-start justify-start pt-[7px] px-3 pb-1.5 box-border font-inter text-sm text-silver min-w-[194px] text-black bg-[#F3F4F6]"
                      placeholder="New Delhi"
                      type="text"
                    />
                  </div>
                  <div
                    class="flex-1 flex flex-col items-start justify-start py-0 pr-[13px] pl-0 box-border gap-[1px] min-w-[218px] max-w-full"
                  >
                    <b class="relative leading-[22px] text-[#424955]"
                      >Q2. What is the capital of Greece</b
                    >
                    <input
                      class="w-full [border:none] [outline:none] self-stretch h-[35px] rounded flex flex-row items-start justify-start pt-[7px] px-3 pb-1.5 box-border font-inter text-sm text-silver min-w-[194px] text-black bg-[#F3F4F6]"
                      placeholder="Athens"
                      type="text"
                    />
                  </div>
                  <div
                    class="w-[323px] flex flex-col items-start justify-start gap-[1px] max-w-full"
                  >
                    <b class="relative leading-[22px] text-[#424955]"
                      >Q3. What is the capital of Pakistan</b
                    >
                    <input
                      class="w-full [border:none] [outline:none] self-stretch h-[35px] rounded flex flex-row items-start justify-start pt-[7px] px-3 pb-1.5 box-border font-inter text-sm text-silver min-w-[194px] text-black bg-[#F3F4F6]"
                      placeholder="Islamabad"
                      type="text"
                    />
                  </div>
                </div>
                <div
                  class="self-stretch flex flex-row flex-wrap items-start justify-start gap-[27px] max-w-full"
                >
                  <div
                    class="w-[323px] flex flex-col items-start justify-start gap-[16px] max-w-full"
                  >
                    <div
                      class="self-stretch flex flex-col items-start justify-start gap-[1px]"
                    >
                      <b class="relative leading-[22px] text-[#424955]"
                        >Q4. What is the capital of USA</b
                      >
                      <input
                        class="w-full [border:none] [outline:none] self-stretch h-[35px] rounded flex flex-row items-start justify-start pt-[7px] px-3 pb-1.5 box-border font-inter text-sm text-silver min-w-[194px] text-black bg-[#F3F4F6]"
                        placeholder="New York"
                        type="text"
                      />
                    </div>
                    <div
                      class="self-stretch flex flex-col items-start justify-start gap-[1px]"
                    >
                      <b class="relative leading-[22px] text-[#424955]"
                        >Q7. What is the capital of Sex City</b
                      >
                      <input
                        class="w-full [border:none] [outline:none] self-stretch h-[35px] rounded flex flex-row items-start justify-start pt-[7px] px-3 pb-1.5 box-border font-inter text-sm text-silver min-w-[194px] text-black bg-[#F3F4F6]"
                        placeholder="We don't appreciate profanity please"
                        type="text"
                      />
                    </div>
                  </div>
                  <div
                    class="flex-1 flex flex-col items-start justify-start py-0 pr-[13px] pl-0 box-border gap-[16px] min-w-[218px] max-w-full"
                  >
                    <div
                      class="self-stretch flex flex-col items-start justify-start gap-[1px]"
                    >
                      <b class="relative leading-[22px] text-[#424955]"
                        >Q5. What is the capital of Japan</b
                      >
                      <input
                        class="w-full [border:none] [outline:none] self-stretch h-[35px] rounded flex flex-row items-start justify-start pt-[7px] px-3 pb-1.5 box-border font-inter text-sm text-silver min-w-[194px] text-black bg-[#F3F4F6]"
                        placeholder="Tokyo"
                        type="text"
                      />
                    </div>
                    <div
                      class="self-stretch flex flex-col items-start justify-start gap-[1px]"
                    >
                      <b class="relative leading-[22px] text-[#424955]"
                        >Q8. What is the capital of UK</b
                      >
                      <input
                        class="w-full [border:none] [outline:none] self-stretch h-[35px] rounded flex flex-row items-start justify-start pt-[7px] px-3 pb-1.5 box-border font-inter text-sm text-silver min-w-[194px] text-black bg-[#F3F4F6]"
                        placeholder="London"
                        type="text"
                      />
                    </div>
                  </div>
                  <div
                    class="w-[323px] flex flex-col items-start justify-start gap-[16px] max-w-full"
                  >
                    <div
                      class="self-stretch flex flex-col items-start justify-start gap-[1px]"
                    >
                      <b class="relative leading-[22px] text-[#424955]"
                        >Q6. What is the capital of Hogwarts</b
                      >
                      <input
                        class="w-full [border:none] [outline:none] self-stretch h-[35px] rounded flex flex-row items-start justify-start pt-[7px] px-3 pb-1.5 box-border font-inter text-sm text-silver min-w-[194px] text-black bg-[#F3F4F6]"
                        placeholder="No such country exists"
                        type="text"
                      />
                    </div>
                    <div
                      class="self-stretch flex flex-col items-start justify-start gap-[1px]"
                    >
                      <b class="relative leading-[22px] text-[#424955]"
                        >Q9. What is the capital of UK in India?</b
                      >
                      <input
                        class="w-full [border:none] [outline:none] self-stretch h-[35px] rounded flex flex-row items-start justify-start pt-[7px] px-3 pb-1.5 box-border font-inter text-sm text-silver min-w-[194px] text-black bg-[#F3F4F6]"
                        placeholder="Dehradun"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="self-stretch flex flex-col items-start justify-start pt-0 px-0 pb-5 box-border gap-[15px] max-w-full"
            >
              <div
                class="w-[1024px] flex flex-row items-start justify-center py-0 px-5 box-border max-w-full"
              >
                <div
                  class="flex flex-row items-start justify-start gap-[17px] mq700:flex-wrap"
                >
                  <button
                    class="cursor-pointer [border:none] py-[7px] px-3 bg-[#00BDD6] rounded overflow-hidden flex flex-row items-start justify-start whitespace-nowrap hover:bg-cadetblue"
                  >
                    <div
                      class="relative text-sm leading-[22px] font-inter text-white text-left inline-block min-w-[98px]"
                    >
                      Add more Q&A
                    </div>
                  </button>
                  <button
                    class="cursor-pointer [border:none] py-[7px] px-3 bg-[#00BDD6] rounded overflow-hidden flex flex-row items-start justify-start whitespace-nowrap hover:bg-cadetblue"
                  >
                    <div
                      class="relative text-sm leading-[22px] font-inter text-white text-left inline-block min-w-[125px]"
                    >
                      Remove / Edit Q&A
                    </div>
                  </button>
                </div>
              </div>
              <div
                class="self-stretch flex flex-col items-start justify-start gap-[1px]"
              >
                <b class="relative leading-[22px] text-[#424955]"
                  >Detailed Description / Notes</b
                >
                <input
                        class="w-full [border:none] [outline:none] self-stretch h-[35px] rounded flex flex-row items-start justify-start px-3 box-border py-20 font-inter text-sm text-silver min-w-[194px] text-black bg-[#F3F4F6]"
                        placeholder="Write description in detail for this config file."
                        type="text"
                      />
              </div>
            </div>
            <div
              class="self-stretch flex flex-row items-start justify-center max-w-full"
            >
              <div
                class="w-[538px] flex flex-row flex-wrap items-start justify-start gap-[24px] max-w-full"
              >
                <button
                  class="cursor-pointer [border:none] px-5 flex-1 rounded overflow-hidden flex flex-row items-start justify-start box-border min-w-[118px] whitespace-nowrap hover:bg-gainsboro-400"
                >
                  <div
                    class="relative text-lg bg-[#FDF2F2] p-2.5 rounded leading-[28px] font-inter text-[#E05858] text-left"
                  >
                    Discard changes
                  </div>
                </button>
                <button
                  class="cursor-pointer py-2.5 px-[19px] bg-white rounded overflow-hidden border-[#ED7D2D] flex flex-row items-start justify-start whitespace-nowrap border-[1px] border-solid border-chocolate-100 hover:bg-gainsboro-100 hover:box-border hover:border-[1px] hover:border-solid hover:border-chocolate-200"
                >
                  <div
                    class="relative text-lg leading-[28px] font-inter text-[#ED7D2D] text-left inline-block min-w-[90px]"
                  >
                    Save Draft
                  </div>
                </button>
                <button
                  class="cursor-pointer [border:none] py-3 px-5 bg-[#00BDD6] flex-1 rounded overflow-hidden flex flex-row items-start justify-start box-border min-w-[116px] whitespace-nowrap hover:bg-cadetblue"
                  @click="onUserActionsClick"
                >
                  <div
                    class="relative text-lg leading-[28px] font-inter text-white text-left"
                  >
                    Submit for Audit
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>