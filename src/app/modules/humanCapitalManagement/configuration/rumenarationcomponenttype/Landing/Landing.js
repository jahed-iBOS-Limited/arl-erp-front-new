import React from 'react';
import { useHistory } from 'react-router-dom';
import ICustomCard from '../../../../_helper/_customCard';
import { TableHeader } from '../Table/TableHeader';




export default function RumenarationComponentLanding() {
    const history =useHistory();
    return (
        <ICustomCard title="Rumenaration Component Type" createHandler={()=>{history.push('/human-capital-management/hcmconfig/hrrumenarationcmptype/create')}}>
             <TableHeader />
           
        </ICustomCard>
    )
}
