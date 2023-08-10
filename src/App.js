import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import { joinGroup, addMessage } from './Redux/actions';
import styled from 'styled-components';
import "./App.css"
const socket = io('http://localhost:4000');

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  margin-Top: 20px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
    width: 100%;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const MessagesContainer = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  height: 400px;
  overflow-y: auto;
`;

const MessageItem = styled.div`
  margin-bottom: 10px;
    width: fit-content;
  background-color: #f2f2f2;
  padding: 10px;
  border-radius: 5px;
`;
const MyMessageItem = styled.div`
  margin-bottom: 10px;
    width: fit-content;
  background-color: #f2f2f2;
  padding: 10px;
  margin-left: auto;
  border-radius: 5px;
`;

const App = () => {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const messages = useSelector((state) => state);
  const messageContainerRef = useRef(null);
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    socket.on('message', (msg) => {
      dispatch(addMessage(msg));
    });
  }, [dispatch]);
  // useCallback(
  //   () => {

  //     if (messageContainerRef.current) {
  //       messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
  //     }
  //   },
  //   [messages],
  // )
  useMemo(
    () => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop = 9999999999999
      }
    },
    [messages, dispatch],
  )

  const handleJoinGroup = (e) => {
    e.preventDefault();

    if (name && group) {
      socket.emit('join', { name, group });
      dispatch(joinGroup(name, group));
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message) {
      const data = {
        name,
        group,
        message,
      };

      socket.emit('message', data);
      // dispatch(addMessage(data));
      setMessage('');
    }
  };

  return (
    <Container>
      <h1>Chat WebApp</h1>

      <Form onSubmit={handleJoinGroup}>
        <Input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="">Select a Group</option>
          <option value="IT">IT</option>
          <option value="Sales">Sales</option>
          <option value="HR">HR</option>
        </select>
        <Button type="submit">Join Group</Button>
      </Form>


      <MessagesContainer ref={messageContainerRef}>
        {messages?.messages?.map((msg, index) => {
          return (msg["name"] !== messages.name ? <>
            <MessageItem key={index}><b>name:</b>{msg.name}<br /><b>message: </b> {msg.message}</MessageItem>
            <p style={{ color: "#7e7474", fontSize: '12px' }}>{new Date(msg.createdAt).toLocaleTimeString()}</p></> : <>
            <MyMessageItem key={index}><b>name:</b>{msg.name}<br /><b>message: </b> {msg.message}</MyMessageItem>
            <p style={{ textAlign: 'end', color: "#7e7474", fontSize: '12px' }}>{new Date(msg.createdAt).toLocaleTimeString()}</p>
          </>
          )
        })}
        <div>
          <div style={{ marginBottom: "60px" }}>

          </div>

        </div>
      </MessagesContainer>
      <Form onSubmit={handleSendMessage}>
        <Input
          type="text"
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </Form>
    </Container>
  );
};

export default App;
