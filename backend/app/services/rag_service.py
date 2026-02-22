from app.core.llm_client import generate_embedding, generate_chat_response
from app.core.pinecone_client import index
from app.core.llm_client import stream_chat_response
from app.core.logger import logger
import time


TOP_K = 7


def retrieve_context(query: str):
    start = time.time()
    query_embedding = generate_embedding(query)

    results = index.query(
        vector=query_embedding,
        top_k=TOP_K,
        include_metadata=True
    )

    latency = time.time() - start

    contexts = []
    sources = set()

    for match in results["matches"]:
        metadata = match["metadata"]

        text = metadata.get("text", "")
        title = metadata.get("title", "Unknown")
        contexts.append(text)
        sources.add(title)
    
    logger.info(
    f"[RAG] query='{query}' retrieved={len(results['matches'])} latency={latency:.2f}s")
    return contexts, list(sources)


def build_prompt(question: str, contexts: list[str], mode: str, history: list[dict] = None):

    style_instruction = (
        "Give concise exam-focused explanations."
        if mode == "study"
        else "Explain clearly and conversationally."
    )

    context_block = "\n\n".join(contexts)
    
    # Format conversation history if available
    history_block = ""
    if history and len(history) > 0:
        history_block = "\n\nPrevious conversation:\n"
        for msg in history[-5:]:  # Include last 5 messages to manage context window
            history_block += f"User: {msg['user']}\nAssistant: {msg['assistant']}\n\n"

    prompt = f"""
You are an AI learning assistant.

{style_instruction}

Answer ONLY using the provided context.
If the answer is not in the context, say you don't know.

{history_block}
Context from documents:
{context_block}

Current Question:
{question}

Answer:
"""
    return prompt


def rag_chat(question: str, mode: str):

    contexts,sources = retrieve_context(question)

    prompt = build_prompt(question, contexts, mode)

    answer = generate_chat_response(prompt)

    return {
        "answer": answer,
        "retrieved_chunks": len(contexts),
        "sources": sources
    }

def rag_chat_stream(question: str, mode: str, history: list[dict] = None, session_id: str = None):

    contexts, sources = retrieve_context(question)
    prompt = build_prompt(question, contexts, mode, history=history)

    return stream_chat_response(prompt, sources=sources)