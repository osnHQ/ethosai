# Experiments for eval generation

To run, follow the instructions below:

- make .env file with the content from env.example

- ensure rye is installed:

`curl -sSf https://rye.astral.sh/get | bash`

- then proceed with the following:

```
git clone https://github.com/osnHQ/ethosai

cd ethosai/services/experiments

rye sync

. .venv/bin/activate

cd src

streamlit run main.py
```

voila!
