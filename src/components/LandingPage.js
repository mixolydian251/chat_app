import React from 'react';
import io from 'socket.io-client';
import uuid from 'uuid';
import moment from 'moment';
import scrollTo from '../utils/scrollAnimation';

const socket = io('http://localhost:3000');

class LandingPage extends React.Component{

    state = {
        endpoint: 'http://localhost:3000',
        id: uuid(),
        username: '',
        message: '',
        messages: []
    };

    send = () => {
        if( this.state.username && this.state.message ){
            socket.emit('createMessage', {
                id: this.state.id,
                from: this.state.username,
                message: this.state.message
            });
            this.setState(() => ({message: ''}))
        }
    };

    handleNameChange = (e) => {
        let username = e.target.value;
        this.setState({ username })
    };

    handleMessageChange = (e) => {
        let message = e.target.value;
        this.setState({ message })
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.send(uuid());
    };

    componentWillMount(){

        socket.on('newMessage', (message) => {
            this.setState((prevState) => ({
                messages: prevState.messages.concat(message)
            }));

            const chatBox = document.getElementById("chat-box");

            scrollTo(chatBox, chatBox.scrollHeight, 500);
        });

        socket.on('alertUserJoined', (user) => {
            console.log(`${user.name} has joined the chat room!`);
        });

        socket.emit('userJoined', {
            name: 'New User'
        })
    }

    render(){
        return(
            <div className="chat-container">
                <h1 className="header">Worlds Best Chat App</h1>

                <div id="chat-box" className="chat-box">
                    {this.state.messages.map((message) => {
                        return (
                            <div className={message.id === this.state.id ?
                                'message message__left' :
                                'message message__right'}>
                                <div className={message.id === this.state.id ?
                                    'message__box message__box--left' :
                                    'message__box message__box--right'}>
                                    <h3 className="message__name">{message.from}</h3>
                                    <p className="message__text">{message.message}</p>
                                    <p className="message__date">{moment(Number(message.createdAt)).format('h:mm:ss')}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>


                <div className="form">
                        <input className="form__name"
                               type="text"
                               placeholder="username"
                               value={this.state.username}
                               onChange={this.handleNameChange}
                        />

                    <textarea className="form__text"
                              autoFocus
                              type="text"
                              placeholder="message"
                              value={this.state.message}
                              onChange={this.handleMessageChange}
                    />

                    <button className="form__button" type="submit" onClick={this.send}>Send Message</button>
                </div>

            </div>
        )
    }
}

export default LandingPage;

