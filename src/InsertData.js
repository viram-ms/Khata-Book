import React, {useState, useEffect} from 'react';
import './InsertData.css';
import db from './firebase';
import {useParams} from 'react-router-dom';
import notify from './toaster';


function InsertData() {
    const [amt,setAmt] = useState();
    const [desc, setDesc] = useState('');
    const [person, setPerson] = useState('');
    const [time,setTime] = useState();
    const {roomId, teamId, teamName} = useParams();
    const [members, setMembers] = useState([]);

    useEffect(() => {
        async function Call(){
            const snapsnhot = await db.collection('teamid').where('id','==',roomId).get();
            if(snapsnhot.empty){
                console.log('empty');
            } else {
                snapsnhot.forEach(async(doc) => {
                    const res_members = await db.collection('teamid').doc(doc.id).collection('members').onSnapshot((doc) => {
                        setMembers(doc.docs.map((item) => item.data().name))
                    })
                })
            }
        }

        Call();
    },[roomId,teamId])


    const onSubmit = async (e) => {
        e.preventDefault();
        if(amt && desc && time && person){

        const snapsnhot = await db.collection('teamid').where('id','==',roomId).get();
        if(snapsnhot.empty){
            console.log('empty');
        } else {
            snapsnhot.forEach(async(doc) => {
                const res = await db.collection('teamid').doc(doc.id).collection('data').doc(teamId).collection('transactions').add({amt:amt, desc: desc, member: person, timestamp: time})
                if(res.id){
                    notify('Data Entered Successfully','info');
                    setAmt();
                    setDesc();
                    setTime();
                } else {
                    notify('Error Occured','error');
                }
            })
        }
    } else {
        notify('Pls fill all fields','error');
    }
    }

    return (
        <div className="InsertData">
            <form>
                <p>Enter Amount</p>
                <input type="number" value={amt} onChange={e => setAmt(e.target.value)} required/>
                <p>Enter Description</p>
                <input type="text" value={desc} onChange={e => setDesc(e.target.value)} required/>
                <div className="InsertDataDiv">
                    <div className="InputDiv">
                        <p>Enter Person</p>
                        <select required value={person} onChange={e => setPerson(e.target.value)}>
                        <option>Pls Select Person</option>
                        {members && members.map((item,key) =>  <option key={key} value={item}>{item}</option>)}
                        </select>
                    </div>
                    <div className="InputDiv">
                        <p>Enter Time</p>
                        <input  type="date" value={time} onChange={e => setTime(e.target.value)} required />
                    </div>
                </div>
                <button type="submit" onClick={onSubmit}>Submit</button> 
            </form>
        </div>
    )
}

export default InsertData
