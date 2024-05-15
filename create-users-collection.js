const { MongoClient } = require("mongodb");

async function main() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const database = client.db("mydatabase");
        await database.createCollection("users");
        console.log("Users collection created");
    } finally {
        await client.close();
    }
}

main().catch(console.error);
