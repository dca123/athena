'use client';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import * as z from 'zod';
import { useController, useForm, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Position } from 'reactflow';
import { useDataProductsStore } from './store';
import { useState } from 'react';
import { handleAddDataProduct } from './actions';

const FormSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(5),
  owners: z.array(z.string()).min(1),
});
export type FormSchema = z.infer<typeof FormSchema>;

export function AddDataProductButton() {
  const addNode = useDataProductsStore((s) => s.addNode);
  const [open, setOpen] = useState(false);

  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      description: '',
      owners: [''],
    },
  });

  async function handleSubmit(data: FormSchema) {
    /* const id = await handleAddDataProduct(data);
    addNode({
      id: id.toString(),
      data: { label: `${data.name}` },
      position: { x: 500, y: Math.random() * 100 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });
    setOpen(false);
    form.reset(); */
    console.log(data);
  }
  console.log(form.getValues());
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="self-end">Create Data Product</Button>
      </SheetTrigger>
      <SheetContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4 py-4"
          >
            <SheetHeader>
              <SheetTitle>Create a Data Product</SheetTitle>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a name for your data product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a description for your data product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="owners"
                render={({ field: { value, ...props } }) => (
                  <FormItem>
                    <FormLabel>Owners</FormLabel>
                    <FormControl></FormControl>
                    <FormDescription>
                      Enter a description for your data product
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </SheetHeader>
            <SheetFooter>
              <Button type="submit">Add Data Product</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
