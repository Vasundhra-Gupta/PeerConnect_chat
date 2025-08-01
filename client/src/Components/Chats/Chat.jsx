import { useEffect, useRef, useState } from 'react';
import { useChatContext } from '@/Context';
import { useNavigate, useParams } from 'react-router-dom';
import { chatService } from '@/Services';
import { Message } from '@/Components';
import { paginate } from '@/Utils';
import { icons } from '@/Assets/icons';

export default function Chat() {
    const { setMessages, messages, selectedChat, setSelectedChat } =
        useChatContext();
    const [messagesInfo, setMessagesInfo] = useState({});
    const { chatId } = useParams();
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const chatContainerRef = useRef(null);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        setMessages([]);
        setPage(1); // Reset page when chat changes
        isInitialLoad.current = true;
    }, [chatId, setMessages]);

    // Handle scroll behavior
    useEffect(() => {
        if (!chatContainerRef.current || messages.length === 0) return;

        const container = chatContainerRef.current;

        // Scroll to bottom on initial load
        if (isInitialLoad.current) {
            container.scrollTop = container.scrollHeight;
            isInitialLoad.current = false;
            return;
        }

        // Check if user is near bottom (within 100px)
        const isNearBottom =
            container.scrollHeight -
                container.scrollTop -
                container.clientHeight <
            100;

        // Only scroll to bottom if new messages arrive and user is near bottom
        if (isNearBottom) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    // Fetch messages
    useEffect(() => {
        if (!selectedChat) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();
        const signal = controller.signal;

        (async function getMessages() {
            try {
                setLoading(true);
                const data = await chatService.getMessages(
                    signal,
                    chatId,
                    page,
                    20
                );

                if (data && !data.message) {
                    setMessages((prev) => {
                        const existingIds = new Set(
                            prev.map((m) => m.message_id)
                        );
                        const newMessages = data.messages.filter(
                            (m) => !existingIds.has(m.message_id)
                        );
                        return [...prev, ...newMessages];
                    });
                    setMessagesInfo(data.messagesInfo);
                }
            } catch (err) {
                navigate('/server-error');
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [chatId, page]);

    const topMessageRef = paginate(messagesInfo?.hasNextPage, loading, setPage);

    const messageElements = messages.map((message, i) => (
        <Message
            message={message}
            key={message.message_id}
            reference={i === messages.length - 1 ? topMessageRef : null}
        />
    ));

    return (
        <div ref={chatContainerRef} className="p-4 overflow-scroll h-full">
            {loading && (
                <div className="w-full flex items-center justify-center pb-6">
                    <div className="size-[20px] fill-[#4977ec] dark:text-[#ececec]">
                        {icons.loading}
                    </div>
                </div>
            )}

            {messages.length > 0 ? (
                <div className="flex flex-col-reverse gap-2">
                    {messageElements}
                </div>
            ) : (
                !loading && <div>No messages</div>
            )}
        </div>
    );
}
