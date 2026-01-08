/**
 * Query interface for filtering and selecting data
 */
export interface Query {
  [key: string]: any;
}

/**
 * Generic data interface representing a database record
 */
export interface Data {
  [key: string]: any;
}

/**
 * The standard interface that all database drivers must implement.
 * Supports connection pooling, CRUD operations, and schema validation.
 */
export interface IDriver {
  /**
   * The type of database (sql or nosql).
   */
  dbType?: 'sql' | 'nosql';

  /**
   * Establishes a connection to the database.
   */
  connect(): Promise<void>;

  /**
   * Closes the database connection.
   */
  disconnect(): Promise<void>;

  /**
   * Checks if the driver is currently connected.
   */
  isConnected?(): boolean;

  /**
   * Creates a new driver instance for a specific table/collection, sharing the same connection.
   * @param name The name of the table or collection
   */
  table?(name: string): IDriver;

  /**
   * Inserts a new record into the database.
   * @param data The data to insert
   */
  set(data: Data): Promise<Data>;

  /**
   * Retrieves records matching the query.
   * @param query Filter criteria
   */
  get(query: Query): Promise<Data[]>;

  /**
   * Updates records matching the query.
   * @param query Filter criteria
   * @param data Data to update
   */
  update(query: Query, data: Data): Promise<number>;

  /**
   * Deletes records matching the query.
   * @param query Filter criteria
   */
  delete(query: Query): Promise<number>;

  /**
   * Retrieves a single record matching the query.
   * @param query Filter criteria
   */
  getOne(query: Query): Promise<Data | null>;

  /**
   * Checks if any record matches the query.
   * @param query Filter criteria
   */
  exists(query: Query): Promise<boolean>;

  /**
   * Counts the number of records matching the query.
   * @param query Filter criteria
   */
  count(query: Query): Promise<number>;

  /**
   * Sets the schema for the driver (optional support).
   * @param schema The schema definition
   */
  setSchema?(schema: any): void;
}
