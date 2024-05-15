// utils/db.js
const { MongoClient } = require("mongodb");

class DBClient {
    constructor() {
        this.host = process.env.DB_HOST || "localhost";
        this.port = process.env.DB_PORT || 27017;
        this.database = process.env.DB_DATABASE || "files_manager";
        this.client = new MongoClient(`mongodb://${this.host}:${this.port}/`, {
            useUnifiedTopology: true,
        });
    }

    async isAlive() {
        try {
            await this.client.connect();
            return true;
        } catch (error) {
            return false;
        }
    }

    async collection(name) {
        if (!this.client.isConnected()) {
            await this.client.connect();
        }
        const db = this.client.db(this.database);
        return db.collection(name);
    }
}

const dbClient = new DBClient();

module.exports = dbClient;
