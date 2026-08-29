#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/dbb882e8af68c288ecea4424f461da3140cce8828ccb26fd8dba10aadb128b65/contract';
import endContract from '../../snapshots/dbb882e8af68c288ecea4424f461da3140cce8828ccb26fd8dba10aadb128b65/contract.json' with { type: 'json' };
import {
  Migration,
  MigrationCLI,
  checkExpression,
  col,
  fn,
  lit,
  primaryKey,
} from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'category',
        columns: [
          col('iconUrl', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'item',
        columns: [
          col('categoryId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('depositAmount', 'float8', { codecRef: { codecId: 'pg/float8@1' } }),
          col('description', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('imageUrls', 'text[]', {
            notNull: true,
            codecRef: { codecId: 'pg/text@1', many: true },
          }),
          col('isTopAd', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('location', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('pricePerDay', 'float8', { notNull: true, codecRef: { codecId: 'pg/float8@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('AVAILABLE'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [
          primaryKey(['id']),
          checkExpression(
            'item_imageUrls_elem_not_null_1773196b',
            'array_position("imageUrls", NULL) IS NULL',
          ),
        ],
      }),
      this.createTable({
        schema: 'public',
        table: 'savedItem',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('itemId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'user',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isVerified', 'bool', {
            notNull: true,
            default: lit(false),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('phoneNumber', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'category',
        constraint: 'category_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'savedItem',
        constraint: 'savedItem_userId_itemId_key',
        columns: ['userId', 'itemId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'user',
        constraint: 'user_phoneNumber_key',
        columns: ['phoneNumber'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'item',
        index: 'item_categoryId_idx_15c304f2',
        columns: ['categoryId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'item',
        index: 'item_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'savedItem',
        index: 'savedItem_itemId_idx_41357140',
        columns: ['itemId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'savedItem',
        index: 'savedItem_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'item',
        foreignKey: {
          name: 'item_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'item',
        foreignKey: {
          name: 'item_categoryId_fkey',
          columns: ['categoryId'],
          references: { schema: 'public', table: 'category', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'savedItem',
        foreignKey: {
          name: 'savedItem_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'user', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'savedItem',
        foreignKey: {
          name: 'savedItem_itemId_fkey',
          columns: ['itemId'],
          references: { schema: 'public', table: 'item', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
