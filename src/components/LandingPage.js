import React from 'react';
import io from 'socket.io-client';
import uuid from 'uuid';
import moment from 'moment';

const socket = io('http://localhost:3000');


class LandingPage extends React.Component{

    state = {
        endpoint: 'http://localhost:3000',
        username: '',
        message: '',
        messages: []
    };

    send = () => {
        if( this.state.username && this.state.message ){
            socket.emit('createMessage', {
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
            <div>
                <h1>The chat app of the century</h1>
                {this.state.messages.map((message) => {
                    return (
                        <div>
                            <h3>{message.from}</h3>
                            <p>{message.message}</p>
                            <p>{moment(Number(message.createdAt)).format('h:mm:ss')}</p>
                        </div>
                    )
                })}
                <input type="text"
                       placeholder="username"
                       value={this.state.username}
                       onChange={this.handleNameChange}
                       />
                <textarea   type="text"
                            placeholder="message"
                            value={this.state.message}
                            onChange={this.handleMessageChange}
                />
                    <button type="submit" onClick={this.send}>Send Message</button>
            </div>
        )
    }
}

export default LandingPage;

