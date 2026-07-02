import React, { useState, useEffect, useRef } from 'react';

const MessageThread = ({ partner, messages, onSendMessage, currentUserId }) => {
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of conversation thread on updates
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;
        onSendMessage(inputText);
        setInputText('');
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '500px',
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            overflow: 'hidden'
        }}>
            {/* Thread Header */}
            <div style={{
                padding: '16px 20px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b', fontWeight: '600' }}>
                    Conversation with <span style={{ color: '#2563eb' }}>{partner?.name || 'Academic User'}</span>
                </h4>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Role: {partner?.role}</span>
            </div>

            {/* Messages Stream */}
            <div style={{
                flex: 1,
                padding: '20px',
                overflowY: 'auto',
                backgroundColor: '#f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '14px', margin: 'auto' }}>
                        No messages yet. Send a message to start the conversation!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender?._id?.toString() === currentUserId?.toString() || msg.sender === currentUserId;
                        return (
                            <div
                                key={msg._id}
                                style={{
                                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                                    maxWidth: '70%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: isMe ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div style={{
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    backgroundColor: isMe ? '#2563eb' : '#ffffff',
                                    color: isMe ? '#ffffff' : '#1e293b',
                                    fontSize: '14px',
                                    lineHeight: '1.4',
                                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                                    border: isMe ? 'none' : '1px solid #e2e8f0'
                                }}>
                                    {msg.content}
                                </div>
                                <span style={{ fontSize: '10px', color: '#64748b', marginTop: '4px', padding: '0 4px' }}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Form Submission */}
            <form onSubmit={handleSubmit} style={{
                padding: '12px 16px',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                gap: '10px',
                backgroundColor: '#ffffff'
            }}>
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Write a message to ${partner?.name || 'user'}...`}
                    style={{
                        flex: 1,
                        padding: '10px 14px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        outline: 'none',
                        fontSize: '14px'
                    }}
                />
                <button
                    type="submit"
                    style={{
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default MessageThread;
