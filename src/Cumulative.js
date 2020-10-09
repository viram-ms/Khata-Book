import React, {useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useParams} from 'react-router-dom';
import db from './firebase';
import MUIDataTable from "mui-datatables";
import './Cumulative.css';


const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }));

  const columns = [
    {
     name: "member",
     label: "Member",
     options: {
      filter: true,
      sort: true,
     }
    },
    {
     name: "desc",
     label: "Description",
     options: {
      filter: true,
      sort: false,
     }
    },
    {
     name: "amt",
     label: "Amount",
     options: {
      filter: true,
      sort: false,
     }
    },
    {
     name: "timestamp",
     label: "Date",
     options: {
      filter: true,
      sort: false,
     }
    },
   ];
    
    
   const options = {
     filterType: 'checkbox',
   };

function Cumulative() {
    const classes = useStyles();
    const [state, setState] = React.useState('');
    const {roomId, teamId,teamName} = useParams();
    const [transactions, setTransactions] = useState([]);
    const [members, setMembers] = useState([]);
    const [individualTrans, setIndividualTrans] = useState([]);
    const [individualAmt, setIndividualAmt] = useState();
    const [show,setShow] = useState(false);

    useEffect(() => {
        async function Call(){
            const snapsnhot = await db.collection('teamid').where('id','==',roomId).get();
            if(snapsnhot.empty){
                console.log('empty');
            } else {
                snapsnhot.forEach(async(doc) => {
                    const res = await db.collection('teamid').doc(doc.id).collection('data').doc(teamId).collection('transactions').onSnapshot((doc) => {
                        setTransactions(doc.docs.map((item) => item.data()))
                    })
                    const res_members = await db.collection('teamid').doc(doc.id).collection('members').onSnapshot((doc) => {
                        setMembers(doc.docs.map((item) => item.data().name))
                    })
                })
            }
        }

        Call();
    },[roomId,teamId])


    useEffect(() => {
        setShow(false)
    },[state])


    const handleSubmit = async () => {
        const snapsnhot = await db.collection('teamid').where('id','==',roomId).get();
        if(snapsnhot.empty){
            console.log('empty');
        } else {
            snapsnhot.forEach(async(doc) => {
                const res = await db.collection('teamid').doc(doc.id).collection('data').doc(teamId).collection('transactions').where('member','==',state).onSnapshot(snapshot => {
                    setIndividualTrans(snapshot.docs.map((item) => item.data()))
                });
            });
        }
        if(individualTrans){
            setIndividualAmt(Sum(individualTrans))
            setShow(true)
        }

    }


    const Sum = (transaction) => {
        let sum = 0;
        for(let i=0;i<transaction.length;i++){
            sum += parseInt(transaction[i].amt);
        }
        return sum;
    }
    return (
        <div className="Cumulative">
            <h2>Cumulative Expense: {`${Sum(transactions)}`}</h2>
            <h3>Check Individual Expenses </h3>
            <div className="SumDiv">
                <div className="SelectDiv">
                    <select native value={state}onChange={e => setState(e.target.value)}>
                        <option>Pls Select Person</option>
                        {members && members.map((item,key) =>  <option key={key} value={item}>{item}</option>)}
                    </select>
                    <button onClick={handleSubmit}>submit</button>
                </div>
            </div>            
            {show && 
                    <MUIDataTable
                    title={`Total Expense For ${state} is Rs. ${Sum(individualTrans)}`}
                    data={individualTrans}
                    columns={columns}
                    options={options}
                    />
            }
        </div>
    )
}

export default Cumulative
