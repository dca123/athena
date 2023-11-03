'use server';

import { db } from '@/lib/db';
import { dataProducts, dataProductsToDataProducts } from '@/lib/schema';
import { FormSchema } from './AddDataProduct';
import type { Connection, Edge, Node } from 'reactflow';
import { and, eq, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function handleAddDataProduct(data: FormSchema) {
  const dataProduct = await db
    .insert(dataProducts)
    .values(data)
    .returning({ id: dataProducts.id });
  revalidatePath('/');
  return dataProduct[0].id;
}

export async function handleAddDataProductToDataProduct(data: Connection) {
  if (data.source === null || data.target === null) {
    console.error('Source or target is null');
    return;
  }
  await db.insert(dataProductsToDataProducts).values({
    sourceId: parseInt(data.source),
    targetId: parseInt(data.target),
  });
  revalidatePath('/');
}

export async function handleRemoveDataProductToDataProduct(
  edges: Pick<Edge, 'source' | 'target'>[],
) {
  await db
    .delete(dataProductsToDataProducts)
    .where(
      or(
        ...edges.map((e) =>
          and(
            eq(dataProductsToDataProducts.sourceId, parseInt(e.source)),
            eq(dataProductsToDataProducts.targetId, parseInt(e.target)),
          ),
        ),
      ),
    );
  revalidatePath('/');
}

export async function handleRemoveDataProducts(nodes: Pick<Node, 'id'>[]) {
  await db
    .delete(dataProducts)
    .where(or(...nodes.map((n) => eq(dataProducts.id, parseInt(n.id)))));
  revalidatePath('/');
}
