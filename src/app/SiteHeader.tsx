'use client';

import NavigationTabs from "./NavigationTabs";
import { useTheme } from "./ThemeContext";

const FloppyDisk = ({ outlined = false }: { outlined?: boolean }) => (
    <div style={{ width: '1em', height: '1em', backgroundColor: '#27272a', borderRadius: '0.125em', position: 'relative', margin: '0.03125em', flexShrink: 0, border: outlined ? '0.04em solid #a1a1aa' : 'none', boxSizing: 'border-box' }}>
        <div style={{ position: 'absolute', top: 0, right: '0.125em', width: '0.375em', height: '0.3125em', backgroundColor: '#cbd5e1', borderBottomLeftRadius: '0.0625em' }} />
        <div style={{ position: 'absolute', bottom: '0.1em', left: '0.125em', right: '0.125em', height: '0.375em', backgroundColor: '#f8fafc', borderRadius: '0.0625em', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <div style={{ height: '0.1em', backgroundColor: '#ef4444', width: '80%', margin: '0 auto' }} />
            <div style={{ height: '0.1em', backgroundColor: '#3b82f6', width: '80%', margin: '0 auto' }} />
        </div>
    </div>
);

const CompactDisc = ({ outlined = false }: { outlined?: boolean }) => (
    <div style={{ width: '1em', height: '1em', borderRadius: '50%', background: 'conic-gradient(from 45deg, #f87171, #facc15, #4ade80, #60a5fa, #c084fc, #f87171)', position: 'relative', margin: '0.03125em', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0.1em rgba(255,255,255,0.5)', border: outlined ? '0.04em solid rgba(255, 255, 255, 0.8)' : 'none', boxSizing: 'border-box' }}>
        <div style={{ width: '0.25em', height: '0.25em', backgroundColor: '#050505', borderRadius: '50%', boxShadow: 'inset 0 0 0.1em rgba(255,255,255,0.8)' }} />
    </div>
);

const HardwareText = ({ text }: { text: string }) => {
    const font: Record<string, string[]> = {
        Q: ["0220", "2002", "2002", "0220", "0002"],
        U: ["1001", "1001", "1001", "1001", "0110"],
        "Ü": ["2002", "2002", "2002", "2002", "0220"],
        I: ["0100", "0100", "0100", "0100", "0100"],
        N: ["1001", "1101", "1011", "1001", "1001"],
        S: ["0111", "1000", "0110", "0001", "1110"],
        "'": ["02", "20", "00", "00", "00"],
        V: ["1001", "1001", "1001", "0110", "0010"],
        E: ["1110", "1000", "1110", "1000", "1110"],
        R: ["1110", "1001", "1110", "1001", "1001"]
    };

    const words = text.split(' ');

    return (
        <div aria-hidden="true" style={{ display: 'flex', flexWrap: 'wrap', gap: '3.0em', justifyContent: 'center', fontSize: 'clamp(3px, 0.6vw, 8px)' }}>
            {words.map((word, wordIdx) => (
                <div key={wordIdx} style={{ display: 'flex', gap: '0.25em' }}>
                    {word.split('').map((char, charIdx) => {
                        const grid = font[char.toUpperCase()] || font["'"];
                        return (
                            <div key={charIdx} style={{ display: 'flex', flexDirection: 'column', filter: 'drop-shadow(0 0 0.1em rgba(59, 130, 246, 0.9)) drop-shadow(0 0 0.05em rgba(255, 255, 255, 0.6))' }}>
                                {grid.map((row, rowIdx) => (
                                    <div key={rowIdx} style={{ display: 'flex' }}>
                                        {row.split('').map((bit, bitIdx) => {
                                            if (bit === '1') return <FloppyDisk key={bitIdx} />;
                                            if (bit === '2') return <CompactDisc key={bitIdx} />;
                                            return <div key={bitIdx} style={{ width: '1.125em', height: '1.125em' }} />;
                                        })}
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export default function SiteHeader() {
    const { isRetroTheme, setIsRetroTheme } = useTheme();

    return (
        <header style={{
            position: 'relative', zIndex: 999, width: '100%',
            background: isRetroTheme ? '#111827' : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            backgroundImage: isRetroTheme ? 'radial-gradient(#1f2937 1px, transparent 1px)' : 'none',
            borderBottom: `4px solid ${isRetroTheme ? '#374151' : '#3b82f6'}`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            padding: '0.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
        }}>

            <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-fast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

            {/* Toggle button */}
            <div style={{ position: 'absolute', top: '8px', right: '12px', zIndex: 50 }}>
                <button
                    onClick={() => setIsRetroTheme(!isRetroTheme)}
                    style={{
                        backgroundColor: isRetroTheme ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
                        color: isRetroTheme ? '#0f172a' : '#ffffff',
                        border: `1px solid ${isRetroTheme ? '#38bdf8' : 'rgba(255, 255, 255, 0.2)'}`,
                        backdropFilter: 'blur(10px)',
                        padding: '5px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}
                >
                    {isRetroTheme ? "Accessibility View" : "Retro Theme"}
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'clamp(8px, 2vw, 25px)', width: '100%', maxWidth: '1400px' }}>

                {/* Flanking Floppy Disk (Restored to Box Size) */}
                <div aria-hidden="true" style={{
                    fontSize: isRetroTheme ? 'clamp(50px, 7.5vw, 85px)' : 'clamp(40px, 5vw, 65px)',
                    display: 'flex',
                    flexShrink: 0,
                    transition: 'all 0.3s',
                    filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))',
                    animation: isRetroTheme ? 'spin-slow 3s linear infinite' : 'none'
                }}>
                    <FloppyDisk outlined={true} />
                </div>

                {/* Title Container */}
                <div style={isRetroTheme ? {
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', backgroundColor: '#050505', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)', padding: '10px 20px', borderRadius: '12px', border: '3px solid #27272a', borderTop: '3px solid #3f3f46', borderLeft: '3px solid #3f3f46', boxShadow: 'inset 0 0 20px rgba(0,0,0,1), 0 0 20px rgba(56, 189, 248, 0.15), 8px 8px 20px rgba(0,0,0,0.6)', flex: 1, maxWidth: '100%', textAlign: 'center'
                } : {
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', flex: 1, maxWidth: '800px', textAlign: 'center',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    borderBottom: '4px solid #2563eb',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s'
                }}>

                    {isRetroTheme ? (
                        <>
                            <div aria-hidden="true" style={{ fontSize: 'clamp(0.9rem, 1.3vw, 1.3rem)', fontWeight: 'bold', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '5px', textShadow: '0 0 8px rgba(168, 85, 247, 0.5)' }}>A <span style={{ color: '#10b981', fontSize: 'clamp(1.2rem, 1.9vw, 1.9rem)', textShadow: '0 0 12px rgba(16, 185, 129, 0.8)' }}>Beginner's</span> Guide To</div>

                            <div aria-hidden="true" style={{ width: '100%', paddingBottom: '3px', marginTop: '3px', display: 'flex' }}>
                                <div style={{ margin: '0 auto' }}>
                                    <HardwareText text="QUIN'S ÜNIVERSE" />
                                </div>
                            </div>
                        </>
                    ) : (
                        <h1 style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '1px', alignItems: 'center' }}>
                            <span style={{ fontSize: 'clamp(0.7rem, 0.9vw, 0.9rem)', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '3px' }}>A <span style={{ color: '#2563eb' }}>Beginner's</span> Guide To</span>
                            <span style={{
                                fontSize: 'clamp(1.6rem, 3.5vw, 3rem)',
                                fontWeight: '900',
                                background: 'linear-gradient(135deg, #0f172a 0%, #3b82f6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                letterSpacing: '0.5px',
                                wordSpacing: '0.20em',
                                lineHeight: '1',
                                fontFamily: 'system-ui, -apple-system, sans-serif'
                            }}>
                QUIN'S UNIVERSE
              </span>
                        </h1>
                    )}
                </div>

                {/* Flanking CD (Restored to Box Size) */}
                <div aria-hidden="true" style={{
                    fontSize: isRetroTheme ? 'clamp(50px, 7.5vw, 85px)' : 'clamp(40px, 5vw, 65px)',
                    display: 'flex',
                    flexShrink: 0,
                    transition: 'all 0.3s',
                    filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))',
                    animation: isRetroTheme ? 'spin-fast 1.2s linear infinite' : 'none'
                }}>
                    <CompactDisc outlined={true} />
                </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                <NavigationTabs />
            </div>

        </header>
    );
}