const { ChromaClient } = require("chromadb");
const axios = require('axios');
const config = require('./config'); // Configuration for API keys and other constants

// Initialize ChromaDB client
const client = new ChromaClient();

// Helper function to get or create a collection for post embeddings
async function getPostCollection() {
    return await client.getOrCreateCollection({
        name: "postEmbeddings",
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

// Add a new post embedding
async function addPostEmbedding(postId, content) {
    const collection = await getPostCollection();
    const embedding = await generateEmbedding(content);
    console.log("Generated Embedding: ", embedding);
    return await collection.add({
        ids: [postId.toString()],
        embeddings: [embedding],
        documents: [content],  // Optionally store the post content or metadata
        metadatas: [{ postId }]
    });
}

// Get an existing post embedding
async function getPostEmbedding(postId) {
    const collection = await getPostCollection();
    const result = await collection.query({
        ids: [postId.toString()]
    });
    return result.data; // or adjust depending on how data is structured in your response
}

// Update an existing post embedding
async function updatePostEmbedding(postId, content) {
    const collection = await getPostCollection();
    await deletePostEmbedding(postId);  // Remove old embedding
    return await addPostEmbedding(postId, content);  // Add updated embedding
}

// Delete a post embedding
async function deletePostEmbedding(postId) {
    const collection = await getPostCollection();
    return await collection.remove({
        ids: [postId.toString()]
    });
}

// Search for similar posts by content
async function searchPosts(queryContent, topK = 5) {
    try {
        const collection = await getPostCollection();
        const queryEmbedding = await generateEmbedding(queryContent);
        const results = await collection.query({
            queryEmbeddings: [queryEmbedding],
            nResults: topK
        });
        return results || [];  // Ensure an array is returned
    } catch (error) {
        console.error('Error searching posts:', error);
        return [];  // Return an empty array on error
    }
}


module.exports = {
    addPostEmbedding,
    updatePostEmbedding,
    deletePostEmbedding,
    searchPosts,
    getPostEmbedding,
    generateEmbedding
};