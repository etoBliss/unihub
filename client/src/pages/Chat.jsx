import React, { useState, useEffect, useContext } from 'react';
import { api } from '../context/AuthContext';
import { AuthContext } from '../context/AuthContext';
import MessageThread from '../components/MessageThread';

const Chat = () => {
    const { user } = useContext(AuthContext);

    // Inbox users list and conversation logs state
    const [inbox, setInbox] = useState([]);
    const [directoryUsers, setDirectoryUsers] = useState([]);
    const [activePartner, setActivePartner] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingInbox, setLoadingInbox] = useState(true);
    const [loadingChat, setLoadingChat] = useState(false);

    // Poll intervals
    const pollInterval = useRef(null);

    const fetchInbox = async () => {
        try {
            const res = await api.get('/messages/inbox');
            setInbox(res.data);
        } catch (error) {
            console.error('Failed to retrieve chat inbox summary:', error.message);
        } finally {
            setLoadingInbox(false);
        }
    };

    const fetchDirectory = async () => {
        try {
            const res = await api.get('/auth/users');
            setDirectoryUsers(res.data);
        } catch (error) {
            console.error('Failed to sync directory users:', error.message);
        }
    };

    const loadConversation = async (partnerId) => {
        setLoadingChat(true);
        try {
            const res = await api.get(`/messages/conversation/${partnerId}`);
            setMessages(res.data);
        } catch (error) {
            console.error('Failed to load conversation logs:', error.message);
        } finally {
            setLoadingChat(false);
        }
    };

    // Bootstrap inbox list and directory lookup on page mount
    useEffect(() => {
        fetchInbox();
        fetchDirectory();

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, []);

    // Poll conversation thread updates when chat is active
    useEffect(() => {
        if (pollInterval.current) clearInterval(pollInterval.current);

        if (activePartner) {
            loadConversation(activePartner._id);

            pollInterval.current = setInterval(() => {
                // Poll silent refresh
                api.get(`/messages/conversation/${activePartner._id}`)
                    .then((res) => setMessages(res.data))
                    .catch((err) => console.log('Chat logs poll failed:', err.message));
            }, 5000);
        } else {
            setMessages([]);
        }

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [activePartner]);

    // Ref container for polling interval persistence
    const useRef = (initialVal) => {
        const [val] = useState({ current: initialVal });
        return val;
    };

    const handleSendMessage = async (text) => {
        if (!activePartner) return;
        try {
            const res = await api.post('/messages', {
                receiverId: activePartner._id,
                content: text
            });
            // Append new message directly to list
            setMessages([...messages, res.data]);
            // Silently refresh inbox list to keep lastMessage updated
            fetchInbox();
        } catch (error) {
            console.error('Failed to write message:', error.message);
        }
    };

    const selectPartnerFromDirectory = (partnerUser) => {
        // Check if we already have an inbox conversation or start fresh
        setActivePartner(partnerUser);
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Academic Channels</h2>
                <p style={{ margin: 0, color: '#64748b' }}>State direct peer messaging system connecting students, staff, and faculty.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', height: '600px', alignItems: 'stretch' }}>
                {/* Left Side: Directory search and Inbox list */}
                <div style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Subheader Title */}
                    <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>Directory & Chats</h3>
                    </div>

                    {/* Directory Users Selection list */}
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Start Chat with Peer:</span>
                        <select
                            onChange={(e) => {
                                const partnerObj = directoryUsers.find(u => u._id === e.target.value);
                                if (partnerObj) selectPartnerFromDirectory(partnerObj);
                            }}
                            defaultValue=""
                            style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                        >
                            <option value="" disabled>-- Choose Contact --</option>
                            {directoryUsers.map((dirUser) => (
                                <option key={dirUser._id} value={dirUser._id}>
                                    {dirUser.name} ({dirUser.role}) - {dirUser.department}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Chat Inbox list */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
                        {loadingInbox ? (
                            <div style={{ fontSize: '13px', color: '#64748b', padding: '10px' }}>Syncing messages...</div>
                        ) : inbox.length === 0 ? (
                            <div style={{ fontSize: '13px', color: '#64748b', textAlign: 'center', padding: '20px' }}>
                                No active conversations. Use the dropdown selector above to initiate a chat.
                            </div>
                        ) : (
                            inbox.map((inboxItem) => {
                                const isSelected = activePartner?._id === inboxItem.user._id;
                                return (
                                    <div
                                        key={inboxItem.user._id}
                                        onClick={() => setActivePartner(inboxItem.user)}
                                        style={{
                                            padding: '12px 16px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                                            border: isSelected ? '1px solid #bfdbfe' : '1px dashed transparent',
                                            marginBottom: '6px',
                                            transition: 'background-color 0.2s',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
                                                {inboxItem.user.name}
                                            </span>
                                            {inboxItem.unreadCount > 0 && (
                                                <span style={{
                                                    backgroundColor: '#ef4444',
                                                    color: '#ffffff',
                                                    fontSize: '10px',
                                                    fontWeight: 'bold',
                                                    padding: '2px 6px',
                                                    borderRadius: '9999px'
                                                }}>
                                                    {inboxItem.unreadCount} new
                                                </span>
                                            )}
                                        </div>

                                        <div style={{
                                            fontSize: '12px',
                                            color: '#64748b',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            marginTop: '4px'
                                        }}>
                                            {inboxItem.lastMessage?.content || 'No text history.'}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Side: Message Thread */}
                <div style={{ flex: 1 }}>
                    {activePartner ? (
                        <MessageThread
                            partner={activePartner}
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            currentUserId={user?._id}
                        />
                    ) : (
                        <div style={{
                            height: '100%',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            color: '#64748b',
                            fontSize: '14px'
                        }}>
                            Select a conversation from the left layout or start a new thread to begin chatting.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
