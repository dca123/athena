import { Flow } from './flow';
import { AddDataProductButton } from './AddDataProduct';
import { db } from '@/lib/db';
import { PropsWithChildren } from 'react';
import { DataProductsStoreProvider } from './store';
import type { Edge, Node, Position } from 'reactflow';
import Dagre from '@dagrejs/dagre';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24 space-y-4 h-screen">
      <h1 className="text-lg self-start font-mono leading-4 tracking-wider">
        Athena
      </h1>
      <FlowDataWrapper>
        <AddDataProductButton />
        <div className="w-[100%] h-[100%] border rounded">
          <Flow />
        </div>
      </FlowDataWrapper>
    </main>
  );
}

const FlowDataWrapper = async (props: PropsWithChildren) => {
  const dataProducts = await db.query.dataProducts.findMany();
  const dataProductsToDataProducts =
    await db.query.dataProductsToDataProducts.findMany();
  const { nodes, edges } = getLayoutedElements(
    dataProducts.map(
      (dataProduct) =>
        ({
          id: dataProduct.id.toString(),
          data: { label: dataProduct.name },
          position: { x: 0, y: 0 },
          targetPosition: 'left' as Position.Left,
          sourcePosition: 'right' as Position.Right,
        }) satisfies Node,
    ),
    dataProductsToDataProducts.map(
      (edge) =>
        ({
          id: `${edge.sourceId}-${edge.targetId}`,
          source: edge.sourceId.toString(),
          target: edge.targetId.toString(),
        }) satisfies Edge,
    ),
  );

  return (
    <DataProductsStoreProvider nodes={nodes} edges={edges}>
      {props.children}
    </DataProductsStoreProvider>
  );
};

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  g.setGraph({ rankdir: 'LR', nodesep: 100, ranksep: 200 });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => g.setNode(node.id, node.data));

  Dagre.layout(g, {
    edgesep: 500,
  });

  return {
    nodes: nodes.map((node) => {
      const { x, y } = g.node(node.id);

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};
