import { MongoClient } from "mongodb";

class DBClient {
    constructor() {
        this.host = process.env.DB_HOST || "localhost";
        this.port = process.env.DB_PORT || 27017;
        this.database = process.env.DB_DATABASE || "files_manager";
        this.client = new MongoClient(
            `mongodb://${this.host}:${this.port}/${this.database}`
        );
    }

    async isAlive() {
        try {
            await this.client.ping();
            return true;
        } catch (err) {
            return false;
        }
    }

    async nbUsers() {
        const collection = this.client.collection("users");
        return collection.countDocuments();
    }

    async nbFiles() {
        const collection = this.client.collection("files");
        return collection.countDocuments();
    }
}

const dbClient = new DBClient();
export default dbClient;
