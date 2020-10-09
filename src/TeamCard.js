import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import db from './firebase';
import AddIcon from '@material-ui/icons/Add';
import {Link} from 'react-router-dom'; 
import './TeamCard.css';
import {IconButton} from '@material-ui/core';
import notify from './toaster';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles({
  root: {
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 450,
    width: '87vw'
  },
});

function TeamCard({user_id, key, id, team_id, team_name}) {
    const classes = useStyles();
    const [teamId, setTeamId] = useState([]);

    useEffect(() => {
      async function call(){
      if(id){
          const citiesRef = db.collection('teamid');
          const snapshot = await citiesRef.where('id', '==', team_id).get();
          if (snapshot.empty) {
          console.log('No matching documents.');
          }  
          snapshot.forEach(async(doc) => {
              db.collection('teamid').doc(doc.id).collection('data').onSnapshot(snapshot => (
                  setTeamId(snapshot.docs.map((doc) => ({id: doc.id, data: doc.data()})))
              ))
          });         
      }
    }
    call();
    },[id]);

    const editTeamName = async (team_id, group_id,id) => {
      let x = prompt('Enter New Team Name');
      if(x){
        const res = await db.collection('teamid').where('id','==',team_id).get();
        if(!res.empty){
          res.forEach((item) => {
            db.collection('teamid').doc(item.id).collection('data').doc(group_id).update({month: x}).then(function(){
                notify('Name Updated Successfully','info')
            })
          })
        }
      }
    }

    const deleteTeam = async (team_id, group_id,id) => {
      let x = window.confirm("Do you really want to delete team?")
      if(x === true){
        const res = await db.collection('teamid').where('id','==',team_id).get();
        if(!res.empty){
          res.forEach((item) => {
            db.collection('teamid').doc(item.id).collection('data').doc(group_id).delete().then(function(){
                notify('Team Deleted Successfully','info')
            })
          })
        }
      }
    }

    const deleteGroup = async (team_id,group_id) => {
      let x = window.confirm("Do you really want to delete team?")
      if(x === true){
        const res = await db.collection('teamid').where('id','==',team_id).get();
        if(!res.empty){
          res.forEach((item) => {
            db.collection('teamid').doc(item.id).delete().then(function(){
            db.collection('users').doc(user_id).collection('groups').doc(group_id).delete().then(function(){
              notify('Group Deleted Successfully','info');
            })
          });
          })
        }
      }
    }

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
        <div> 
            <Card className={classes.root}>
            <CardContent>
              <div className="ParentDiv">
                <div className="GroupDiv">
                  <h2>{team_name.toUpperCase()}</h2>
                  <p>Group Name</p>
                </div>
                <div>
                  <h2>{team_id.toUpperCase()}</h2>
                  <p>Group Id</p>
                </div>  
              </div>   
              <div className="ChildDiv">
                <h3>Add New Group</h3>
                <IconButton onClick={createMonth} style={{padding: 0,marginLeft: 10}}>
                      <AddIcon />
                </IconButton>
              </div>
              {teamId && teamId.map(item => (
                  <div className="Teams">
                    <Link to={`/dashboard/${team_id}/${item.id}/${item.data.month}`}>
                      <p>{item.data.month}</p>
                    </Link>
                    <IconButton onClick={editTeamName.bind(this,team_id,item.id,id)}>
                      <EditIcon className="avatar" />
                    </IconButton>
                    <IconButton onClick={deleteTeam.bind(this,team_id,item.id,id)}>
                      <DeleteIcon className="avatar" />
                    </IconButton>
                  </div>
              ))}
            </CardContent>
            <CardActions>
                <Button size="small" onClick={deleteGroup.bind(this,team_id,id)}>Delete Team</Button>
            </CardActions>
            </Card>
        </div>
    )
}

export default TeamCard
