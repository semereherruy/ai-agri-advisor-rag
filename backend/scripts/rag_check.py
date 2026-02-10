import logging, os, json, pickle
import numpy as np
import faiss
import torch

from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from googletrans import Translator

# ---------------- CONFIG ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
VECTOR_DIR = os.path.join(DATA_DIR, "vectorstore")
CHUNKS_PATH = os.path.join(DATA_DIR, "chunks", "chunks.jsonl")

# ---------------- LOGGING ----------------
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rag")

# ---------------- LOAD DATA ----------------
chunk_texts = []
with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
    for line in f:
        chunk_texts.append(json.loads(line)["text"])

with open(os.path.join(VECTOR_DIR, "metadata.pkl"), "rb") as f:
    metadatas = pickle.load(f)

index = faiss.read_index(os.path.join(VECTOR_DIR, "faiss_index"))

logger.info(f"Loaded {len(chunk_texts)} chunks")

# ---------------- MODELS ----------------
embed_model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")
llm = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")
llm.eval()

translator = Translator()

# ---------------- HELPERS ----------------
def is_geez(text):
    return any('\u1200' <= c <= '\u137F' for c in text)

def to_en(text):
    return translator.translate(text, dest="en").text

def from_en(text):
    return translator.translate(text, dest="am").text

def retrieve(query, k=5):
    q_emb = embed_model.encode([query], convert_to_numpy=True).astype("float32")
    faiss.normalize_L2(q_emb)
    D, I = index.search(q_emb, k)

    results = []
    for idx in I[0]:
        if idx >= 0:
            results.append(chunk_texts[idx])
    return results

def build_prompt(contexts, question):
    ctx = "\n\n".join(contexts)
    return f"""
You are an agricultural advisor.
Use ONLY the context below.

CONTEXT:
{ctx}

QUESTION:
{question}

ANSWER:
"""

def answer_question(question, k=5):
    contexts = retrieve(question, k)
    if not contexts:
        return "No relevant documents found."

    prompt = build_prompt(contexts, question)
    inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=1024)

    with torch.no_grad():
        out = llm.generate(**inputs, max_new_tokens=200)

    return tokenizer.decode(out[0], skip_special_tokens=True)

# ---------------- FASTAPI ----------------
app = FastAPI()

class AskReq(BaseModel):
    question: str
    k: int = 5

@app.post("/ask")
def ask(req: AskReq):
    q = req.question
    am = False

    if is_geez(q):
        q = to_en(q)
        am = True

    ans = answer_question(q, req.k)

    if am:
        ans = from_en(ans)

    return {"answer": ans}

@app.get("/health")
def health():
    return {"status": "ok"}