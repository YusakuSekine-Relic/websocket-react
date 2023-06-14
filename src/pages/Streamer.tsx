import { useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MessageHistory } from '../types/MessageHistory';
import '../css/Streamer.css';

const socketUrl = process.env.REACT_APP_WS_HOST || 'ws://localhost:8000';

// map color to price
const ColorPriceMap = new Map<string, number>([
    ["#FFB6C1", 100],
    ["#ADFF2F", 1000],
    ["#00FF00", 10000],
]);

// map color to grade
const ColorGradeMap = new Map<string, string>([
    ["#FFB6C1", '梅'],
    ["#ADFF2F", '竹'],
    ["#00FF00", '松'],
]);

export const Streamer = () => {
    const [latestMessage, setLatestMessage] = useState<MessageHistory>({
        username: 'streamer',
        text: 'none',
        color: 'null'
    }); // latest message

    const [isShowLatestMessage, setIsShowLatestMessage] = useState<boolean>(false); // judge popup message
    const [messageHistory, setMessageHistory] = useState<MessageHistory[]>([]); // message history
    const [timer, setTimer] = useState<NodeJS.Timeout|null>(null);

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    // ref ul element
    const chatHistoryRef = useRef<HTMLUListElement>(null);

    // when start browser
    useEffect(() => {
        if (connectionStatus === 'Open') {
        sendMessage(JSON.stringify({
                'client' : false
            }));
        }
    }, [readyState]);

    // when get message
    useEffect(() => {
        if (lastMessage !== null) {
            const lastMessageJson = stringToJson(lastMessage.data); // convert to JSON (type MessageHistory)
            setMessageHistory((prev) => prev.concat(lastMessageJson));
        }
    }, [lastMessage]);

    // add message to chat history
    useEffect(() => {
        const chatHistoryElement = chatHistoryRef.current;
        if (chatHistoryElement) {
            chatHistoryElement.scrollTo(0, chatHistoryElement.scrollHeight);
        }
    }, [messageHistory]);

    useEffect(() => {
        if (lastMessage !== null) {
            const latestMessage = stringToJson(lastMessage.data);
            if(latestMessage.client) {
                setIsShowLatestMessage(true);
                setLatestMessage(latestMessage);
                
                if (timer !== null) {
                    clearTimeout(timer);
                }

                let newTimer = setTimeout(() => {
                    setIsShowLatestMessage(false);
                }, 600);

                setTimer(newTimer);
            }
        }

        return () => {
            clearTimeout(timer!);
        };

    }, [lastMessage]);

    return (
        <div className="contents">
            <div className='chat-content'>
                <ul className='chat-history' style={{paddingLeft: '20px', listStyle: 'none', padding: '5px', overflowX: 'hidden', overflowY: 'scroll', height: '550px'}} ref={chatHistoryRef}>
                    {messageHistory.map((message, idx) => (
                    <li className='chat' key={idx} style={{width: '17%', margin: '5px', border: `3px solid ${message.color}`, borderRadius: '5px'}}>
                        <p style={{padding: '0px', margin: '0px', display: 'grid', gridTemplateColumns: '2fr 1fr', color: 'black', background: `${message.color}`}}>
                            <span>{message.username}さん</span>
                            <span>{ColorGradeMap.get(message.color)}コース</span>
                        </p>
                        <p style={{padding: '0px', margin: '10px', display: 'grid', gridTemplateColumns: '2fr 1fr'}}> 
                            <span> {message.text === '' ? 'ご支援' : message.text}</span>
                            <span>¥{ColorPriceMap.get(message.color)}</span>
                        </p>
                    </li>
                    ))}
                </ul>
            </div>
            { isShowLatestMessage && latestMessage.text !== 'none' ? 
                <div className="popup">
                <span className="message" style={{background: `${latestMessage.color}`}}>
                    {latestMessage.username}さんにご支援いただきました！💰
                </span>
                </div>
            : ''}

        </div>
    );
};

function stringToJson(word: string) {
    return JSON.parse(word);
}
