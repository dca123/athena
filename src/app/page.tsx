import { Flow } from './flow';
import { AddDataProductButton } from './AddDataProduct';
import { db } from '@/lib/db';
import { PropsWithChildren } from 'react';
import { DataProductsStoreProvider } from './store';
import type { Edge, Node, Position } from 'reactflow';
import Dagre from '@dagrejs/dagre';
import { auth } from '@clerk/nextjs';
import { dataProducts } from '@/lib/schema';
import { eq } from 'drizzle-orm';

async function getDataProducts() {
  const currentAuth = auth();
  if (currentAuth.orgId === undefined || currentAuth.orgId === null) {
    throw new Error('no orgId');
  } else {
    return await db.query.dataProducts.findMany({
      where: eq(dataProducts.organizationId, currentAuth.orgId),
    });
  }
}

export default function Home() {
  return (
    <FlowDataWrapper>
      <AddDataProductButton />
      <div className="w-[100%] h-[100%] border rounded">
        <Flow />
      </div>
    </FlowDataWrapper>
  );
}

const FlowDataWrapper = async (props: PropsWithChildren) => {
  const dataProducts = await getDataProducts();
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
  const { orgId } = auth();
  if (orgId === undefined || orgId === null) {
    throw new Error('No org Id');
  }

  return (
    <DataProductsStoreProvider
      nodes={nodes}
      edges={edges}
      organizationId={orgId}
    >
      {props.children}
    </DataProductsStoreProvider>
  );
};

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  if (nodes.length === 0) {
    console.warn('No nodes available');
    return {
      nodes: [],
      edges: [],
    };
  }
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
