import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';


import './Messages.css';
import Message from '../Message/Message';

const Messages = ({ messages, name, time }) => (
    <ScrollToBottom className="messages">
        {messages.map((message, i) => <div key={i}><Message message={message} name={name} time={time} /></div>)}
    </ScrollToBottom>
);

export default Messages;