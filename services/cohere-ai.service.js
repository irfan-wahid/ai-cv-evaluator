import { CohereClient } from 'cohere-ai';
import 'dotenv/config'

const cohere = new CohereClient({ apiKey: process.env.COHERE_API_KEY });

class CohereService {
    generateText = async(prompt) => {
        try {
            const response = await cohere.chat({
            model: "command-a-03-2025",
            message: prompt,
            temperature: 0
        });
        return response.text;
        } catch (error) {
            throw new Error(error.message || "Cohere API error");
        }
    }

    generateEmbedding = async(text) => {
        const response = await cohere.embed({
            model: "embed-english-v2.0",
            texts: [text]
        })

        return response.embeddings[0];
    }
}

export default new CohereService();