'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import {
  ReactFlow, Background, Panel,
  BaseEdge, EdgeLabelRenderer, Position, Node, Edge,
  useReactFlow, ReactFlowProvider, Handle
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from "./ThemeContext";

const faMachines = [
  {
    name: "1. Even Number of Zeros (Mod 2)",
    defaultInput: "10100",
    alphabet: ['0', '1'],
    states: ['q0', 'q1'],
    startState: 'q0',
    acceptStates: ['q0'],
    transitions: [
      { from: 'q0', to: 'q1', read: '0', edgeId: 'e0' },
      { from: 'q0', to: 'q0', read: '1', edgeId: 'e1' },
      { from: 'q1', to: 'q0', read: '0', edgeId: 'e2' },
      { from: 'q1', to: 'q1', read: '1', edgeId: 'e3' }
    ],
    nodesLayout: [
      { id: 'start-dummy', position: { x: 40, y: 200 } },
      { id: 'q0', label: 'q0', position: { x: 200, y: 200 } },
      { id: 'q1', label: 'q1', position: { x: 500, y: 200 } }
    ],
    edgesLayout: [
      { id: 'e-start', source: 'start-dummy', target: 'q0', label: 'Start', curve: 0 },
      { id: 'e0', source: 'q0', target: 'q1', label: '0', curve: 50 },
      { id: 'e1', source: 'q0', target: 'q0', label: '1' },
      { id: 'e2', source: 'q1', target: 'q0', label: '0', curve: 50 },
      { id: 'e3', source: 'q1', target: 'q1', label: '1' }
    ]
  },
  {
    name: "2. Ends with 'ab' (Book Fig 2-3)",
    defaultInput: "aabab",
    alphabet: ['a', 'b'],
    states: ['q0', 'q1', 'q2'],
    startState: 'q0',
    acceptStates: ['q2'],
    transitions: [
      { from: 'q0', to: 'q1', read: 'a', edgeId: 'e0' },
      { from: 'q0', to: 'q0', read: 'b', edgeId: 'e1' },
      { from: 'q1', to: 'q1', read: 'a', edgeId: 'e2' },
      { from: 'q1', to: 'q2', read: 'b', edgeId: 'e3' },
      { from: 'q2', to: 'q1', read: 'a', edgeId: 'e4' },
      { from: 'q2', to: 'q0', read: 'b', edgeId: 'e5' }
    ],
    nodesLayout: [
      { id: 'start-dummy', position: { x: 40, y: 200 } },
      { id: 'q0', label: 'q0', position: { x: 200, y: 200 } },
      { id: 'q1', label: 'q1', position: { x: 450, y: 200 } },
      { id: 'q2', label: 'q2', position: { x: 700, y: 200 } }
    ],
    edgesLayout: [
      { id: 'e-start', source: 'start-dummy', target: 'q0', label: 'Start', curve: 0 },
      { id: 'e0', source: 'q0', target: 'q1', label: 'a', curve: 50 },
      { id: 'e1', source: 'q0', target: 'q0', label: 'b' },
      { id: 'e2', source: 'q1', target: 'q1', label: 'a' },
      { id: 'e3', source: 'q1', target: 'q2', label: 'b', curve: 50 },
      { id: 'e4', source: 'q2', target: 'q1', label: 'a', curve: 50 },
      { id: 'e5', source: 'q2', target: 'q0', label: 'b', curve: 80 }
    ]
  },
  {
    name: "3. Contains 'aba' (Book Fig 2-5)",
    defaultInput: "bbababb",
    alphabet: ['a', 'b'],
    states: ['q0', 'q1', 'q2', 'q3'],
    startState: 'q0',
    acceptStates: ['q3'],
    transitions: [
      { from: 'q0', to: 'q1', read: 'a', edgeId: 'e0' },
      { from: 'q0', to: 'q0', read: 'b', edgeId: 'e1' },
      { from: 'q1', to: 'q1', read: 'a', edgeId: 'e2' },
      { from: 'q1', to: 'q2', read: 'b', edgeId: 'e3' },
      { from: 'q2', to: 'q3', read: 'a', edgeId: 'e4' },
      { from: 'q2', to: 'q0', read: 'b', edgeId: 'e5' },
      { from: 'q3', to: 'q3', read: 'a', edgeId: 'e6' },
      { from: 'q3', to: 'q3', read: 'b', edgeId: 'e6' }
    ],
    nodesLayout: [
      { id: 'start-dummy', position: { x: -20, y: 200 } },
      { id: 'q0', label: 'q0', position: { x: 100, y: 200 } },
      { id: 'q1', label: 'q1', position: { x: 300, y: 200 } },
      { id: 'q2', label: 'q2', position: { x: 500, y: 200 } },
      { id: 'q3', label: 'q3', position: { x: 700, y: 200 } }
    ],
    edgesLayout: [
      { id: 'e-start', source: 'start-dummy', target: 'q0', label: 'Start', curve: 0 },
      { id: 'e0', source: 'q0', target: 'q1', label: 'a', curve: 50 },
      { id: 'e1', source: 'q0', target: 'q0', label: 'b' },
      { id: 'e2', source: 'q1', target: 'q1', label: 'a' },
      { id: 'e3', source: 'q1', target: 'q2', label: 'b', curve: 50 },
      { id: 'e4', source: 'q2', target: 'q3', label: 'a', curve: 50 },
      { id: 'e5', source: 'q2', target: 'q0', label: 'b', curve: 80 },
      { id: 'e6', source: 'q3', target: 'q3', label: 'a, b' }
    ]
  },
  {
    name: "4. Binary Divisible by 3 (Book Fig 2-11)",
    defaultInput: "1100",
    alphabet: ['0', '1'],
    states: ['q0', 'q1', 'q2'],
    startState: 'q0',
    acceptStates: ['q0'],
    transitions: [
      { from: 'q0', to: 'q0', read: '0', edgeId: 'e0' },
      { from: 'q0', to: 'q1', read: '1', edgeId: 'e1' },
      { from: 'q1', to: 'q2', read: '0', edgeId: 'e2' },
      { from: 'q1', to: 'q0', read: '1', edgeId: 'e3' },
      { from: 'q2', to: 'q1', read: '0', edgeId: 'e4' },
      { from: 'q2', to: 'q2', read: '1', edgeId: 'e5' }
    ],
    nodesLayout: [
      { id: 'start-dummy', position: { x: 40, y: 200 } },
      { id: 'q0', label: '0', position: { x: 200, y: 200 } },
      { id: 'q1', label: '1', position: { x: 450, y: 200 } },
      { id: 'q2', label: '2', position: { x: 700, y: 200 } }
    ],
    edgesLayout: [
      { id: 'e-start', source: 'start-dummy', target: 'q0', label: 'Start', curve: 0 },
      { id: 'e0', source: 'q0', target: 'q0', label: '0' },
      { id: 'e1', source: 'q0', target: 'q1', label: '1', curve: 50 },
      { id: 'e2', source: 'q1', target: 'q2', label: '0', curve: 50 },
      { id: 'e3', source: 'q1', target: 'q0', label: '1', curve: 50 },
      { id: 'e4', source: 'q2', target: 'q1', label: '0', curve: 50 },
      { id: 'e5', source: 'q2', target: 'q2', label: '1' }
    ]
  }
];

const AutoFitView = ({ splitPercent }: { splitPercent: number }) => {
  const { fitView } = useReactFlow();
  useEffect(() => { fitView({ padding: 0.35, duration: 0 }); }, [splitPercent, fitView]);
  return null;
};

const CustomNode = memo(({ data }: any) => (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '90px', height: '90px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '22px', border: data.border, backgroundColor: data.backgroundColor, color: data.color, animation: data.animation, boxShadow: data.boxShadow, zIndex: 100 }}>
        <Handle type="target" position={Position.Top} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
        {data.label}
        <Handle type="source" position={Position.Top} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
      </div>
    </div>
));

const nodeTypes = { custom: CustomNode };

const getPointOnCircle = (cx: number, cy: number, r: number, a: number) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });

const CustomSnakeEdge = ({ sourceX, sourceY, targetX, targetY, source, target, data }: any) => {
  const { isRetroTheme } = useTheme();
  const radius = 45;
  let edgePath = ''; let labelX = 0; let labelY = 0;

  if (source === 'start-dummy') {
    const end = getPointOnCircle(targetX, targetY, radius, Math.PI);
    edgePath = `M ${sourceX} ${sourceY} L ${end.x} ${end.y}`;
    labelX = sourceX + (end.x - sourceX) / 2; labelY = sourceY - 26;
  } else if (source === target) {
    const startAngle = -Math.PI * 0.7; const endAngle = -Math.PI * 0.3;
    const start = getPointOnCircle(sourceX, sourceY, radius, startAngle);
    const end = getPointOnCircle(sourceX, sourceY, radius, endAngle);
    edgePath = `M ${start.x} ${start.y} C ${sourceX - 70} ${sourceY - 140}, ${sourceX + 70} ${sourceY - 140}, ${end.x} ${end.y}`;
    labelX = sourceX; labelY = sourceY - 155;
  } else {
    const dx = targetX - sourceX; const dy = targetY - sourceY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const curve = data.curve || -90;
    const midX = sourceX + dx / 2; const midY = sourceY + dy / 2;
    const nx = -dy / dist; const ny = dx / dist;
    const cx = midX + nx * curve; const cy = midY + ny * curve;
    const angleStart = Math.atan2(cy - sourceY, cx - sourceX);
    const start = getPointOnCircle(sourceX, sourceY, radius, angleStart);
    const angleEnd = Math.atan2(cy - targetY, cx - targetX);
    const end = getPointOnCircle(targetX, targetY, radius, angleEnd);
    edgePath = `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;
    const offset = curve < 0 ? -24 : 24;
    labelX = midX + nx * (curve * 0.5 + offset); labelY = midY + ny * (curve * 0.5 + offset);
  }

  const strokeColor = data.isActive ? (isRetroTheme ? '#38bdf8' : '#bfdbfe') : '#94a3b8';
  const markerId = `arrow-${source}-${target}-${data.isActive ? 'active' : 'idle'}`;

  return (
      <>
        <defs><marker id={markerId} markerWidth="14" markerHeight="14" refX="9" refY="6" orient="auto-start-reverse"><path d="M 0 2 L 10 6 L 0 10 z" fill={strokeColor} /></marker></defs>
        <BaseEdge path={edgePath} markerEnd={`url(#${markerId})`} style={{ strokeWidth: data.isActive ? 4 : 2, stroke: strokeColor, fill: 'none' }} />
        {data.isActive && (
            <g key={data.stepIndex}>
              <path d={edgePath} fill="none" stroke={isRetroTheme ? "#ffffff" : "#93c5fd"} strokeWidth="6" strokeDasharray="100" strokeDashoffset="100" pathLength="100" style={{ animation: `snake-draw ${data.speed}ms linear forwards` }} />
              <path d={edgePath} fill="none" stroke={isRetroTheme ? "#3b82f6" : "#2563eb"} strokeWidth="3" strokeDasharray="100" strokeDashoffset="100" pathLength="100" style={{ animation: `snake-draw ${data.speed}ms linear forwards` }} />
            </g>
        )}
        <EdgeLabelRenderer>
          <div style={{ position: 'absolute', transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`, backgroundColor: isRetroTheme ? '#1f2937' : '#ffffff', padding: '4px 8px', borderRadius: '6px', color: isRetroTheme ? '#ffffff' : '#0f172a', fontWeight: 'bold', fontSize: '14px', border: isRetroTheme ? '2px solid #38bdf8' : '2px solid #cbd5e1', pointerEvents: 'none', zIndex: 100, whiteSpace: 'pre-wrap', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{data.label}</div>
        </EdgeLabelRenderer>
      </>
  );
};

const edgeTypes = { customSnake: CustomSnakeEdge };

function AutomataContent() {
  const { isRetroTheme } = useTheme();

  const bgApp = isRetroTheme ? '#020617' : '#cbd5e1';
  const controlsBg = isRetroTheme ? '#0f172a' : '#f0f9ff';
  const controlsBorder = isRetroTheme ? '#38bdf8' : '#0ea5e9';
  const textPrimary = isRetroTheme ? '#ffffff' : '#0f172a';
  const textSecondary = isRetroTheme ? '#94a3b8' : '#475569';
  const canvasBg = isRetroTheme ? '#000000' : '#ffffff';
  const canvasBorder = isRetroTheme ? '#475569' : '#94a3b8';
  const logBg = isRetroTheme ? '#1e1b4b' : '#ffffff';
  const logBorder = isRetroTheme ? '#818cf8' : '#6366f1';
  const logLine = isRetroTheme ? '#818cf8' : '#6366f1';
  const inputBg = isRetroTheme ? '#1f2937' : '#ffffff';
  const shadow = isRetroTheme ? '0 0 20px rgba(56, 189, 248, 0.1)' : '0 8px 20px rgba(0,0,0,0.15)';

  const [machineIndex, setMachineIndex] = useState(0);
  const currentMachine = faMachines[machineIndex];

  const [inputString, setInputString] = useState(currentMachine.defaultInput);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([currentMachine.startState]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1100);

  const [splitPercent, setSplitPercent] = useState(65);
  const [isDragging, setIsDragging] = useState(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const currentState = history[history.length - 1];
  const isFinished = currentIndex >= inputString.length;
  const isAccepted = isFinished && currentMachine.acceptStates.includes(currentState);

  const handleReset = (newStr = inputString) => {
    setCurrentIndex(0);
    setHistory([currentMachine.startState]);
    setIsPlaying(false);
  };

  useEffect(() => {
    setInputString(currentMachine.defaultInput);
    setCurrentIndex(0);
    setHistory([currentMachine.startState]);
    setIsPlaying(false);
  }, [machineIndex]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); setIsDragging(true);
    const startX = e.clientX; const startPercent = splitPercent;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!splitContainerRef.current) return;
      const containerWidth = splitContainerRef.current.getBoundingClientRect().width;
      const dx = moveEvent.clientX - startX;
      const newPercent = startPercent + (dx / containerWidth) * 100;
      setSplitPercent(Math.max(25, Math.min(newPercent, 75)));
    };
    const handleMouseUp = () => { setIsDragging(false); document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
    document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (logContainerRef.current) { setTimeout(() => { logContainerRef.current?.scrollTo({ top: logContainerRef.current.scrollHeight, behavior: 'smooth' }); }, 50); }
  }, [history.length, isFinished]);

  const nodes: Node[] = currentMachine.nodesLayout.map(n => {
    if (n.id === 'start-dummy') return { ...n, type: 'custom', data: { label: '' }, style: { opacity: 0, pointerEvents: 'none' } };
    const isActive = n.id === currentState;
    let animationStyle = 'none';
    if (isActive && isFinished) animationStyle = isAccepted ? 'node-pulse-green 2s infinite' : 'node-shake-red 0.5s ease-in-out forwards';
    return {
      ...n, type: 'custom', zIndex: 100,
      data: {
        label: n.label,
        border: isRetroTheme ? (currentMachine.acceptStates.includes(n.id) ? '5px double #ffffff' : '3px solid #ffffff') : (currentMachine.acceptStates.includes(n.id) ? '5px double #94a3b8' : '3px solid #94a3b8'),
        backgroundColor: isActive ? (isRetroTheme ? '#fef08a' : '#2563eb') : (isRetroTheme ? '#1f2937' : '#ffffff'),
        color: isActive ? (isRetroTheme ? '#854d0e' : '#ffffff') : textPrimary,
        animation: animationStyle, boxShadow: isActive ? shadow : 'none'
      }
    };
  });

  let activeEdgeId: string | null = null;
  if (!isFinished && currentIndex > 0) {
    const prevState = history[currentIndex - 1];
    const transition = currentMachine.transitions.find(t => t.from === prevState && t.read === inputString[currentIndex - 1]);
    if (transition) activeEdgeId = transition.edgeId;
  }

  const edges: Edge[] = currentMachine.edgesLayout.map(e => {
    let isEdgeActive = false;
    if (e.id === 'e-start') isEdgeActive = currentIndex === 0 && !isFinished;
    else isEdgeActive = e.id === activeEdgeId;
    return { ...e, type: 'customSnake', zIndex: 0, data: { label: e.label, curve: e.curve, isActive: isEdgeActive, speed: playbackSpeed } };
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !isFinished) {
      interval = setInterval(() => {
        if (currentIndex < inputString.length) {
          const transition = currentMachine.transitions.find(t => t.from === currentState && t.read === inputString[currentIndex]);
          if (transition) {
            setHistory(prev => [...prev, transition.to]);
            setCurrentIndex(prev => prev + 1);
          } else { setIsPlaying(false); } // crash protection
        }
      }, playbackSpeed);
    } else if (isFinished) setIsPlaying(false);
    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, isFinished, playbackSpeed, currentState, inputString, currentMachine]);

  const handleStepBackward = () => {
    if (currentIndex > 0) { setHistory(prev => prev.slice(0, -1)); setCurrentIndex(prev => prev - 1); setIsPlaying(false); }
  };

  const MiniNode = ({ id, isAccept, isActive }: { id: string, isAccept: boolean, isActive?: boolean }) => {
    const nodeLabel = currentMachine.nodesLayout.find(n => n.id === id)?.label || id;
    return (
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: isAccept ? '4px double' : '2px solid', borderColor: isActive ? (isRetroTheme ? '#fef08a' : '#1d4ed8') : (isRetroTheme ? '#ffffff' : '#cbd5e1'), backgroundColor: isActive ? (isRetroTheme ? '#854d0e' : '#2563eb') : (isRetroTheme ? '#1f2937' : '#ffffff'), color: isActive ? (isRetroTheme ? '#fef08a' : '#ffffff') : textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', boxShadow: isActive ? shadow : 'none' }}>
          {nodeLabel}
        </div>
    );
  };

  let actionMessage = null;
  if (isFinished) {
    actionMessage = isAccepted ? '✅ Accepted!' : '❌ Rejected';
  } else {
    const transition = currentMachine.transitions.find(t => t.from === currentState && t.read === inputString[currentIndex]);
    if (transition) {
      const toLabel = currentMachine.nodesLayout.find(n => n.id === transition.to)?.label || transition.to;
      actionMessage = `Read: '${inputString[currentIndex]}' ➔ State ${toLabel}`;
    }
  }

  return (
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', backgroundColor: bgApp, color: textPrimary, width: '100%', flex: 1, minHeight: 0, overflow: 'hidden', userSelect: isDragging ? 'none' : 'auto' }}>
        <style>{`
        html, body { margin: 0; padding: 0; height: 100dvh; overflow: hidden !important; display: flex; flex-direction: column; }
        main, #__next, div[data-reactroot] { flex: 1 !important; min-height: 0 !important; display: flex !important; flex-direction: column !important; overflow: hidden !important; }
        @keyframes snake-draw { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
        @keyframes node-shake-red { 0%, 100% { transform: translateX(0); border-color: #ef4444 !important; } 25% { transform: translateX(-5px); border-color: #ef4444 !important; } 75% { transform: translateX(5px); border-color: #ef4444 !important; } }
        @keyframes node-pulse-green { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.8); border-color: #10b981 !important; } 70% { box-shadow: 0 0 0 20px rgba(16,185,129,0); border-color: #10b981 !important; } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); border-color: #10b981 !important; } }
        .react-flow__handle { opacity: 0 !important; }

        @media (max-width: 768px) {
            html, body { overflow: auto !important; height: auto !important; }
            main, #__next, div[data-reactroot] { height: auto !important; overflow: visible !important; display: block !important; }
            .app-container { height: auto !important; overflow: visible !important; display: block !important; }
            .mobile-split { flex-direction: column !important; padding: 12px !important; height: auto !important; overflow: visible !important; }
            .mobile-canvas { width: 100% !important; height: 60vh !important; padding-right: 0 !important; margin-bottom: 16px !important; flex: none !important; }
            .mobile-resizer { display: none !important; }
            .mobile-log { width: 100% !important; height: auto !important; min-height: 50vh !important; padding-left: 0 !important; flex: none !important; }
        }
      `}</style>

        <div style={{ padding: '24px', backgroundColor: controlsBg, borderBottom: `4px solid ${controlsBorder}`, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flexShrink: 0, boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', maxWidth: '800px', marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 'bold', color: textPrimary, textTransform: 'uppercase', letterSpacing: '1px', flexShrink: 0 }}>Select Machine:</label>
            <select value={machineIndex} onChange={(e) => setMachineIndex(parseInt(e.target.value))} style={{ padding: '8px 12px', borderRadius: '8px', border: `3px solid ${controlsBorder}`, backgroundColor: inputBg, color: textPrimary, fontWeight: 'bold', fontSize: '14px', outline: 'none', flex: 1, boxShadow: shadow, cursor: 'pointer' }}>
              {faMachines.map((m, idx) => <option key={idx} value={idx}>{m.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'flex-start', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <label style={{ marginTop: '10px', fontSize: '13px', fontWeight: 'bold', color: textPrimary, textTransform: 'uppercase', letterSpacing: '1px' }}>Input Sequence:</label>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <input value={inputString} onChange={(e) => { const val = e.target.value.replace(/\s/g, ''); setInputString(val); handleReset(val); }} placeholder="Input..." style={{ padding: '8px 16px', borderRadius: '8px', border: `3px solid ${controlsBorder}`, backgroundColor: inputBg, color: textPrimary, fontWeight: '900', fontSize: '16px', letterSpacing: '2px', fontFamily: 'monospace', outline: 'none', width: '140px', boxShadow: shadow }} />
                  <span style={{ marginTop: '8px', fontSize: '11px', color: textSecondary, fontStyle: 'italic', fontWeight: 'bold' }}>*Symbols: {currentMachine.alphabet.join(', ')}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', height: '41px' }}>
              <button onClick={handleStepBackward} disabled={currentIndex === 0} style={{ padding: '10px 16px', backgroundColor: '#374151', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>⏮ Back</button>
              <button onClick={() => { if (currentIndex < inputString.length) { const transition = currentMachine.transitions.find(t => t.from === currentState && t.read === inputString[currentIndex]); if (transition) { setHistory(prev => [...prev, transition.to]); setCurrentIndex(prev => prev + 1); } } }} disabled={isFinished} style={{ padding: '10px 16px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Step ⏭</button>
              <button onClick={() => setIsPlaying(!isPlaying)} disabled={isFinished} style={{ padding: '10px 16px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{isPlaying ? '⏸ Pause' : '▶️ Play'}</button>
              <button onClick={() => handleReset()} style={{ padding: '10px 16px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>↺ Reset</button>
              <div style={{ width: '3px', height: '30px', backgroundColor: controlsBorder, margin: '5px 8px 0 8px', borderRadius: '2px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: inputBg, padding: '0 16px', borderRadius: '8px', border: `3px solid ${controlsBorder}`, boxShadow: shadow }}>
                <span style={{ fontSize: '14px', fontWeight: 'bold', color: textPrimary }}>Speed:</span>
                <input type="range" min="100" max="2000" step="100" value={2100 - playbackSpeed} onChange={(e) => setPlaybackSpeed(2100 - parseInt(e.target.value))} style={{ cursor: 'pointer', accentColor: controlsBorder }} />
              </div>
            </div>
          </div>
        </div>

        <div ref={splitContainerRef} className="mobile-split" style={{ display: 'flex', flexDirection: 'row', flex: 1, padding: '24px', width: '100%', minHeight: 0, overflow: 'hidden' }}>
          <div className="mobile-canvas" style={{ width: `${splitPercent}%`, minWidth: 0, height: '100%', display: 'flex', paddingRight: '12px', boxSizing: 'border-box' }}>
            <div style={{ flex: 1, backgroundColor: canvasBg, position: 'relative', border: `3px solid ${canvasBorder}`, borderRadius: '12px', overflow: 'hidden', boxShadow: shadow }}>
              <ReactFlow key={machineIndex} nodes={nodes} edges={edges} edgeTypes={edgeTypes} nodeTypes={nodeTypes} fitView fitViewOptions={{ maxZoom: 1.3 }} colorMode={isRetroTheme ? "dark" : "light"} panOnDrag={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}>
                <AutoFitView splitPercent={splitPercent} />
                <Panel position="top-center" style={{ marginTop: '20px', backgroundColor: controlsBg, padding: '12px 16px', borderRadius: '12px', border: `3px solid ${controlsBorder}`, boxShadow: shadow }}>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {inputString.split('').map((char, index) => {
                      let bgColor = inputBg, borderColor = isRetroTheme ? '#ffffff' : controlsBorder, tColor = textPrimary;
                      if (index < currentIndex) { bgColor = '#065f46'; borderColor = '#10b981'; tColor = '#ffffff'; }
                      else if (index === currentIndex && !isFinished) { bgColor = isRetroTheme ? '#fef08a' : '#2563eb'; borderColor = isRetroTheme ? '#ca8a04' : '#1d4ed8'; tColor = isRetroTheme ? '#854d0e' : '#ffffff'; }
                      return <div key={index} style={{ width: '44px', height: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: 'bold', backgroundColor: bgColor, border: `3px solid ${borderColor}`, color: tColor, borderRadius: '8px' }}>{char}</div>;
                    })}
                  </div>
                </Panel>
                <Panel position="bottom-center" style={{ marginBottom: '80px', zIndex: 100 }}>
                  {actionMessage && (
                      <div style={{ padding: '8px 16px', backgroundColor: isFinished ? (isAccepted ? '#065f46' : '#fee2e2') : (isRetroTheme ? '#1e3a8a' : '#dbeafe'), color: isFinished ? (isAccepted ? '#ffffff' : '#991b1b') : (isRetroTheme ? '#ffffff' : '#1e3a8a'), borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', border: '2px solid currentColor', boxShadow: shadow }}>
                        {actionMessage}
                      </div>
                  )}
                </Panel>
                <Background color={isRetroTheme ? '#ffffff' : '#cbd5e1'} gap={20} size={2} />
              </ReactFlow>
            </div>
          </div>

          <div className="mobile-resizer" onMouseDown={handleMouseDown} style={{ width: '16px', margin: '0 -8px', zIndex: 50, cursor: 'col-resize', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '6px', height: '40px', backgroundColor: isDragging ? controlsBorder : (isRetroTheme ? '#475569' : '#94a3b8'), borderRadius: '4px', transition: 'background-color 0.2s' }} />
          </div>

          <div className="mobile-log" style={{ width: `${100 - splitPercent}%`, minWidth: 0, height: '100%', display: 'flex', paddingLeft: '12px', boxSizing: 'border-box' }}>
            <div style={{ flex: 1, backgroundColor: logBg, border: `3px solid ${logBorder}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: shadow }}>
              <div style={{ padding: '24px 24px 16px 24px', flexShrink: 0 }}>
                <h3 style={{ fontSize: '16px', fontWeight: '900', color: isRetroTheme ? '#ffffff' : '#3730a3', textTransform: 'uppercase', letterSpacing: '1px', margin: '0', borderBottom: `2px solid ${logBorder}`, paddingBottom: '8px' }}>Execution Trace Outline</h3>
              </div>
              <div ref={logContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {history.map((state, idx) => {
                  const isStart = idx === 0; const indentPixels = idx * 20;
                  if (isStart) return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: `${indentPixels}px` }}>
                        <div style={{ fontWeight: 'bold', color: textPrimary, fontSize: '14px', width: '60px' }}>START:</div>
                        <MiniNode id={state} isAccept={currentMachine.acceptStates.includes(state)} isActive={idx === history.length - 1} />
                      </div>
                  );
                  return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: `${indentPixels}px`, borderLeft: `3px solid ${logLine}`, paddingLeft: '16px', position: 'relative', flexWrap: 'nowrap' }}>
                        <div style={{ position: 'absolute', left: '-3px', top: '-12px', height: '24px', width: '16px', borderBottom: `3px solid ${logLine}`, borderRadius: '0 0 0 8px' }} />
                        <div style={{ fontWeight: 'bold', color: textPrimary, fontSize: '14px', width: '60px', flexShrink: 0 }}>STEP {idx}:</div>
                        <MiniNode id={history[idx - 1]} isAccept={currentMachine.acceptStates.includes(history[idx - 1])} />
                        <div style={{ color: textPrimary, fontSize: '18px', fontWeight: 'bold' }}>+</div>
                        <div style={{ width: '32px', height: '32px', backgroundColor: '#d1fae5', border: '3px solid #10b981', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexShrink: 0 }}>{inputString[idx - 1]}</div>
                        <div style={{ color: logLine, fontSize: '20px', fontWeight: 'bold' }}>➔</div>
                        <MiniNode id={state} isAccept={currentMachine.acceptStates.includes(state)} isActive={idx === history.length - 1} />
                      </div>
                  );
                })}
                {isFinished && (
                    <div style={{ marginTop: '12px', padding: '16px', backgroundColor: isAccepted ? '#ecfdf5' : '#fef2f2', border: `3px solid ${isAccepted ? '#10b981' : '#ef4444'}`, borderRadius: '12px', color: isAccepted ? '#065f46' : '#991b1b', textAlign: 'left', alignSelf: 'flex-start', maxWidth: '90%', boxShadow: shadow }}>
                      <div style={{ fontWeight: '900', fontSize: '16px', marginBottom: '4px', textTransform: 'uppercase' }}>{isAccepted ? '✅ Accepted' : '❌ Rejected'}</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>The machine finished executing the input sequence and halted on State {currentMachine.nodesLayout.find(n => n.id === currentState)?.label || currentState}.</div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

export default function WrappedFA() { return <ReactFlowProvider><AutomataContent /></ReactFlowProvider>; }