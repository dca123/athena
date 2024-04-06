import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, serial, text } from 'drizzle-orm/pg-core';

export const dataProductTags = pgTable('dataProductTags', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const dataProductsToTags = pgTable(
  'dataProductsToTags',
  {
    dataProductId: serial('dataProductId')
      .notNull()
      .references(() => dataProducts.id),
    tagId: serial('tagId')
      .notNull()
      .references(() => dataProductTags.id),
  },
  (t) => ({
    pk: primaryKey(t.dataProductId, t.tagId),
  }),
);

export const dataProductTagsRelations = relations(
  dataProductsToTags,
  ({ one }) => ({
    dataProduct: one(dataProducts, {
      fields: [dataProductsToTags.dataProductId],
      references: [dataProducts.id],
    }),
    tag: one(dataProductTags, {
      fields: [dataProductsToTags.tagId],
      references: [dataProductTags.id],
    }),
  }),
);

export const dataProducts = pgTable('dataProducts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  owners: text('owners').array().notNull(),
  organizationId: text('organizationId').notNull(),
});
export type DataProduct = typeof dataProducts.$inferSelect;

export const dataProductRelations = relations(dataProducts, ({ many }) => ({
  tagRelations: many(dataProductsToTags),
  sourceRelations: many(dataProductsToDataProducts, { relationName: 'target' }),
  targetRelations: many(dataProductsToDataProducts, { relationName: 'source' }),
}));

export const dataProductsToDataProducts = pgTable(
  'dataProductsToDataProducts',
  {
    sourceId: serial('sourceId')
      .notNull()
      .references(() => dataProducts.id),
    targetId: serial('targetId')
      .notNull()
      .references(() => dataProducts.id),
  },
  (t) => ({
    pk: primaryKey(t.sourceId, t.targetId),
  }),
);
export type DataProductsToDataProducts =
  typeof dataProductsToDataProducts.$inferSelect;

export const dataProductToDataProductRelations = relations(
  dataProductsToDataProducts,
  ({ one }) => ({
    source: one(dataProducts, {
      fields: [dataProductsToDataProducts.sourceId],
      references: [dataProducts.id],
      relationName: 'source',
    }),
    target: one(dataProducts, {
      fields: [dataProductsToDataProducts.targetId],
      references: [dataProducts.id],
      relationName: 'target',
    }),
  }),
);
