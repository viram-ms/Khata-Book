import React, {useState} from 'react';
import './InsertData.css';
import db from './firebase';
import {useStateValue} from './StateProvider';

function InsertData() {
    const [{user,id},dispatch] = useStateValue();
    const [amt,setAmt] = useState(100);
    const [desc, setDesc] = useState('cdsf');
    const [person, setPerson] = useState('adsg');
    const [time,setTime] = useState('safd');


    const onSubmit = async (e) => {
        e.preventDefault();
        // console.log(amt,desc,person,time);
        // db.collection('teamid').doc(id).collection('data').where('month','==','october2020').get().then((snap) => {
        //     snap.forEach(item => console.log(item.id,item.data()));
        // })

        const citiesRef = db.collection('teamid').doc(id).collection('data');
        const snapshot = await citiesRef.where('month', '==', 'october2020').get();
        if (snapshot.empty) {
        console.log('No matching documents.');
        }  

        snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
        });
    }

    return (
        <div className="InsertData">
            <form>
                <p>Enter Amount</p>
                <input type="number" value={amt} onChange={e => setAmt(e.target.value)} />
                <p>Enter Description</p>
                <input type="text" value={desc} onChange={e => setDesc(e.target.value)} />
                <p>Enter Person</p>
                <input type="text" value={person} onChange={e => setPerson(e.target.value)} />
                <p>Enter Time</p>
                <input type="text" value={time} onChange={e => setTime(e.target.value)} />
                <button type="submit" onClick={onSubmit}>Submit</button>
            </form>
        </div>
    )
}

export default InsertData
