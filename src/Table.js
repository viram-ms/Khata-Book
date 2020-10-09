import React, {useEffect,useState} from 'react'
import MUIDataTable from "mui-datatables";
import {useParams} from 'react-router-dom';
import db from './firebase';
 
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
     responsive: 'standard'
   };
    

function Table() {
    const {roomId, teamId} = useParams();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        async function Call(){
        const snapsnhot = await db.collection('teamid').where('id','==',roomId).get();

        if(snapsnhot.empty){

        } else {
            snapsnhot.forEach(async(doc) => {
                const res = await db.collection('teamid').doc(doc.id).collection('data').doc(teamId).collection('transactions').onSnapshot((doc) => {
                    setTransactions(doc.docs.map((item) => item.data()))
                })
            })
        }
    }
    Call();

    },[roomId,teamId]);
    return (
        <div>
            {transactions && 
                <MUIDataTable
                title={"Expense List"}
                data={transactions}
                columns={columns}
                options={options}
                />
        }
        </div>
    )
}

export default Table

