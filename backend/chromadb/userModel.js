const { ChromaClient } = require("chromadb");
const axios = require('axios');
const config = require('./config'); // Configuration for API keys and other constants

// Initialize ChromaDB client
const client = new ChromaClient();

// Helper function to get or create a collection for user embeddings
async function getUserCollection() {
    return await client.getOrCreateCollection({
        name: "userEmbeddings",
        embeddingFunction: "OpenAIEmbeddingFunction", // Placeholder
        metadata: { "hnsw:space": "cosine" }
    });
}

// Function to generate embeddings from OpenAI's API
async function generateEmbedding(content) {
    const url = "https://api.openai.com/v1/embeddings";
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${config.openaiApiKey}`
    };
    const data = {
        input: content,
        model: "text-embedding-3-small"
    };

    try {
        const response = await axios.post(url, data, { headers });
        if (response.data && response.data.data && response.data.data.length > 0) {
            return response.data.data[0].embedding; // Extract the embedding array
        } else {
            console.error("No embedding received:", response.data);
            return null;
        }
    } catch (error) {
        console.error('Error generating embedding:', error);
        return null;
    }
}

// Add a new user embedding
async function addUserEmbedding(userId, content) {
    const collection = await getUserCollection();
    const embedding = await generateEmbedding(content);
    console.log("Generated Embedding: ", embedding);
    return await collection.add({
        ids: [userId.toString()],
        embeddings: [embedding],
        documents: [content],  // Optionally store the user profile content or metadata
        metadatas: [{ userId }]
    });
}

// Get an existing user embedding
async function getUserEmbedding(userId) {
    const collection = await getUserCollection();
    const result = await collection.query({
        ids: [userId.toString()]
    });
    return result.data; // or adjust depending on how data is structured in your response
}

// Update an existing user embedding
async function updateUserEmbedding(userId, content) {
    const collection = await getUserCollection();
    await deleteUserEmbedding(userId);  // Remove old embedding
    return await addUserEmbedding(userId, content);  // Add updated embedding
}

// Delete a user embedding
async function deleteUserEmbedding(userId) {
    const collection = await getUserCollection();
    return await collection.remove({
        ids: [userId.toString()]
    });
}

// Search for similar users by content
async function searchUsers(queryContent, topK = 5) {
    const collection = await getUserCollection();
    const queryEmbedding = await generateEmbedding(queryContent);
    const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: topK
    });
    return results;
}

module.exports = {
    addUserEmbedding,
    updateUserEmbedding,
    deleteUserEmbedding,
    searchUsers,
    getUserEmbedding,
    generateEmbedding
};
