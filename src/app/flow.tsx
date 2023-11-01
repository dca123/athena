'use client';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { useDataProductsStore } from './store';

export function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useDataProductsStore();

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultViewport={{
          x: 100,
          y: 100,
          zoom: 1,
        }}
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
