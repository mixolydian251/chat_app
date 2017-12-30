import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter, { history } from './routers/AppRouter';
import './styles/styles.scss';

const jsx = (
    <AppRouter/>
);

ReactDOM.render(jsx, document.getElementById('app'));


