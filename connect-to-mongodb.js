const { MongoClient } = require("mongodb");

async function main() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        // Call functions to create collections or perform other operations
    } finally {
        await client.close();
    }
}

main().catch(console.error);
