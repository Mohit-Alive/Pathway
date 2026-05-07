'use client';

import { useState } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { RoadmapNode } from './RoadmapNode';
import { mockRoadmapData } from '@/lib/mockData';

interface RoadmapCanvasProps {
  showMiniMap?: boolean;
  showControls?: boolean;
  interactive?: boolean;
  height?: string;
  onNodeClick?: (nodeId: string) => void;
}

const nodeTypes = {
  roadmap: RoadmapNode,
};

export function RoadmapCanvas({
  showMiniMap = true,
  showControls = true,
  interactive = true,
  height = 'h-[calc(100vh-64px)]',
  onNodeClick,
}: RoadmapCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    mockRoadmapData.nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(mockRoadmapData.edges);

  const handleNodeClick = (event: React.MouseEvent, nodeId: string) => {
    event.preventDefault();
    if (onNodeClick && interactive) {
      onNodeClick(nodeId);
    }
  };

  return (
    <div className={`w-full ${height} bg-white rounded-xl border border-zinc-200`}>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          type: 'roadmap',
          data: {
            ...node.data,
            onClick: (e: React.MouseEvent) => handleNodeClick(e, node.id),
          },
        }))}
        edges={edges.map((edge) => ({
          ...edge,
          type: 'smoothstep',
        }))}
        onNodesChange={interactive ? onNodesChange : undefined}
        onEdgesChange={interactive ? onEdgesChange : undefined}
        nodeTypes={nodeTypes}
        fitView
        panOnDrag={interactive}
        zoomOnScroll={interactive}
      >
        <Background variant="dots" color="#e4e4e7" gap={12} size={1} />
        {showControls && interactive && (
          <Controls position="bottom-left" className="bg-white border border-zinc-200 rounded-lg" />
        )}
        {showMiniMap && interactive && (
          <MiniMap
            position="bottom-right"
            className="bg-white border border-zinc-200 rounded-lg"
            nodeColor={(node) => {
              const dataNode = mockRoadmapData.nodes.find((n) => n.id === node.id);
              if (!dataNode) return '#e4e4e7';
              return dataNode.data.status === 'completed'
                ? '#22c55e'
                : dataNode.data.status === 'in-progress'
                  ? '#3b82f6'
                  : '#d4d4d8';
            }}
          />
        )}
      </ReactFlow>
    </div>
  );
}
