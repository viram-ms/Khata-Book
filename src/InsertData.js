import React, {useState} from 'react';
import './InsertData.css';

function InsertData() {
    const [amt,setAmt] = useState('');
    const [desc, setDesc] = useState('');
    const [person, setPerson] = useState('');
    const [time,setTime] = useState('');


    const onSubmit = (e) => {
        e.preventDefault();
        console.log(amt,desc,person,time);
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
