# @hawiah/core [![NPM version](https://img.shields.io/npm/v/@hawiah/core.svg?style=flat-square&color=informational)](https://npmjs.com/package/@hawiah/core)

Core package for Hawiah - Schema-less database abstraction layer with multiple driver support, relationships, and DataLoader batching.

> **Note:** This is the core package. For the main package, install `hawiah` instead.

## Installation

```bash
# Install core package only
npm install @hawiah/core

# Or install the main package
npm install hawiah
```

## Features

- 🚀 Lightweight and fast
- 🔌 Multiple database driver support
- 🔗 Built-in relationships with DataLoader batching
- 📦 Schema-less design
- 🎯 Simple and intuitive API
- 🔄 Automatic N+1 query optimization
- 💾 Memory driver included

## Quick Start

```typescript
import { Hawiah, MemoryDriver } from '@hawiah/core';
const db = new Hawiah({ driver: new MemoryDriver() });
```

## API Methods

### Basic Operations
- `insert(data)` - Insert a record
- `insertMany(dataArray)` - Insert multiple records
- `get(query, limit?)` - Get records matching query
- `getOne(query)` - Get single record
- `getAll()` - Get all records
- `update(query, data)` - Update records
- `remove(query)` - Remove records
- `clear()` - Clear all records

### Query Operations
- `getById(id)` - Get record by ID
- `getBy(field, value)` - Get records by field value
- `has(query)` - Check if records exist
- `count(query)` - Count matching records
- `sort(query, field, direction)` - Sort results
- `select(query, fields)` - Select specific fields
- `paginate(query, page, pageSize)` - Paginate results

### Array Operations
- `push(query, field, value)` - Add to array
- `pull(query, field, value)` - Remove from array
- `shift(query, field)` - Remove first element
- `unshift(query, field, value)` - Add to beginning
- `pop(query, field)` - Remove last element

### Numeric Operations
- `increment(query, field, amount)` - Increment field
- `decrement(query, field, amount)` - Decrement field
- `sum(field, query)` - Sum field values

### Relationships

```typescript
// Define relationships
const users = new Hawiah({ driver: new MemoryDriver() });
const posts = new Hawiah({ driver: new MemoryDriver() });

users.relation('posts', posts, '_id', 'userId', 'many');
posts.relation('author', users, 'userId', '_id', 'one');

// Query with relationships
const usersWithPosts = await users.getWith({}, 'posts');
```

## Custom Drivers

Implement the `IDriver` interface to create custom drivers:

```typescript
import { IDriver, Query, Data } from '@hawiah/core';

class MyDriver implements IDriver {
  async connect(): Promise<void> { /* ... */ }
  async disconnect(): Promise<void> { /* ... */ }
  async get(query: Query): Promise<Data[]> { /* ... */ }
  async getOne(query: Query): Promise<Data | null> { /* ... */ }
  async set(data: Data): Promise<Data> { /* ... */ }
  async update(query: Query, data: Data): Promise<number> { /* ... */ }
  async delete(query: Query): Promise<number> { /* ... */ }
  async exists(query: Query): Promise<boolean> { /* ... */ }
  async count(query: Query): Promise<number> { /* ... */ }
}
```

## License
MIT