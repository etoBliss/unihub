import React, { useState, useEffect } from 'react';

/**
 * PWA Install Prompt Component
 * Shows a bottom-sheet banner when the browser fires the `beforeinstallprompt` event.
 * Dismissed state is persisted in localStorage so it doesn't re-appear on same session.
 */
export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('pwa_prompt_dismissed')) return;

        // The event may have already fired before this component mounted
        // main.jsx captures it early and stashes it on window.__pwaPrompt
        if (window.__pwaPrompt) {
            setDeferredPrompt(window.__pwaPrompt);
            setVisible(true);
        }

        const handler = (e) => {
            e.preventDefault();
            window.__pwaPrompt = e;
            setDeferredPrompt(e);
            setVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setVisible(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        sessionStorage.setItem('pwa_prompt_dismissed', '1');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9999,
                padding: '0 16px 16px',
                animation: 'slideUp 0.3s ease-out',
            }}
        >
            <style>{`
                @keyframes slideUp {
                    from { transform: translateY(100%); opacity: 0; }
                    to   { transform: translateY(0);    opacity: 1; }
                }
            `}</style>

            <div style={{
                background: '#16181b',
                border: '1px solid #2b2c30',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 -4px 40px rgba(0,0,0,0.35)',
                maxWidth: '520px',
                margin: '0 auto',
            }}>
                {/* Logo */}
                <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #745a23, #ffdb98)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 700,
                    fontSize: '22px',
                    color: '#16181b',
                }}>
                    U
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                        margin: 0,
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 600,
                        fontSize: '14px',
                        color: '#ffffff',
                        lineHeight: 1.3,
                    }}>
                        Install UniHub OGB
                    </p>
                    <p style={{
                        margin: '3px 0 0',
                        fontFamily: 'Roboto, sans-serif',
                        fontSize: '12px',
                        color: '#76777b',
                        lineHeight: 1.4,
                    }}>
                        Add to your home screen for fast, offline access
                    </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    <button
                        onClick={handleDismiss}
                        style={{
                            background: 'transparent',
                            border: '1px solid #2b2c30',
                            borderRadius: '10px',
                            color: '#76777b',
                            fontFamily: 'Roboto, sans-serif',
                            fontSize: '13px',
                            fontWeight: 500,
                            padding: '8px 14px',
                            cursor: 'pointer',
                            transition: 'border-color 0.2s',
                        }}
                    >
                        Later
                    </button>
                    <button
                        onClick={handleInstall}
                        style={{
                            background: 'linear-gradient(135deg, #745a23, #c9a265)',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#16181b',
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '13px',
                            fontWeight: 700,
                            padding: '8px 16px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        Install App
                    </button>
                </div>
            </div>
        </div>
    );
}
