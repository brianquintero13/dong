'use client';

import React, { useState, useEffect, useRef, memo } from 'react';
import {
    ReactFlow, Background, Panel, BaseEdge,
    EdgeLabelRenderer, Position, Node, Edge, useReactFlow, Handle, ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from "../ThemeContext";

const AutoFitView = ({ splitPercent }: { splitPercent: number }) => {
    const { fitView } = useReactFlow();
    useEffect(() => {
        fitView({ padding: 0.35, duration: 0 });
    }, [splitPercent, fitView]);
    return null;
};

const CustomNode = memo(({ data }: any) => (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
            width: '90px', height: '90px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', fontSize: '22px', border: data.border,
            backgroundColor: data.backgroundColor, color: data.color,
            animation: data.animation, boxShadow: data.boxShadow, zIndex: 100
        }}>
            <Handle type="target" position={Position.Top} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
            {data.label}
            <Handle type="source" position={Position.Top} style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }} />
        </div>
    </div>
));

const nodeTypes = { custom: CustomNode };

const tmMachine = {
    states: ['q0', 'q1', 'q2'],
    startState: 'q0',
    acceptStates: ['q2'],
    transitions: [
        { from: 'q0', to: 'q0', read: '0', write: '1', move: 'R' },
        { from: 'q0', to: 'q0', read: '1', write: '0', move: 'R' },
        { from: 'q0', to: 'q1', read: 'Δ', write: 'Δ', move: 'L' },
        { from: 'q1', to: 'q1', read: '0', write: '0', move: 'L' },
        { from: 'q1', to: 'q1', read: '1', write: '1', move: 'L' },
        { from: 'q1', to: 'q2', read: 'Δ', write: 'Δ', move: 'R' }
    ]
};

const getPointOnCircle = (cx: number, cy: number, r: number, a: number) => ({
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a)
});

const CustomCurveEdge = ({ sourceX, sourceY, targetX, targetY, source, target, data }: any) => {
    const { isRetroTheme } = useTheme();
    const radius = 45;

    let edgePath = '';
    let labelX = 0;
    let labelY = 0;

    if (source === 'start-dummy') {
        const end = getPointOnCircle(targetX, targetY, radius, Math.PI);
        edgePath = `M ${sourceX} ${sourceY} L ${end.x} ${end.y}`;
        labelX = sourceX + (end.x - sourceX) / 2;
        labelY = sourceY - 14;
    } else if (source === target) {
        const startAngle = -Math.PI * 0.7;
        const endAngle = -Math.PI * 0.3;
        const start = getPointOnCircle(sourceX, sourceY, radius, startAngle);
        const end = getPointOnCircle(sourceX, sourceY, radius, endAngle);

        edgePath = `M ${start.x} ${start.y} C ${sourceX - 70} ${sourceY - 140}, ${sourceX + 70} ${sourceY - 140}, ${end.x} ${end.y}`;
        labelX = sourceX;
        labelY = sourceY - 105;
    } else {
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const curve = data.curve || -90;
        const midX = sourceX + dx / 2;
        const midY = sourceY + dy / 2;
        const nx = -dy / dist;
        const ny = dx / dist;
        const cx = midX + nx * curve;
        const cy = midY + ny * curve;
        const angleStart = Math.atan2(cy - sourceY, cx - sourceX);
        const start = getPointOnCircle(sourceX, sourceY, radius, angleStart);
        const angleEnd = Math.atan2(cy - targetY, cx - targetX);
        const end = getPointOnCircle(targetX, targetY, radius, angleEnd);

        edgePath = `M ${start.x} ${start.y} Q ${cx} ${cy} ${end.x} ${end.y}`;
        labelX = midX + nx * (curve * 0.5);
        labelY = midY + ny * (curve * 0.5);
    }

    const strokeColor = data.isActive ? (isRetroTheme ? '#38bdf8' : '#2563eb') : '#94a3b8';
    const markerId = `arrow-${source}-${target}-${data.isActive ? 'active' : 'idle'}`;

    return (
        <>
            <defs>
                <marker id={markerId} markerWidth="14" markerHeight="14" refX="9" refY="6" orient="auto-start-reverse">
                    <path d="M 0 2 L 10 6 L 0 10 z" fill={strokeColor} />
                </marker>
            </defs>
            <BaseEdge
                path={edgePath}
                markerEnd={`url(#${markerId})`}
                style={{ strokeWidth: data.isActive ? 4 : 2, stroke: strokeColor, fill: 'none' }}
            />
            {isRetroTheme && data.isActive && (
                <g key={data.stepIndex}>
                    <path d={edgePath} fill="none" stroke="#ffffff" strokeWidth="6" strokeDasharray="100 100" style={{ animation: `snake-draw ${data.speed}ms linear forwards` }} />
                    <path d={edgePath} fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="100 100" style={{ animation: `snake-draw ${data.speed}ms linear forwards` }} />
                </g>
            )}
            <EdgeLabelRenderer>
                <div style={{
                    position: 'absolute',
                    transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                    backgroundColor: isRetroTheme ? '#1f2937' : '#ffffff',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    color: isRetroTheme ? '#ffffff' : '#0f172a',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    border: isRetroTheme ? '2px solid #38bdf8' : '2px solid #cbd5e1',
                    pointerEvents: 'none',
                    zIndex: 100,
                    whiteSpace: 'pre-wrap',
                    textAlign: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    {data.label}
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

const edgeTypes = { customCurve: CustomCurveEdge };

const TAPE_PADDING = 8;
const generateInitialTape = (str: string) => {
    const pad = Array(TAPE_PADDING).fill('Δ');
    const core = str.length > 0 ? str.split('') : ['Δ'];
    return [...pad, ...core, ...pad];
};

function TMContent() {
    const { isRetroTheme } = useTheme();

    const bgApp = isRetroTheme ? '#020617' : '#cbd5e1';
    const textPrimary = isRetroTheme ? '#ffffff' : '#0f172a';
    const textSecondary = isRetroTheme ? '#94a3b8' : '#475569';
    const controlsBg = isRetroTheme ? '#0f172a' : '#f0f9ff';
    const controlsBorder = isRetroTheme ? '#38bdf8' : '#0ea5e9';
    const canvasBg = isRetroTheme ? '#000000' : '#ffffff';
    const canvasBorder = isRetroTheme ? '#475569' : '#94a3b8';
    const tapeBorder = isRetroTheme ? '#fb7185' : '#f43f5e';
    const logBg = isRetroTheme ? '#1e1b4b' : '#ffffff';
    const logBorder = isRetroTheme ? '#818cf8' : '#6366f1';
    const logLine = isRetroTheme ? '#818cf8' : '#6366f1';
    const inputBg = isRetroTheme ? '#1f2937' : '#ffffff';
    const shadow = isRetroTheme ? '0 0 20px rgba(56, 189, 248, 0.1)' : '0 8px 20px rgba(0,0,0,0.15)';

    const [inputString, setInputString] = useState('010');
    const [playbackSpeed, setPlaybackSpeed] = useState(800);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCrashed, setIsCrashed] = useState(false);
    const [splitPercent, setSplitPercent] = useState(65);
    const [isDragging, setIsDragging] = useState(false);
    const splitContainerRef = useRef<HTMLDivElement>(null);
    const logContainerRef = useRef<HTMLDivElement>(null);

    const [history, setHistory] = useState([{
        state: tmMachine.startState,
        tape: generateInitialTape('010'),
        headPos: TAPE_PADDING,
        readChar: '',
        writeChar: '',
        moveDir: '',
        edgeId: null as string | null
    }]);

    const currentSnapshot = history[history.length - 1];
    const isAccepted = tmMachine.acceptStates.includes(currentSnapshot.state);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        const startX = e.clientX;
        const startPercent = splitPercent;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            if (!splitContainerRef.current) return;
            const containerWidth = splitContainerRef.current.getBoundingClientRect().width;
            const dx = moveEvent.clientX - startX;
            const newPercent = startPercent + (dx / containerWidth) * 100;
            setSplitPercent(Math.max(25, Math.min(newPercent, 75)));
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    useEffect(() => {
        if (logContainerRef.current) {
            setTimeout(() => {
                if (logContainerRef.current) {
                    logContainerRef.current.scrollTo({
                        top: logContainerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 50);
        }
    }, [history.length, isAccepted, isCrashed]);

    const nodes: Node[] = [
        { id: 'start-dummy', type: 'custom', position: { x: 50, y: 250 }, data: { label: '' } },
        { id: 'q0', type: 'custom', position: { x: 150, y: 250 }, data: { label: 'q0' } },
        { id: 'q1', type: 'custom', position: { x: 400, y: 250 }, data: { label: 'q1' } },
        { id: 'q2', type: 'custom', position: { x: 650, y: 250 }, data: { label: 'q2' } }
    ].map((node) => {
        if (node.id === 'start-dummy') {
            return { ...node, style: { opacity: 0, pointerEvents: 'none' } };
        }

        const isActive = node.id === currentSnapshot.state;
        let animationStyle = 'none';

        if (isActive && isAccepted) {
            animationStyle = 'node-pulse-green 2s infinite';
        } else if (isActive && isCrashed) {
            animationStyle = 'node-shake-red 0.5s ease-in-out forwards';
        }

        return {
            ...node,
            zIndex: 100,
            data: {
                ...node.data,
                border: node.id === 'q2' ? (isRetroTheme ? '5px double #ffffff' : '5px double #94a3b8') : (isRetroTheme ? '3px solid #ffffff' : '3px solid #94a3b8'),
                backgroundColor: isActive ? (isRetroTheme ? '#fef08a' : '#2563eb') : (isRetroTheme ? '#1f2937' : '#ffffff'),
                color: isActive ? (isRetroTheme ? '#854d0e' : '#ffffff') : textPrimary,
                animation: animationStyle,
                boxShadow: isActive ? shadow : 'none'
            }
        }
    });

    const getEdgeId = (t: any) => {
        if (!t) return null;
        if (t.from === 'q0' && t.to === 'q0') return 'e-0';
        if (t.from === 'q0' && t.to === 'q1') return 'e-1';
        if (t.from === 'q1' && t.to === 'q1') return 'e-2';
        if (t.from === 'q1' && t.to === 'q2') return 'e-3';
        return null;
    };

    const edges: Edge[] = [
        { id: 'e-start', source: 'start-dummy', target: 'q0', type: 'customCurve', data: { label: 'Start', curve: 0 } },
        { id: 'e-0', source: 'q0', target: 'q0', type: 'customCurve', data: { label: '0 → 1, R\n1 → 0, R' } },
        { id: 'e-1', source: 'q0', target: 'q1', type: 'customCurve', data: { label: 'Δ → Δ, L', curve: -80 } },
        { id: 'e-2', source: 'q1', target: 'q1', type: 'customCurve', data: { label: '0 → 0, L\n1 → 1, L' } },
        { id: 'e-3', source: 'q1', target: 'q2', type: 'customCurve', data: { label: 'Δ → Δ, R', curve: -80 } }
    ].map(e => {
        let isEdgeActive = false;
        if (e.id === 'e-start') {
            isEdgeActive = history.length === 1;
        } else {
            isEdgeActive = e.id === currentSnapshot.edgeId;
        }

        return {
            ...e,
            zIndex: 0,
            data: { ...e.data, isActive: isEdgeActive, speed: playbackSpeed },
        };
    });

    const stepForward = () => {
        const char = currentSnapshot.tape[currentSnapshot.headPos];
        const transition = tmMachine.transitions.find(t => t.from === currentSnapshot.state && t.read === char);

        let edgeIdentifier = transition ? getEdgeId(transition) : null;

        if (transition) {
            let newTape = [...currentSnapshot.tape];
            newTape[currentSnapshot.headPos] = transition.write;
            let newHeadPos = currentSnapshot.headPos;

            if (transition.move === 'R') newHeadPos += 1;
            if (transition.move === 'L') newHeadPos -= 1;

            if (newHeadPos >= newTape.length) {
                newTape.push('Δ');
            } else if (newHeadPos < 0) {
                newTape.unshift('Δ');
                newHeadPos = 0;
            }

            setHistory(prev => [...prev, {
                state: transition.to, tape: newTape, headPos: newHeadPos,
                readChar: char, writeChar: transition.write, moveDir: transition.move,
                edgeId: edgeIdentifier
            }]);
        } else {
            setIsPlaying(false);
            setIsCrashed(true);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && !isAccepted && !isCrashed) {
            interval = setInterval(stepForward, playbackSpeed);
        } else {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentSnapshot, isAccepted, isCrashed, playbackSpeed]);

    const handleStepBackward = () => {
        if (history.length > 1) {
            setHistory(prev => prev.slice(0, -1));
            setIsPlaying(false);
            setIsCrashed(false);
        }
    };
    const handleReset = () => {
        setHistory([{ state: tmMachine.startState, tape: generateInitialTape(inputString), headPos: TAPE_PADDING, readChar: '', writeChar: '', moveDir: '', edgeId: null }]);
        setIsPlaying(false);
        setIsCrashed(false);
    };

    const MiniNode = ({ id, isAccept, isActive }: any) => (
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: isAccept ? '4px double' : '2px solid', borderColor: isActive ? (isRetroTheme ? '#fef08a' : '#1d4ed8') : (isRetroTheme ? '#ffffff' : '#cbd5e1'), backgroundColor: isActive ? (isRetroTheme ? '#854d0e' : '#2563eb') : (isRetroTheme ? '#1f2937' : '#ffffff'), color: isActive ? (isRetroTheme ? '#fef08a' : '#ffffff') : textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', boxShadow: isActive ? shadow : 'none' }}>
            {id}
        </div>
    );

    const MiniActionBox = ({ title, val, color }: { title: string, val: string, color: string }) => (
        <div style={{ padding: '4px 8px', backgroundColor: isRetroTheme ? '#1f2937' : '#ffffff', border: `3px solid ${color}`, color: textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <span style={{ color: textSecondary, marginRight: '4px' }}>{title}:</span> {val}
        </div>
    );

    let actionMessage = null;
    if (isAccepted) {
        actionMessage = '✅ Accepted!';
    } else if (isCrashed) {
        actionMessage = '❌ Rejected';
    } else if (!isAccepted && !isCrashed) {
        const char = currentSnapshot.tape[currentSnapshot.headPos];
        const transition = tmMachine.transitions.find(t => t.from === currentSnapshot.state && t.read === char);
        if (transition) {
            actionMessage = `Read: '${transition.read}' ➔ ${transition.to}`;
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: bgApp, color: textPrimary, width: '100%', flex: 1, minHeight: 0, overflow: 'hidden', userSelect: isDragging ? 'none' : 'auto' }}>
            <style>{`
        html, body { margin: 0; padding: 0; height: 100dvh; overflow: hidden !important; display: flex; flex-direction: column; }
        main, #__next, div[data-reactroot] { flex: 1 !important; min-height: 0 !important; display: flex !important; flex-direction: column !important; overflow: hidden !important; }
        @keyframes snake-draw { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
        @keyframes node-shake-red { 0%, 100% { transform: translateX(0); border-color: #ef4444 !important; } 25% { transform: translateX(-5px); border-color: #ef4444 !important; } 75% { transform: translateX(5px); border-color: #ef4444 !important; } }
        @keyframes node-pulse-green { 0% { box-shadow: 0 0 0 0 rgba(16,185,129,0.8); border-color: #10b981 !important; } 70% { box-shadow: 0 0 0 20px rgba(16,185,129,0); border-color: #10b981 !important; } 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); border-color: #10b981 !important; } }
        .react-flow__handle { opacity: 0 !important; } 
      `}</style>

            <div style={{ padding: '24px 24px 32px 24px', backgroundColor: controlsBg, borderBottom: `4px solid ${controlsBorder}`, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'flex-start', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                            <label style={{ marginTop: '10px', fontSize: '13px', fontWeight: 'bold', color: textPrimary, textTransform: 'uppercase', letterSpacing: '1px' }}>Initial Tape Content:</label>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <input
                                    value={inputString}
                                    onChange={(e) => { setInputString(e.target.value.replace(/[^01]/g, '')); }}
                                    placeholder="010"
                                    style={{ padding: '8px 16px', borderRadius: '8px', border: `3px solid ${controlsBorder}`, backgroundColor: inputBg, color: textPrimary, fontWeight: '900', fontSize: '16px', letterSpacing: '2px', fontFamily: 'monospace', outline: 'none', width: '140px', boxShadow: shadow }}
                                />
                                <span style={{ marginTop: '8px', fontSize: '11px', color: textSecondary, fontStyle: 'italic', fontWeight: 'bold' }}>*Use only: 0, 1</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', height: '41px' }}>
                        <button onClick={handleReset} style={{ padding: '10px 16px', backgroundColor: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginRight: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Set Tape ⭣</button>
                        <button onClick={handleStepBackward} disabled={history.length === 1} style={{ padding: '10px 16px', backgroundColor: '#374151', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>⏮ Back</button>
                        <button onClick={stepForward} disabled={isAccepted || isCrashed} style={{ padding: '10px 16px', backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Step ⏭</button>
                        <button onClick={() => setIsPlaying(!isPlaying)} disabled={isAccepted || isCrashed} style={{ padding: '10px 16px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{isPlaying ? '⏸ Pause' : '▶️ Play'}</button>
                        <button onClick={handleReset} style={{ padding: '10px 16px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>↺ Reset</button>
                        <div style={{ width: '3px', height: '30px', backgroundColor: controlsBorder, margin: '5px 8px 0 8px', borderRadius: '2px' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: inputBg, padding: '0 16px', borderRadius: '8px', border: `3px solid ${controlsBorder}`, boxShadow: shadow }}>
                            <span style={{ fontSize: '14px', fontWeight: 'bold', color: textPrimary }}>Speed:</span>
                            <input type="range" min="100" max="2000" step="100" value={2100 - playbackSpeed} onChange={(e) => setPlaybackSpeed(2100 - parseInt(e.target.value))} style={{ cursor: 'pointer', accentColor: controlsBorder }} />
                        </div>
                    </div>
                </div>
            </div>

            <div ref={splitContainerRef} style={{ display: 'flex', flexDirection: 'row', flex: 1, padding: '24px', width: '100%', minHeight: 0, overflow: 'hidden' }}>
                <div style={{ width: `${splitPercent}%`, minWidth: 0, height: '100%', display: 'flex', paddingRight: '12px', boxSizing: 'border-box' }}>
                    <div style={{ flex: 1, position: 'relative', display: 'flex', border: `3px solid ${canvasBorder}`, borderRadius: '12px', overflow: 'hidden', backgroundColor: canvasBg, boxShadow: shadow }}>
                        <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                edgeTypes={edgeTypes}
                                nodeTypes={nodeTypes}
                                fitView
                                fitViewOptions={{ padding: 0.3 }}
                                colorMode={isRetroTheme ? "dark" : "light"}
                                panOnDrag={false} zoomOnScroll={false} zoomOnPinch={false} zoomOnDoubleClick={false} nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
                            >
                                <AutoFitView splitPercent={splitPercent} />
                                <Panel position="top-center" style={{ marginTop: '20px', backgroundColor: controlsBg, padding: '12px 16px', borderRadius: '12px', border: `3px solid ${controlsBorder}`, width: '100%', maxWidth: '750px', overflowX: 'auto', boxShadow: shadow }}>
                                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                        {currentSnapshot.tape.map((char, index) => {
                                            const isHead = index === currentSnapshot.headPos;
                                            if (Math.abs(index - currentSnapshot.headPos) > 7) return null;
                                            return (
                                                <div key={index} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <div style={{ width: '44px', height: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: 'bold', backgroundColor: isHead ? (isRetroTheme ? '#fef08a' : '#2563eb') : inputBg, border: `3px solid ${isHead ? (isRetroTheme ? '#ca8a04' : '#1d4ed8') : (isRetroTheme ? '#ffffff' : tapeBorder)}`, color: isHead ? (isRetroTheme ? '#854d0e' : '#ffffff') : (char === 'Δ' ? textSecondary : textPrimary), borderRadius: '8px', transition: 'all 0.2s', boxShadow: isHead && isRetroTheme ? '0 0 15px rgba(202, 138, 4, 0.4)' : 'none', zIndex: isHead ? 10 : 1 }}>{char}</div>
                                                    {isHead && <div style={{ position: 'absolute', bottom: '-25px', color: isRetroTheme ? '#fef08a' : '#2563eb', fontSize: '20px', animation: isRetroTheme ? 'bounce 1s infinite' : 'none', fontWeight: 'bold' }}>⬆</div>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Panel>
                                <Panel position="bottom-center" style={{ marginBottom: '80px', zIndex: 100 }}>
                                    {actionMessage && (
                                        <div style={{ padding: '8px 16px', backgroundColor: (isAccepted || isCrashed) ? (isAccepted ? '#065f46' : '#fee2e2') : (isRetroTheme ? '#1e3a8a' : '#dbeafe'), color: (isAccepted || isCrashed) ? (isAccepted ? '#ffffff' : '#991b1b') : (isRetroTheme ? '#ffffff' : '#1e3a8a'), borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', border: '2px solid currentColor', boxShadow: shadow }}>
                                            {actionMessage}
                                        </div>
                                    )}
                                </Panel>
                                <Background color={isRetroTheme ? '#ffffff' : '#cbd5e1'} gap={20} size={2} />
                            </ReactFlow>
                        </div>
                    </div>
                </div>

                <div onMouseDown={handleMouseDown} style={{ width: '16px', margin: '0 -8px', zIndex: 50, cursor: 'col-resize', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '6px', height: '40px', backgroundColor: isDragging ? controlsBorder : (isRetroTheme ? '#475569' : '#94a3b8'), borderRadius: '4px', transition: 'background-color 0.2s' }} />
                </div>

                <div style={{ width: `${100 - splitPercent}%`, minWidth: 0, height: '100%', display: 'flex', paddingLeft: '12px', boxSizing: 'border-box' }}>
                    <div style={{ flex: 1, backgroundColor: logBg, border: `3px solid ${logBorder}`, borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: shadow }}>
                        <div style={{ padding: '24px 24px 16px 24px', flexShrink: 0 }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '900', color: isRetroTheme ? '#ffffff' : '#3730a3', textTransform: 'uppercase', letterSpacing: '1px', margin: '0', borderBottom: `2px solid ${logBorder}`, paddingBottom: '8px' }}>Execution Trace Outline</h3>
                        </div>
                        <div ref={logContainerRef} style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {history.map((snap, idx) => {
                                const isStart = idx === 0;
                                const indentPixels = idx * 20;
                                if (isStart) return (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: `${indentPixels}px` }}>
                                        <div style={{ fontWeight: 'bold', color: textPrimary, fontSize: '14px', width: '60px' }}>START:</div>
                                        <MiniNode id={snap.state} isAccept={tmMachine.acceptStates.includes(snap.state)} isActive={idx === history.length - 1} />
                                    </div>
                                );
                                return (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: `${indentPixels}px`, borderLeft: `3px solid ${logLine}`, paddingLeft: '16px', position: 'relative', flexWrap: 'nowrap' }}>
                                        <div style={{ position: 'absolute', left: '-3px', top: '-12px', height: '24px', width: '16px', borderBottom: `3px solid ${logLine}`, borderRadius: '0 0 0 8px' }} />
                                        <div style={{ fontWeight: 'bold', color: textPrimary, fontSize: '14px', width: '60px', flexShrink: 0 }}>STEP {idx}:</div>
                                        <MiniNode id={history[idx - 1].state} isAccept={tmMachine.acceptStates.includes(history[idx - 1].state)} />
                                        <div style={{ color: textPrimary, fontSize: '18px', fontWeight: 'bold' }}>+</div>
                                        <div style={{ width: '32px', height: '32px', backgroundColor: '#d1fae5', border: '3px solid #10b981', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '16px', borderRadius: '6px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', flexShrink: 0 }}>{snap.readChar}</div>
                                        <div style={{ color: textPrimary, fontSize: '16px', fontWeight: 'bold' }}>➔</div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <MiniActionBox title="Write" val={snap.writeChar} color="#10b981" />
                                            <MiniActionBox title="Move" val={snap.moveDir === 'R' ? 'Right ➔' : 'Left ⬅'} color="#8b5cf6" />
                                        </div>
                                        <div style={{ color: logLine, fontSize: '20px', fontWeight: 'bold', marginLeft: '8px' }}>➔</div>
                                        <MiniNode id={snap.state} isAccept={tmMachine.acceptStates.includes(snap.state)} isActive={idx === history.length - 1} />
                                    </div>
                                );
                            })}
                            {isAccepted && (
                                <div style={{ marginTop: '12px', padding: '16px', backgroundColor: '#ecfdf5', border: `3px solid #10b981`, borderRadius: '12px', color: '#065f46', textAlign: 'left', alignSelf: 'flex-start', maxWidth: '90%', boxShadow: shadow }}>
                                    <div style={{ fontWeight: '900', fontSize: '16px', marginBottom: '4px', textTransform: 'uppercase' }}>✅ Accepted</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>The machine successfully computed the 1's complement, rewound the tape head, and reached the final halting state (q2).</div>
                                </div>
                            )}
                            {isCrashed && (
                                <div style={{ marginTop: '12px', padding: '16px', backgroundColor: '#fef2f2', border: `3px solid #ef4444`, borderRadius: '12px', color: '#991b1b', textAlign: 'left', alignSelf: 'flex-start', maxWidth: '90%', boxShadow: shadow }}>
                                    <div style={{ fontWeight: '900', fontSize: '16px', marginBottom: '4px', textTransform: 'uppercase' }}>❌ Crash: Invalid Transition</div>
                                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>The machine read '{currentSnapshot.tape[currentSnapshot.headPos]}' while in state {currentSnapshot.state}. No valid rule exists for this combination, so the machine halted without accepting.</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function WrappedTM() {
    return (
        <ReactFlowProvider>
            <TMContent />
        </ReactFlowProvider>
    );
}