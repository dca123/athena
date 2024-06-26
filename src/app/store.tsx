'use client';
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
} from 'reactflow';
import { createStore, useStore } from 'zustand';
import { PropsWithChildren, useRef, createContext, useContext } from 'react';
import { handleAddDataProductToDataProduct } from './actions';

interface DataProductsProps {
  nodes: Node[];
  edges: Edge[];
}

interface DataProductsState extends DataProductsProps {
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
}

type DataProductsStore = ReturnType<typeof createDataProductsStore>;

const createDataProductsStore = (initProps: DataProductsProps) => {
  return createStore<DataProductsState>()((set, get) => ({
    ...initProps,
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
      handleAddDataProductToDataProduct(connection);
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
};

const DataProductsStoreContext = createContext<DataProductsStore | null>(null);

export function DataProductsStoreProvider(
  props: PropsWithChildren<DataProductsProps & { organizationId: string }>,
) {
  const { children, organizationId, ...initProps } = props;
  const storeRef = useRef<DataProductsStore>();
  const organizationIdRef = useRef<string>();

  if (
    storeRef.current === undefined ||
    organizationIdRef.current !== organizationId
  ) {
    storeRef.current = createDataProductsStore(initProps);
    organizationIdRef.current = organizationId;
  }
  return (
    <DataProductsStoreContext.Provider value={storeRef.current}>
      {children}
    </DataProductsStoreContext.Provider>
  );
}

export function useDataProductsStore<T>(
  selector: (state: DataProductsState) => T,
) {
  const store = useContext(DataProductsStoreContext);
  if (store === null) {
    throw new Error(
      'useDataProductsStore must be used within a DataProductsStoreProvider',
    );
  }
  return useStore(store, selector);
}
