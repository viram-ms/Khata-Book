import React, {useState, useEffect} from 'react';
import './SidebarTeam.css';
import db from './firebase';
import {Link} from 'react-router-dom'; 
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {useStateValue} from './StateProvider';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import AddIcon from '@material-ui/icons/Add';


function SidebarTeam({user_id, id, team_name, team_id,addNewTeam, joinNewTeam}) {
    const [{user, teams},dispatch] = useStateValue();
    const [teamId, setTeamId] = useState([]);
    const [openList, setOpenList] = React.useState(false);
    useEffect(() => {
        async function call(){
        if(id){
            const citiesRef = db.collection('teamid');
            const snapshot = await citiesRef.where('id', '==', team_id).get();
            if (snapshot.empty) {
            console.log('No matching documents.');
            }  
            await snapshot.forEach(async(doc) => {
                db.collection('teamid').doc(doc.id).collection('data').onSnapshot(snapshot => (
                    setTeamId(snapshot.docs.map((doc) => ({id: doc.id, data: doc.data()})))
                ))
            });
        }
    }
    call();
    },[id]);

  
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

    const createMonth = async () => {
        if(id){
            let time = prompt("Enter Month and year");
            const citiesRef = db.collection('teamid');
            const snapshot = await citiesRef.where('id', '==', team_id).get();
            if (snapshot.empty) {
                console.log('No matching documents.');
            }  
            snapshot.forEach((doc) => {
                db.collection('teamid').doc(doc.id).collection('data').add({
                    month: time
                });
            });
        }
    }

    return (
        <div className="SidebarTeams">
            <ListItem button onClick={handleClick}>
            <ListItemText primary={team_name} secondary={team_id} />
                <ListItemIcon >
                    <AddIcon onClick={createMonth}/>
                </ListItemIcon>
                {openList ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            {teamId && teamId.map(item => (
            <Collapse in={openList} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                <ListItem button >
                    <ListItemIcon>
                        <FiberManualRecordIcon />
                    </ListItemIcon>
                    <Link to={`/dashboard/${team_id}/${item.id}/${item.data.month}`}>
                        <ListItemText primary={item.data.month} />
                    </Link>
                </ListItem>
                </List>
            </Collapse> ))}
            {teamId.length === 0 && <Collapse in={openList} timeout="auto" unmountOnExit><p className="EmptyList">No Groups Formed</p> </Collapse>}
        </div>
    )
}

export default SidebarTeam
