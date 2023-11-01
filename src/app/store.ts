import {
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Node,
  Connection,
  EdgeChange,
  NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Position,
} from 'reactflow';
import { create } from 'zustand';

const initialNodes: Array<Node> = [
  {
    id: '1',
    position: { x: 0, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: 'Hubspot' },
    type: 'input',
  },
  {
    id: '2',
    position: { x: 300, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: 'Janus' },
  },
  {
    id: '3',
    position: { x: 300, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: 'Excel Forecasting' },
  },
];
const initialEdges: Array<Edge> = [
  {
    id: '1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
  },
  {
    id: '1-3',
    source: '1',
    target: '3',
    type: 'smoothstep',
  },
];

type RFState = {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
};

export const useDataProductsStore = create<RFState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node],
    });
  },
}));
