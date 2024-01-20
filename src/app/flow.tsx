'use client';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { useState } from 'react';

import { useDataProductsStore } from './store';
import {
  handleRemoveDataProductToDataProduct,
  handleRemoveDataProducts,
} from './actions';
import { DataProductDetails } from './DataProductDetails';

export function Flow() {
  const { edges, nodes, onConnect, onEdgesChange, onNodesChange } =
    useDataProductsStore((s) => ({
      nodes: s.nodes,
      edges: s.edges,
      onNodesChange: s.onNodesChange,
      onEdgesChange: s.onEdgesChange,
      onConnect: s.onConnect,
    }));
  const [detailsSheetOpen, setDetailsSheetOpen] = useState(false);
  const [selectedDataProduct, setSelectedDataProduct] = useState<string | null>(
    null,
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={(e) => handleRemoveDataProductToDataProduct(e)}
        onNodesDelete={(nodes) =>
          handleRemoveDataProducts(nodes.map((n) => ({ id: n.id })))
        }
        onNodeClick={(e, n) => {
          console.log(n);
          setDetailsSheetOpen(true);
          setSelectedDataProduct(n.id);
        }}
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
      <DataProductDetails
        open={detailsSheetOpen}
        onOpenChange={setDetailsSheetOpen}
        dataProductId={selectedDataProduct}
      />
    </div>
  );
}
