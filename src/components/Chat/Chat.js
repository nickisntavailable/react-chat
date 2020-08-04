import React, {useState, useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';


let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    //message: user | text | time
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState('');
    //endpoint to server side
    const ENDPOINT = 'https://nicksreactchat.herokuapp.com/'; //'localhost:5000';


    //effect uses on endopoint or search line changes
    useEffect( () => {
        //take name and room from address line
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT);

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => {});

        return () => {
            socket.emit('disconnect');

            socket.off();
        };
        
    }, [ENDPOINT, location.search]);

    //effect uses on messages array changes
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });
        socket.on('roomData', ({ users }) => {
            setUsers(users);
        });
    }, [messages]);

    //func for sending messages
    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    };

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <div className="textContainer">
                <TextContainer users={users}/>
            </div>
            
        </div>
    );
};

export default Chat;