import React from 'react';
import { useHistory } from 'react-router-dom';
import ICustomCard from '../../../../_helper/_customCard';
import { TableHeader } from '../Table/TableHeader';




export default function HRRumenarationComponentLanding() {
    const history =useHistory();
    return (
        <ICustomCard title="Remuneration Component" createHandler={()=>{history.push('/human-capital-management/hcmconfig/hrrumenarationcomponent/create')}}>
             <TableHeader />
           
        </ICustomCard>
    )
}
