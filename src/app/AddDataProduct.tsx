'use client';

import { Button } from '@/components/ui/button';
import { useDataProductsStore } from './store';
import { Position } from 'reactflow';

export function AddDataProductButton() {
  const { addNode } = useDataProductsStore();
  const handleClick = () => {
    const id = Math.random().toString(36).substring(2, 9);
    addNode({
      id,
      data: { label: `Data Product ${id}` },
      position: { x: 500, y: Math.random() * 100 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    });
  };
  return (
    <Button className="self-end" onClick={handleClick}>
      Add Data Product
    </Button>
  );
}
