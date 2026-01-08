import { IDriver, Query, Data } from '../interfaces/IDriver';

/**
 * MemoryDriver: A simple in-memory database driver for testing.
 * Supports shared data (Pooling) via references.
 */
export class MemoryDriver implements IDriver {
  private data: Data[];
  private idCounter: { value: number };
  private connected: boolean = false;
  private collectionName: string;
  dbType: 'nosql' = 'nosql';

  constructor(options: any = {}) {
    this.collectionName = options.collectionName || 'default';
    this.data = options.data || [];
    this.idCounter = options.idCounter || { value: 1 };
  }

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
  }

  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Returns a new instance for a different collection while sharing the same data array.
   */
  table(name: string): IDriver {
    const newDriver = new MemoryDriver({
      collectionName: name,
      data: this.data,
      idCounter: this.idCounter
    });
    newDriver.connected = this.connected;
    return newDriver;
  }

  async set(data: Data): Promise<Data> {
    const record = {
      _id: this.idCounter.value++,
      ...data,
      __col__: this.collectionName,
      _createdAt: new Date().toISOString(),
    };
    this.data.push(record);
    return record;
  }

  async get(query: Query): Promise<Data[]> {
    return this.data.filter(r => r.__col__ === this.collectionName && this.matches(r, query));
  }

  async getOne(query: Query): Promise<Data | null> {
    const record = this.data.find(r => r.__col__ === this.collectionName && this.matches(r, query));
    return record || null;
  }

  async update(query: Query, data: Data): Promise<number> {
    let count = 0;
    this.data.forEach((r, i) => {
      if (r.__col__ === this.collectionName && this.matches(r, query)) {
        count++;
        this.data[i] = { ...r, ...data, _updatedAt: new Date().toISOString() };
      }
    });
    return count;
  }

  async delete(query: Query): Promise<number> {
    const initialLen = this.data.length;
    this.data = this.data.filter(r => !(r.__col__ === this.collectionName && this.matches(r, query)));
    return initialLen - this.data.length;
  }

  async exists(query: Query): Promise<boolean> {
    return this.data.some(r => r.__col__ === this.collectionName && this.matches(r, query));
  }

  async count(query: Query): Promise<number> {
    return this.get(query).then(res => res.length);
  }

  private matches(record: Data, query: Query): boolean {
    if (Object.keys(query).length === 0) return true;
    return Object.keys(query).every(key => {
      const qVal = query[key];
      const rVal = record[key];
      if (typeof qVal === 'object' && qVal !== null && typeof rVal === 'object' && rVal !== null) {
        return this.matches(rVal, qVal);
      }
      return rVal === qVal;
    });
  }

  async clear(): Promise<void> {
    this.data = this.data.filter(r => r.__col__ !== this.collectionName);
  }
}
