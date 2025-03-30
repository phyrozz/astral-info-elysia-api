import { Pool, PoolClient } from 'pg';

export class PostgresDBHelper {
    private pool: Pool;
    private user: string;
    private host: string;
    private database: string;
    private password: string;
    private port: number;

    constructor() {
        this.user = process.env.DB_USERNAME!,
        this.host = process.env.DB_HOSTNAME!,
        this.database = process.env.DB_NAME!,
        this.password = process.env.DB_PASSWORD!,
        this.port = parseInt(process.env.DB_PORT!)

        this.pool = new Pool({
            user: this.user,
            host: this.host,
            database: this.database,
            password: this.password,
            port: this.port
        });
    }

    // Get a client from the pool
    async getClient(): Promise<PoolClient> {
        return await this.pool.connect();
    }

    // Execute a single query
    async query(text: string, params?: any[]) {
        const client = await this.getClient();
        try {
            return await client.query(text, params);
        } finally {
            client.release();
        }
    }

    // Execute multiple queries in a transaction
    async executeTransaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
        const client = await this.getClient();
        try {
            await client.query('BEGIN');
            const result = await callback(client);
            await client.query('COMMIT');
            return result;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Close the pool
    async close() {
        await this.pool.end();
    }
}
