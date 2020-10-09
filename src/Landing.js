import React, {useState, useEffect} from 'react'
import db from './firebase';
import Sidebar from './Sidebar';
import TeamCard from './TeamCard';
import './Landing.css';
import TeamsJPG from './team.jpg';


function Landing() {
    const [teams, setTeams] = useState([]);
    // const [{user}, dispatch] = useStateValue();
    const email = localStorage.getItem('email');
    const id = localStorage.getItem('token');
    useEffect(() => {
        async function Call(){
            if(email){
                const citiesRef = db.collection('users');
                const snapshot = await citiesRef.where('email', '==', email).get();
                if (snapshot.empty) {
                console.log('No matching documents.');
                }  else {
                snapshot.forEach(doc => {
                db.collection('users').doc(doc.id).collection('groups').onSnapshot((snapshot) => {
                    setTeams(snapshot.docs.map(docss => (
                        {
                            id: docss.id,
                            data: docss.data(),
                        }
                    )))
                    });
                });
            }
        }
        }
        Call();
      },[email]);



    return (
        <div>
            <Sidebar />
            <div className="Landing"> 
            {teams.map(team => (
                        <TeamCard user_id={id} key={team.id} id={team.id} team_id={team.data.id} team_name={team.data.name} />
            ))}
            {teams.length === 0 &&  <div className="PhotoDiv"><img src={TeamsJPG} className="LandingImg" /><h2>No Teams yet. When you make some, they’ll show up here.</h2></div> }
            </div>
        </div>
    )
}

export default Landing
