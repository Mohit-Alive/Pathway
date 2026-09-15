'use client';

import { useEffect } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { RoadmapNode } from './RoadmapNode';

interface RoadmapCanvasProps {
  initialNodes?: Node[];
  initialEdges?: Edge[];
  showMiniMap?: boolean;
  showControls?: boolean;
  interactive?: boolean;
  height?: string;
  onNodeSelect?: (nodeId: string) => void;
}

const nodeTypes = {
  roadmap: RoadmapNode,
};

export function RoadmapCanvas({
  initialNodes = [],
  initialEdges = [],
  showMiniMap = true,
  showControls = true,
  interactive = true,
  height = 'h-full',
  onNodeSelect,
}: RoadmapCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
    }
  }, [initialNodes, setNodes]);

  useEffect(() => {
    if (initialEdges.length > 0) {
      setEdges(initialEdges);
    }
  }, [initialEdges, setEdges]);

  const handleNodeClick = (_: React.MouseEvent, node: Node) => {
    if (onNodeSelect && interactive) {
      onNodeSelect(node.id);
    }
  };

  return (
    <div className={`w-full ${height} bg-white rounded-xl border border-zinc-200 relative`}>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          type: 'roadmap',
        }))}
        edges={edges.map((edge) => ({
          ...edge,
          type: 'smoothstep',
          animated: edge.animated ?? false,
          style: { strokeWidth: 2, stroke: '#cbd5e1' },
        }))}
        onNodesChange={interactive ? onNodesChange : undefined}
        onEdgesChange={interactive ? onEdgesChange : undefined}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ minZoom: 0.35, maxZoom: 1.2, padding: 0.2 }}
        panOnDrag={interactive}
        zoomOnScroll={interactive}
        zoomOnPinch={interactive}
        preventScrolling={interactive}
        zoomOnDoubleClick={false}
      >
        <Background variant={BackgroundVariant.Dots} color="#e2e8f0" gap={16} size={1} />
        {showControls && interactive && (
          <Controls position="bottom-left" className="bg-white border border-zinc-200 rounded-lg shadow-sm" />
        )}
        {showMiniMap && interactive && (
          <MiniMap
            position="bottom-right"
            className="bg-white border border-zinc-200 rounded-lg shadow-sm"
            nodeColor={(node) => {
              const status = node.data?.status;
              if (status === 'completed') return '#10b981';
              if (status === 'in_progress' || status === 'in-progress') return '#3b82f6';
              if (status === 'available') return '#60a5fa';
              return '#cbd5e1';
            }}
          />
        )}
      </ReactFlow>
    </div>
  );
}
