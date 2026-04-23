'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeContext';

export default function NavigationTabs() {
    const pathname = usePathname();
    const { isRetroTheme } = useTheme();

    const tabs = [
        { name: 'Finite Automata', path: '/' },
        { name: 'Pushdown Automata', path: '/pda' },
        { name: 'Turing Machine', path: '/tm' },
    ];

    return (
        <div style={{
            display: 'flex',
            gap: '8px',
            backgroundColor: isRetroTheme ? '#1f2937' : '#e2e8f0',
            padding: '6px',
            borderRadius: '12px',
            boxShadow: isRetroTheme ? '0 0 10px rgba(56, 189, 248, 0.1)' : 'inset 0 2px 4px rgba(0,0,0,0.05)',
            flexWrap: 'wrap',
            justifyContent: 'center'
        }}>
            {tabs.map((tab) => {
                const isActive = pathname === tab.path;

                return (
                    <Link key={tab.path} href={tab.path} style={{ textDecoration: 'none' }}>
                        <div style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '12px', // Smaller text
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            transition: 'all 0.2s ease',
                            backgroundColor: isActive
                                ? (isRetroTheme ? '#38bdf8' : '#2563eb')
                                : 'transparent',
                            color: isActive
                                ? (isRetroTheme ? '#0f172a' : '#ffffff')
                                : (isRetroTheme ? '#94a3b8' : '#64748b'),
                            border: isActive
                                ? `1px solid ${isRetroTheme ? '#7dd3fc' : '#1d4ed8'}`
                                : '1px solid transparent',
                            boxShadow: isActive
                                ? (isRetroTheme ? '0 0 15px rgba(56, 189, 248, 0.5)' : '0 4px 6px rgba(37, 99, 235, 0.3)')
                                : 'none',
                        }}>
                            {tab.name}
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}