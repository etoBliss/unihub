import React, { useState, useEffect, useContext, useRef } from 'react';
import { api } from '../context/AuthContext';
import { AuthContext } from '../context/AuthContext';
import { Search, Send, MessageSquare, Phone, Video, Info, Paperclip, Smile } from 'lucide-react';

const Chat = () => {
    const { user } = useContext(AuthContext);

    // Chat data states
    const [inbox, setInbox] = useState([]);
    const [directoryUsers, setDirectoryUsers] = useState([]);
    const [activePartner, setActivePartner] = useState(null);
    const [messages, setMessages] = useState([]);
    const [typedMessage, setTypedMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingInbox, setLoadingInbox] = useState(true);
    const [loadingChat, setLoadingChat] = useState(false);

    // Polling references
    const pollInterval = useRef(null);
    const messagesEndRef = useRef(null);

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

    // Auto scroll chat box on update
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        fetchInbox();
        fetchDirectory();

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, []);

    useEffect(() => {
        if (pollInterval.current) clearInterval(pollInterval.current);

        if (activePartner) {
            loadConversation(activePartner._id);

            pollInterval.current = setInterval(() => {
                api.get(`/messages/conversation/${activePartner._id}`)
                    .then((res) => setMessages(res.data))
                    .catch((err) => console.log('Chat logs poll failed:', err.message));
            }, 4000);
        } else {
            setMessages([]);
        }

        return () => {
            if (pollInterval.current) clearInterval(pollInterval.current);
        };
    }, [activePartner]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!typedMessage.trim() || !activePartner) return;

        const content = typedMessage;
        setTypedMessage('');

        try {
            const res = await api.post('/messages', {
                receiverId: activePartner._id,
                content: content
            });
            setMessages((prev) => [...prev, res.data]);
            fetchInbox();
        } catch (error) {
            console.error('Failed to write message:', error.message);
        }
    };

    // Filters for directory list and inbox items
    const filteredInbox = inbox.filter((item) =>
        item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.user.department && item.user.department.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const filteredDirectory = directoryUsers.filter((userItem) => {
        if (userItem._id === user?._id) return false;
        const isInInbox = inbox.some((item) => item.user._id === userItem._id);
        if (isInInbox) return false;

        return userItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (userItem.department && userItem.department.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
    };

    const formatRelativeTime = (isoString) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return '';
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0">
            {/* Page Header */}
            <header className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="font-headline-xl text-headline-xl text-primary font-bold">Campus Direct Connect</h2>
                    <p className="text-on-surface-variant font-body-lg text-sm mt-1">Real-time collaboration for the LAUTECH academic community.</p>
                </div>
            </header>

            {/* Split pane container */}
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-270px)] min-h-[520px] items-stretch">

                {/* Left Pane: contacts threads & directory list */}
                <div className="w-full lg:w-1/3 bg-white rounded-2xl border border-surface-container-high shadow-sm flex flex-col overflow-hidden max-h-full">
                    {/* Header search bar area */}
                    <div className="p-5 border-b border-surface-container/50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-title-md text-primary font-bold">Active Threads</h3>
                            <span className="text-[10px] font-bold text-secondary bg-secondary-container/40 px-2 py-0.5 rounded uppercase tracking-wider">
                                {directoryUsers.length} Directory
                            </span>
                        </div>
                        <div className="relative flex items-center">
                            <Search className="absolute left-3 w-4 h-4 text-on-surface-variant opacity-60" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#F2F2F2] border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-secondary outline-none placeholder:text-outline/50"
                                placeholder="Filter by name or department..."
                                type="text"
                            />
                        </div>
                    </div>

                    {/* Scrollable contact feeds */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
                        {/* Active chats */}
                        <div>
                            {filteredInbox.length > 0 && (
                                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-3 mb-2">Recent Chats</p>
                            )}
                            {filteredInbox.map((item) => {
                                const isCurrent = activePartner?._id === item.user._id;
                                return (
                                    <div
                                        key={item.user._id}
                                        onClick={() => setActivePartner(item.user)}
                                        className={`p-3.5 rounded-xl mb-1 flex items-center gap-4 cursor-pointer transition-all ${isCurrent
                                                ? 'bg-surface-container shadow-sm border-l-4 border-secondary pl-2.5'
                                                : 'hover:bg-surface-container-low border-l-4 border-transparent'
                                            }`}
                                    >
                                        <div className="relative shrink-0">
                                            <div className="w-11 h-11 rounded-full bg-primary-container/20 flex items-center justify-center text-primary font-bold text-sm">
                                                {getInitials(item.user.name)}
                                            </div>
                                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-semibold text-primary text-sm truncate">{item.user.name}</h4>
                                                <span className="text-[9px] text-on-surface-variant font-medium shrink-0 ml-2">
                                                    {formatRelativeTime(item.lastMessage?.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-on-surface-variant truncate mt-0.5">
                                                {item.lastMessage?.content || 'Click to read channel'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Directory list of other students */}
                        <div>
                            {filteredDirectory.length > 0 && (
                                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-3 mb-2">Available Contacts</p>
                            )}
                            {filteredDirectory.map((dirUser) => (
                                <div
                                    key={dirUser._id}
                                    onClick={() => setActivePartner(dirUser)}
                                    className="p-3.5 rounded-xl hover:bg-surface-container-low mb-1 flex items-center gap-4 cursor-pointer transition-all border-l-4 border-transparent"
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-11 h-11 rounded-full bg-outline-variant/30 flex items-center justify-center text-on-surface-variant font-bold text-sm">
                                            {getInitials(dirUser.name)}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-primary text-sm truncate">{dirUser.name}</h4>
                                        <p className="text-[10px] text-on-surface-variant truncate uppercase tracking-tight mt-0.5">
                                            {dirUser.department || 'Student'} • {dirUser.level || 'LAUTECH'} Level
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredInbox.length === 0 && filteredDirectory.length === 0 && (
                            <div className="py-12 text-center text-on-surface-variant text-sm">
                                No contacts matching search query.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Pane: Message stream & conversation board */}
                <div className="flex-1 bg-white rounded-2xl border border-surface-container-high shadow-sm flex flex-col overflow-hidden max-h-full">
                    {activePartner ? (
                        <>
                            {/* Message Header */}
                            <div className="p-4 border-b border-surface-container/50 flex justify-between items-center bg-surface-container-lowest shrink-0 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-sm">
                                        {getInitials(activePartner.name)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-primary leading-tight text-sm md:text-base">{activePartner.name}</h3>
                                        <p className="text-[10px] text-on-surface-variant uppercase font-semibold">
                                            {activePartner.department || 'LAUTECH Student'} • {activePartner.level || 'Lvl'} Level
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    <button className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors" title="Start Video Call">
                                        <Video className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors" title="Start Phone Call">
                                        <Phone className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors" title="Contact Info">
                                        <Info className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Message Timeline */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 bg-surface-container-low/20">
                                <div className="flex justify-center">
                                    <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                                        COLLABORATION CHANNEL
                                    </span>
                                </div>

                                {loadingChat ? (
                                    <div className="flex justify-center py-6 text-on-surface-variant text-sm gap-2">
                                        <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                                        Fetching logs...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center py-12 text-on-surface-variant text-sm">
                                        No text history. Say hello to initiate discussion!
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const senderId = msg.sender?._id || msg.sender;
                                        const isMe = senderId?.toString() === user?._id?.toString();
                                        return isMe ? (
                                            /* Outgoing bubbles */
                                            <div key={msg._id} className="flex flex-col items-end space-y-1">
                                                <div className="bg-[#2B2C30] p-4 rounded-2xl rounded-br-none text-white max-w-[80%] diffuse-shadow text-sm">
                                                    <p className="leading-relaxed">{msg.content}</p>
                                                </div>
                                                <div className="flex items-center space-x-1 mr-1">
                                                    <span className="text-[9px] text-on-surface-variant">{formatRelativeTime(msg.createdAt)}</span>
                                                    <span className="material-symbols-outlined text-[11px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                        check_circle
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            /* Incoming bubbles */
                                            <div key={msg._id} className="flex items-end space-x-3 max-w-[80%]">
                                                <div className="w-8 h-8 rounded-full bg-outline-variant/30 shrink-0 flex items-center justify-center text-[10px] font-bold">
                                                    {getInitials(activePartner.name)}
                                                </div>
                                                <div>
                                                    <div className="bg-white p-4 rounded-2xl rounded-bl-none text-primary diffuse-shadow text-sm border border-surface-container-high/60">
                                                        <p className="leading-relaxed">{msg.content}</p>
                                                    </div>
                                                    <span className="text-[9px] text-on-surface-variant mt-1 ml-1 block">{formatRelativeTime(msg.createdAt)}</span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message input */}
                            <form onSubmit={handleSendMessage} className="p-4 bg-surface-container-lowest border-t border-surface-container shrink-0">
                                <div className="bg-[#F2F2F2] rounded-2xl p-1.5 flex items-center gap-2 shadow-inner">
                                    <button type="button" className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <input
                                        value={typedMessage}
                                        onChange={(e) => setTypedMessage(e.target.value)}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-primary font-body-md py-2.5 outline-none text-sm placeholder:text-outline/40"
                                        placeholder={`Send a secure message to ${activePartner.name}...`}
                                        type="text"
                                    />
                                    <button type="button" className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                                        <Smile className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-11 h-11 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-black transition-all active:scale-95 diffuse-shadow"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex justify-between items-center mt-2.5 px-2">
                                    <div className="flex space-x-4">
                                        <span className="text-[10px] text-on-surface-variant font-bold uppercase cursor-pointer hover:text-secondary transition-colors">
                                            Quick Replies
                                        </span>
                                        <span className="text-[10px] text-on-surface-variant font-bold uppercase cursor-pointer hover:text-secondary transition-colors">
                                            Voice Note
                                        </span>
                                    </div>
                                    <span className="text-[9px] text-on-surface-variant">Press Enter to send</span>
                                </div>
                            </form>
                        </>
                    ) : (
                        /* Empty state placeholder */
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-surface-container-low/10">
                            <div className="w-16 h-16 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary mb-4">
                                <MessageSquare className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-primary text-lg mb-2">Start a Collaboration Thread</h3>
                            <p className="text-on-surface-variant text-sm max-w-sm leading-relaxed">
                                Select a peer from the directory list or click an existing message thread on the left pane to begin real-time consultations.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
