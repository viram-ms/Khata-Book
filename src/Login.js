import React, {useState} from 'react'
import './Login.css';
import {Button} from '@material-ui/core';
import khata from './khata.png';
import {auth, provider} from './firebase';
import { actionTypes } from './reducer';
import { useStateValue } from './StateProvider';
import db from './firebase';
import Auth from './Auth';

function Login(props) {
    console.log(props);
    const [{user,id}, dispatch] = useStateValue();
    // const [customer, setCustomer] = useState('');

    const signIn = async () => {
        console.log(this);
        const authorize = await auth.signInWithPopup(provider);
        dispatch({
            type: actionTypes.SET_USER,
            user: authorize.user
        });
        console.log(authorize);
        try {
            const users = await db.collection('users');
            const queryRef = await users.where('email', '==', authorize.user.email).get();
            if(queryRef.empty){
                console.log('empty');
                users.add({
                    email: authorize.user.email
                });
            }
            const queryReference = await users.where('email', '==', authorize.user.email).get();
            console.log(queryReference);
            queryReference.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                localStorage.setItem('token',doc.id);
                dispatch({
                    type: actionTypes.SET_USER_ID,
                    id: doc.id
                });
            });
            console.log(localStorage.getItem('token'));
            Auth.login(() => {
                props.history.push('/dashboard');
              });
        } catch(Error){
            console.log(Error);
        }
      
    }

    return (
        <div className="login">
            <div className="login__container">
                <img src={khata} alt="" />
                <div className="login__text">
                    <h1>Sign into KhataBook</h1>
                </div>
                <Button onClick={signIn}>
                    Sign In with Google
                </Button>
            </div>
        </div>
    )
}

export default Login;
