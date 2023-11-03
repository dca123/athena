'use client';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

import { useDataProductsStore } from './store';

export function Flow() {
  const { edges, nodes, onConnect, onEdgesChange, onNodesChange } =
    useDataProductsStore((s) => ({
      nodes: s.nodes,
      edges: s.edges,
      onNodesChange: s.onNodesChange,
      onEdgesChange: s.onEdgesChange,
      onConnect: s.onConnect,
    }));

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
