import { Hawiah } from './Hawiah';
import { Schema, SchemaDefinition } from './Schema';
import { IDriver } from './interfaces/IDriver';

/**
 * A specialized Hawiah class designed for Next.js environments.
 * Implements a singleton pattern (HMR-safe) to prevent multiple database connections during development.
 */
export class HawiahNext extends Hawiah {
    /**
     * Creates a new instance that persists across Hot Module Replacements.
     * @param options Configuration options
     */
    constructor(options: {
        driver: IDriver | (new (config: any) => IDriver),
        config?: any,
        schema?: Schema | SchemaDefinition
    }) {
        const config = options.config || {};

        const driverName = typeof options.driver === 'function' ? options.driver.name : (options.driver.constructor?.name || 'Unknown');
        const tableName = config.collectionName || config.tableName || config.collection || config.table || 'default';
        const instanceKey = `HAWIAH_INST_${driverName}_${tableName}_${Hawiah.getPoolKey(options.driver, config)}`;

        const g = globalThis as any;
        const pool = g.__HAWIAH_INSTANCES__ || (g.__HAWIAH_INSTANCES__ = new Map());

        if (pool.has(instanceKey)) {
            const existing = pool.get(instanceKey) as HawiahNext;

            if (options.schema) {
                const newSchema = options.schema instanceof Schema ? options.schema : new Schema(options.schema);
                (existing as any).schema = newSchema;
                if ((existing as any).driver.setSchema) {
                    (existing as any).driver.setSchema(newSchema);
                }
            }

            return existing as any;
        }

        super(options);
        pool.set(instanceKey, this);
    }

    /**
     * Creates a request-scoped instance sharing the same underlying connection.
     * Useful for isolation in Server Components.
     * @param name Table or Collection name
     * @param schema Optional schema override
     */
    table(name: string, schema?: Schema | SchemaDefinition): Hawiah {
        return new Hawiah({
            driver: this.driver.table ? this.driver.table(name) : this.driver,
            schema: schema || this.schema
        });
    }
}
