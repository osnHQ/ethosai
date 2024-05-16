export const models = [
    {
      "name": "llama-2-7b-chat-fp16",
      "description": "Full precision (fp16) generative text model with 7 billion parameters from Meta"
    },
    {
      "name": "llama-2-7b-chat-int8",
      "description": "Quantized (int8) generative text model with 7 billion parameters from Meta"
    },
    {
      "name": "mistral-7b-instruct-v0.1",
      "description": "Instruct fine-tuned version of the Mistral-7b generative text model with 7 billion parameters"
    },
    {
      "name": "deepseek-coder-6.7b-base-awq",
      "description": "Deepseek Coder is composed of a series of code language models, each trained from scratch on 2T tokens, with a composition of 87% code and 13% natural language in both English and Chinese."
    },
    {
      "name": "deepseek-coder-6.7b-instruct-awq",
      "description": "Deepseek Coder is composed of a series of code language models, each trained from scratch on 2T tokens, with a composition of 87% code and 13% natural language in both English and Chinese."
    },
    {
      "name": "deepseek-math-7b-base",
      "description": "DeepSeekMath is initialized with DeepSeek-Coder-v1.5 7B and continues pre-training on math-related tokens sourced from Common Crawl, together with natural language and code data for 500B tokens."
    },
    {
      "name": "deepseek-math-7b-instruct",
      "description": "DeepSeekMath-Instruct 7B is a mathematically instructed tuning model derived from DeepSeekMath-Base 7B. DeepSeekMath is initialized with DeepSeek-Coder-v1.5 7B and continues pre-training on math-related tokens sourced from Common Crawl, together with natural language and code data for 500B tokens."
    },
    {
      "name": "discolm-german-7b-v1-awq",
      "description": "DiscoLM German 7b is a Mistral-based large language model with a focus on German-language applications. AWQ is an efficient, accurate and blazing-fast low-bit weight quantization method, currently supporting 4-bit quantization."
    },
    {
      "name": "falcon-7b-instruct",
      "description": "Falcon-7B-Instruct is a 7B parameters causal decoder-only model built by TII based on Falcon-7B and finetuned on a mixture of chat/instruct datasets."
    },
    {
      "name": "gemma-2b-it-lora",
      "description": "This is a Gemma-2B base model that Cloudflare dedicates for inference with LoRA adapters. Gemma is a family of lightweight, state-of-the-art open models from Google, built from the same research and technology used to create the Gemini models."
    },
    {
      "name": "gemma-7b-it",
      "description": "Gemma is a family of lightweight, state-of-the-art open models from Google, built from the same research and technology used to create the Gemini models. They are text-to-text, decoder-only large language models, available in English, with open weights, pre-trained variants, and instruction-tuned variants."
    },
    {
      "name": "gemma-7b-it-lora",
      "description": "This is a Gemma-7B base model that Cloudflare dedicates for inference with LoRA adapters. Gemma is a family of lightweight, state-of-the-art open models from Google, built from the same research and technology used to create the Gemini models."
    },
    {
      "name": "hermes-2-pro-mistral-7b",
      "description": "Hermes 2 Pro on Mistral 7B is the new flagship 7B Hermes! Hermes 2 Pro is an upgraded, retrained version of Nous Hermes 2, consisting of an updated and cleaned version of the OpenHermes 2.5 Dataset, as well as a newly introduced Function Calling and JSON Mode dataset developed in-house."
    },
    {
      "name": "llama-2-13b-chat-awq",
      "description": "Llama 2 13B Chat AWQ is an efficient, accurate and blazing-fast low-bit weight quantized Llama 2 variant."
    },
    {
      "name": "llama-2-7b-chat-hf-lora",
      "description": "This is a Llama2 base model that Cloudflare dedicated for inference with LoRA adapters. Llama 2 is a collection of pretrained and fine-tuned generative text models ranging in scale from 7 billion to 70 billion parameters. This is the repository for the 7B fine-tuned model, optimized for dialogue use cases and converted for the Hugging Face Transformers format."
    },
    {
      "name": "llama-3-8b-instruct",
      "description": "Generation over generation, Meta Llama 3 demonstrates state-of-the-art performance on a wide range of industry benchmarks and offers new capabilities, including improved reasoning."
    },
    {
      "name": "llamaguard-7b-awq",
      "description": "Llama Guard is a model for classifying the safety of LLM prompts and responses, using a taxonomy of safety risks."
    },
    {
      "name": "mistral-7b-instruct-v0.1-awq",
      "description": "Mistral 7B Instruct v0.1 AWQ is an efficient, accurate and blazing-fast low-bit weight quantized Mistral variant."
    },
    {
      "name": "mistral-7b-instruct-v0.2",
      "description": "The Mistral-7B-Instruct-v0.2 Large Language Model (LLM) is an instruct fine-tuned version of the Mistral-7B-v0.2. Mistral-7B-v0.2 has the following changes compared to Mistral-7B-v0.1: 32k context window (vs 8k context in v0.1), rope-theta = 1e6, and no Sliding-Window Attention."
    },
    {
      "name": "mistral-7b-instruct-v0.2-lora",
      "description": "The Mistral-7B-Instruct-v0.2 Large Language Model (LLM) is an instruct fine-tuned version of the Mistral-7B-v0.2."
    },
    {
      "name": "neural-chat-7b-v3-1-awq",
      "description": "This model is a fine-tuned 7B parameter LLM on the Intel Gaudi 2 processor from the mistralai/Mistral-7B-v0.1 on the open source dataset Open-Orca/SlimOrca."
    },
    {
      "name": "openchat-3.5-0106",
      "description": "OpenChat is an innovative library of open-source language models, fine-tuned with C-RLFT - a strategy inspired by offline reinforcement learning."
    },
    {
      "name": "openhermes-2.5-mistral-7b-awq",
      "description": "OpenHermes 2.5 Mistral 7B is a state of the art Mistral Fine-tune, a continuation of OpenHermes 2 model, which trained on additional code datasets."
    },
    {
      "name": "phi-2",
      "description": "Phi-2 is a Transformer-based model with a next-word prediction objective, trained on 1.4T tokens from multiple passes on a mixture of Synthetic and Web datasets for NLP and coding."
    },
    {
      "name": "qwen1.5-0.5b-chat",
      "description": "Qwen1.5 is the improved version of Qwen, the large language model series developed by Alibaba Cloud."
    },
    {
      "name": "qwen1.5-1.8b-chat",
      "description": "Qwen1.5 is the improved version of Qwen, the large language model series developed by Alibaba Cloud."
    },
    {
      "name": "qwen1.5-14b-chat-awq",
      "description": "Qwen1.5 is the improved version of Qwen, the large language model series developed by Alibaba Cloud. AWQ is an efficient, accurate and blazing-fast low-bit weight quantization method, currently supporting 4-bit quantization."
    },
    {
      "name": "qwen1.5-7b-chat-awq",
      "description": "Qwen1.5 is the improved version of Qwen, the large language model series developed by Alibaba Cloud. AWQ is an efficient, accurate and blazing-fast low-bit weight quantization method, currently supporting 4-bit quantization."
    },
    {
      "name": "sqlcoder-7b-2",
      "description": "This model is intended to be used by non-technical users to understand data inside their SQL databases."
    },
    {
      "name": "starling-lm-7b-beta",
      "description": "We introduce Starling-LM-7B-beta, an open large language model (LLM) trained by Reinforcement Learning from AI Feedback (RLAIF). Starling-LM-7B-beta is trained from Openchat-3.5-0106 with our new reward model Nexusflow/Starling-RM-34B and policy optimization method Fine-Tuning Language Models from Human Preferences (PPO)."
    },
    {
      "name": "tinyllama-1.1b-chat-v1.0",
      "description": "The TinyLlama project aims to pretrain a 1.1B Llama model on 3 trillion tokens. This is the chat model finetuned on top of TinyLlama/TinyLlama-1.1B-intermediate-step-1431k-3T."
    },
    {
      "name": "zephyr-7b-beta-awq",
      "description": "Zephyr 7B Beta AWQ is an efficient, accurate and blazing-fast low-bit weight quantized Zephyr model variant."
    }
  ]
  