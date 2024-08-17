# EthosAI API Documentation

Welcome to the EthosAI API! This API provides endpoints for managing AI model evaluations, generating text using LLM providers, and retrieving data related to models, evaluations, and reports. Below you'll find detailed information on how to use the various endpoints.

## Table of Contents
- [Environment Variables](#environment-variables)
- [Endpoints](#endpoints)
  - [GET /](#get-)
  - [GET /reference](#get-reference)
  - [GET /generateEmbedding](#get-generateembedding)
  - [POST /evaluate](#post-evaluate)
  - [POST /evaluateBatch](#post-evaluatebatch)
  - [POST /evaluateBatchCSV](#post-evaluatebatchcsv)
  - [POST /generate-text](#post-generate-text)
  - [GET /evaluations/:id](#get-evaluationsid)
  - [GET /reports/:id](#get-reportsid)
  - [GET /models](#get-models)
  - [GET /evaluations](#get-evaluations)
  - [GET /reports](#get-reports)
- [Error Handling](#error-handling)
- [Utility Functions](#utility-functions)

## Environment Variables

The API requires the following environment variables:

- `DATABASE_URL`: The connection string for the database.
- `NODE_ENV`: The environment in which the API is running (`development`, `production`, etc.).
- `OPENAI_API_KEY`: The API key for accessing the OpenAI API.

## Endpoints

### GET /

**Description**: Returns a welcome message to verify that the API is running.

**Example Request:**

- **cURL:**
    ```bash
    curl -X GET http://localhost:3000/
    ```

- **Python:**
    ```python
    import requests

    response = requests.get("http://localhost:3000/")
    print(response.json())
    ```

- **TypeScript (fetch):**
    ```typescript
    const response = await fetch("http://localhost:3000/");
    const data = await response.json();
    console.log(data);
    ```

**Example Response:**

```json
{
  "message": "Welcome to EthosAI API!"
}
```

### GET /reference

**Description**: Provides API reference documentation based on an OpenAPI specification.

**Example Request:**

- **cURL:**
    ```bash
    curl -X GET http://localhost:3000/reference
    ```

- **Python:**
    ```python
    import requests

    response = requests.get("http://localhost:3000/reference")
    print(response.text)
    ```

- **TypeScript (fetch):**
    ```typescript
    const response = await fetch("http://localhost:3000/reference");
    const data = await response.text();
    console.log(data);
    ```

### GET /generateEmbedding

**Description**: Generates an embedding for the provided prompt using OpenAI.

**Query Parameters:**
- `prompt` (string): The text to generate an embedding for.

**Example Request:**

- **cURL:**
    ```bash
    curl -X GET "http://localhost:3000/generateEmbedding?prompt=Hello%20world"
    ```

- **Python:**
    ```python
    import requests

    response = requests.get("http://localhost:3000/generateEmbedding", params={"prompt": "Hello world"})
    print(response.json())
    ```

- **TypeScript (fetch):**
    ```typescript
    const response = await fetch("http://localhost:3000/generateEmbedding?prompt=Hello%20world");
    const data = await response.json();
    console.log(data);
    ```

**Example Response:**

```json
{
  "embedding": [/* embedding array */]
}
```

### POST /evaluate

**Description**: Evaluates a question using a specified model and returns the evaluation result.

**Request Body:**
- `modelId` (number): The ID of the model to use.
- `questionId` (number): The ID of the question to evaluate.

**Example Request:**

- **cURL:**
    ```bash
    curl -X POST http://localhost:3000/evaluate \
      -H 'Content-Type: application/json' \
      -d '{"modelId": 1, "questionId": 2}'
    ```

- **Python:**
    ```python
    import requests

    response = requests.post(
        "http://localhost:3000/evaluate",
        json={"modelId": 1, "questionId": 2}
    )
    print(response.json())
    ```

- **TypeScript (fetch):**
    ```typescript
    const response = await fetch("http://localhost:3000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId: 1, questionId: 2 })
    });
    const data = await response.json();
    console.log(data);
    ```

**Example Response:**

```json
{
  "question": "What is AI?",
  "answer": "Artificial Intelligence",
  "generated": "AI stands for Artificial Intelligence...",
  "similarity": 0.95,
  "evaluationId": 1
}
```

### POST /evaluateBatch

**Description**: Evaluates a batch of questions using a specified model.

**Request Body:**
- `modelId` (number): The ID of the model to use.
- `questionIds` (array of numbers): An array of question IDs to evaluate.

**Example Request:**

- **cURL:**
    ```bash
    curl -X POST http://localhost:3000/evaluateBatch \
      -H 'Content-Type: application/json' \
      -d '{"modelId": 1, "questionIds": [1, 2, 3]}'
    ```

- **Python:**
    ```python
    import requests

    response = requests.post(
        "http://localhost:3000/evaluateBatch",
        json={"modelId": 1, "questionIds": [1, 2, 3]}
    )
    print(response.json())
    ```

- **TypeScript (fetch):**
    ```typescript
    const response = await fetch("http://localhost:3000/evaluateBatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId: 1, questionIds: [1, 2, 3] })
    });
    const data = await response.json();
    console.log(data);
    ```

**Example Response:**

```json
[
  {
    "question": "What is AI?",
    "answer": "Artificial Intelligence",
    "generated": "AI stands for Artificial Intelligence...",
    "similarity": 0.95,
    "evaluationId": 1
  },
  // More evaluations
]
```

### POST /evaluateBatchCSV

**Description**: Uploads a CSV file of questions and evaluates them using a specified model.

**Request Body:**
- `file` (file): The CSV file containing questions to evaluate.
- `modelId` (string): The ID of the model to use.

**Example Request:**

- **cURL:**
    ```bash
    curl -X POST http://localhost:3000/evaluateBatchCSV \
      -F 'file=@questions.csv' \
      -F 'modelId=1'
    ```

- **Python:**
    ```python
    import requests

    with open('questions.csv', 'rb') as f:
        response = requests.post(
            "http://localhost:3000/evaluateBatchCSV",
            files={'file': f},
            data={'modelId': '1'}
        )
    print(response.json())
    ```

- **TypeScript (fetch with FormData):**
    ```typescript
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('modelId', '1');

    const response = await fetch("http://localhost:3000/evaluateBatchCSV", {
        method: "POST",
        body: formData
    });
    const data = await response.json();
    console.log(data);
    ```

**Example Response:**

```json
[
  {
    "question": "What is AI?",
    "answer": "Artificial Intelligence",
    "generated": "AI stands for Artificial Intelligence...",
    "similarity": 0.95,
    "evaluationId": 1
  },
  // More evaluations
]
```

### POST /generate-text

**Description**: Generates text based on a prompt using a specified model.

**Request Body:**
- `prompt` (string): The text prompt to generate text from.
- `modelId` (number): The ID of the model to use.
- `temperature` (number, optional): The creativity level of the generated text (0-1).

**Example Request:**

- **cURL:**
    ```bash
    curl -X POST http://localhost:3000/generate-text \
      -H 'Content-Type: application/json' \
      -d '{"prompt": "Once upon a time", "modelId": 1, "temperature": 0.7}'
    ```

- **Python:**
    ```python
    import requests

    response = requests.post(
        "http://localhost:3000/generate-text",
        json={"prompt": "Once upon a time", "modelId": 1, "temperature": 0.7}
    )
    print(response.json())
    ```

- **TypeScript (fetch):**
   

 ```typescript
    const response = await fetch("http://localhost:3000/generate-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: "Once upon a time", modelId: 1, temperature: 0.7 })
    });
    const data = await response.json();
    console.log(data);
    ```

**Example Response:**

```json
{
  "generatedText": "Once upon a time in a faraway land...",
  "usage": {
    "prompt_tokens": 5,
    "completion_tokens": 20,
    "total_tokens": 25
  }
}
```

### GET /evaluations/:id

**Description**: Retrieves a specific evaluation by its ID.

**Path Parameters:**
- `id` (number): The ID of the evaluation to retrieve.

**Example Request:**

- **cURL:**
    ```bash
    curl -X GET http://localhost:3000/evaluations/1
    ```

- **Python:**
    ```python
    import requests

    response = requests.get("http://localhost:3000/evaluations/1")
    print(response.json())
    ```

- **TypeScript (fetch):**
    ```typescript
    const response = await fetch("http://localhost:3000/evaluations/1");
    const data = await response.json();
    console.log(data);
    ```

**Example Response:**

```json
{
  "evaluationId": 1,
  "modelId": 1,
  "questionId": 2,
  "output": "AI stands for Artificial Intelligence...",
  "score": 0.95,
  "createdAt": "2024-08-09T12:34:56Z"
}
```

### GET /reports/:id

**Description**: Retrieves a specific report by its ID.

**Path Parameters:**
- `id` (number): The ID of the report to retrieve.

**Example Request:**

- **cURL:**
    ```bash
    curl -X GET http://localhost:3000/reports/1
    ```

- **Python:**
    ```python
    import requests

    response = requests.get("http://localhost:3000/reports/1")
    print(response.json())
    ```

- **TypeScript (fetch):**
    ```typescript
    const response = await fetch("http://localhost:3000/reports/1");
    const data = await response.json();
    console.log(data);
    ```

**Example Response:**

```json
{
  "reportId": 1,
  "content": "This is the report content.",
  "createdAt": "2024-08-09T12:34:56Z"
}
```

### GET /models

**Description**: Retrieves a list of all available models.

**Example Request:**

- **cURL:**
    ```bash
    curl -X GET http://localhost:3000/models
    ```

- **Python:**
    ```python
    import requests

    response = requests.get("http://localhost:3000/models")
    print(response.json())
    ```

- **TypeScript (fetch):**
    ```typescript
    const response = await fetch("http://localhost:3000/models");
    const data = await response.json();
    console.log(data);
    ```

**Example Response:**

```json
[
  {
    "id": 1,
    "name": "gpt-3.5-turbo",
    "description": "OpenAI's GPT-3.5 model",
    "createdAt": "2024-08-09T12:34:56Z"
  },
  // More models
]
```

### GET /evaluations

**Description**: Retrieves a list of all evaluations.

**Example Request:**

- **cURL:**
    ```bash
    curl -X GET http://localhost:3000/evaluations
    ```

- **Python:**
    ```python
    import requests

    response = requests.get("http://localhost:3000/evaluations")
    print(response.json())
    ```

- **TypeScript (fetch):**
    ```typescript
    const response = await fetch("http://localhost:3000/evaluations");
    const data = await response.json();
    console.log(data);
    ```

**Example Response:**

```json
[
  {
    "evaluationId": 1,
    "modelId": 1,
    "questionId": 2,
    "output": "AI stands for Artificial Intelligence...",
    "score": 0.95,
    "createdAt": "2024-08-09T12:34:56Z"
  },
  // More evaluations
]
```

### GET /reports

**Description**: Retrieves a list of all reports.

**Example Request:**

- **cURL:**
    ```bash
    curl -X GET http://localhost:3000/reports
    ```

- **Python:**
    ```python
    import requests

    response = requests.get("http://localhost:3000/reports")
    print(response.json())
    ```

- **TypeScript (fetch):**
    ```typescript
    const response = await fetch("http://localhost:3000/reports");
    const data = await response.json();
    console.log(data);
    ```
