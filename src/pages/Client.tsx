import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { MessageHistory } from '../types/MessageHistory';

// get random name
const getName = () => {
    const names = [
        'Bob', 'John', 'Smith', 'Doe', 'Adam', 'Emily',
        'Alice', 'Eve', 'Carol', 'David', 'Frank', 'George',
    ];
    const name = names[Math.floor(Math.random() * names.length)];

    return name;
}

const socketUrl = process.env.REACT_APP_WS_HOST || 'ws://localhost:8000';
const username = getName();

export const Client = () => {
    const [messageHistory, setMessageHistory] = useState<MessageHistory[]>([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    const [text , setText] = useState<string>('');
    const [color, setColor] = useState<string>('#FFB6C1');
    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    // when start browser
    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
        sendMessage(JSON.stringify({
                'client' : true
            }));
        }
    }, [readyState]);

    // when change message
    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    };

    // when change color
    const handleColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setColor(e.target.value);
    };

    // when submit message
    const handleClickSendMessage = () => {
        // send json to server via websocket
        sendMessage(JSON.stringify({
            'client' : true,
            'username' : username,
            'text' : text,
            'color' : color
        }));
        setText('');
    }

    return (
        <div>
            <h2>Your Name is {username}</h2>
            <p>The WebSocket is currently : {connectionStatus}</p>
            <form onSubmit={e => e.preventDefault()}>
                {/* text form */}
                <input  type="text" 
                        id="message"
                        placeholder="Add message"
                        value={text}
                        onChange={handleMessageChange}
                />
                <select value={color} onChange={handleColorChange}>
                    <option value="#FFB6C1">梅</option>
                    <option value="#ADFF2F">竹</option>
                    <option value="#00FF00">松</option>
                </select>
                <button onClick={handleClickSendMessage} disabled={readyState !== ReadyState.OPEN}>
                    Buy
                </button>
            </form>
            <ul>
            {messageHistory.map((message, idx) => (
                <p key={idx}>
                    <span style={{color: message.color}}>{message.username} : {message.text}</span>
                </p>
            ))}
            </ul>
        </div>
    );
};
