'use server';

import { db } from '@/lib/db';
import { dataProducts } from '@/lib/schema';
import { FormSchema } from './AddDataProduct';

export async function handleAddDataProduct(data: FormSchema) {
  await db.insert(dataProducts).values(data);
}
