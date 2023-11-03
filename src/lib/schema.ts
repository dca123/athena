import { relations } from 'drizzle-orm';
import { pgTable, primaryKey, serial, text } from 'drizzle-orm/pg-core';

export const dataProducts = pgTable('dataProducts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
});
export type DataProduct = typeof dataProducts.$inferSelect;

export const dataProductRelations = relations(dataProducts, ({ many }) => ({
  source: many(dataProducts),
  target: many(dataProducts),
}));

export const dataProductsToDataProducts = pgTable(
  'dataProductsToDataProducts',
  {
    sourceId: serial('sourceId'),
    targetId: serial('targetId'),
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
    }),
    target: one(dataProducts, {
      fields: [dataProductsToDataProducts.targetId],
      references: [dataProducts.id],
    }),
  }),
);
