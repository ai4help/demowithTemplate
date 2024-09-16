// lib/session.js
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

export const getSessionId = () => {
    let sessionId = Cookies.get('sessionId');
    console.log('sessionId:', sessionId);
    if (!sessionId) {
        sessionId = uuidv4();
        Cookies.set('sessionId', sessionId, { expires: 1 }); // Expires in 1 day
        console.log('new sessionId:', sessionId);
    }
    return sessionId;
};
