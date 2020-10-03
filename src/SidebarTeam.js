import { Avatar } from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import './SidebarTeam.css';
import db from './firebase';
import {Link} from 'react-router-dom'; 
import { makeStyles, useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {useStateValue} from './StateProvider';
import StarBorder from '@material-ui/icons/StarBorder';
import firebase from 'firebase';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }));


function SidebarTeam({user_id, id, team_name, team_id,addNewTeam, joinNewTeam}) {
    // console.log(user_id,id);
    const [{user},dispatch] = useStateValue();
    const [lastmessage, setLastMessage] = useState('');
    const [generatedcode,setGeneratedCode] = useState('');
    const [code, setCode] = useState('');
    const [openList, setOpenList] = React.useState(true);
    const classes = useStyles();

    useEffect(() => {
        // if(id){
        //     db.collection('Rooms').doc(id).collection('messages')
        //     .orderBy('timestamp','desc')
        //     .onSnapshot(snapshot => (
        //         setLastMessage(snapshot.docs.map((doc) => (
        //             doc.data())))
        //     ))
        // }
        async function call(){
        if(id){
            const citiesRef = db.collection('teamid').doc('D8MZDPfPhdeC3Gi65Cgg').collection('data');
            const snapshot = await citiesRef.where('month', '==', 'october2020').get();
            if (snapshot.empty) {
            console.log('No matching documents.');
            }  
    
            snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            });
        }
    }
    call();
    },[id])

    // const createChat = () => {
    //     const chatRoom = prompt("Please enter name for chat room");

    //     if(chatRoom) {
    //         db.collection('Rooms').add({
    //             name: chatRoom,
    //         });
    //     }
    // }

    const createTeam =  () => {
        let team_id = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
        let team_name = prompt("enter team name");
        db.collection('users').doc(user_id).collection('groups').add({
            name: team_name,
            id: team_id
        });
        db.collection('teamid').add({
            id: team_id,
            name: team_name,
        }).then(function(docRef) {
            db.collection('teamid').doc(docRef.id).collection('members').add({
                name: user.displayName,
            })
        });
    }

    const joinTeam = async () => {
        let team_id = prompt("enter team id");
        let team_name = prompt("enter team name");

        const check =await db.collection('teamid').where('id','==',team_id).get();
        
        if(check.empty){
            alert('enter correct team id');
        } else {
            
            db.collection('users').doc(user_id).collection('groups').add({
                name: team_name,
                id: team_id
            });
            db.collection('teamid').doc(check.id).collection('members').add({
                name: user.displayName
            });
        }  
    }

    const handleClick = () => {
        setOpenList(!openList);
    };

    return !addNewTeam ? (
        <div>
            <ListItem button onClick={handleClick}>
                <ListItemIcon>
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={team_name} secondary={team_id} />
                {openList ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={openList} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                <ListItem button className={classes.nested}>
                    <ListItemIcon>
                        <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="October" />
                </ListItem>
                <ListItem button className={classes.nested}>
                    <ListItemIcon>
                        <StarBorder />
                    </ListItemIcon>
                    <ListItemText primary="November" />
                </ListItem>
                </List>
            </Collapse>
        </div>
    ):(
        <div>
            <div onClick={createTeam} className="SidebarChat">
                    <h2>Create New Team</h2>
            </div>
            <div onClick={joinTeam} className="SidebarChat">
                    <h2>Join New Team</h2>
            </div>
        </div>
    )
}

export default SidebarTeam
