import {ChromaClient} from "chromadb";
import { GoogleGeminiEmbeddingFunction } from '@chroma-core/google-gemini';

const client = new ChromaClient({host: "localhost", port: 8000});

const getCollection = async (collectionName: string) => {
    const collection = await client.getOrCreateCollection({
        name: collectionName
    })

    return collection;
}

export default getCollection;