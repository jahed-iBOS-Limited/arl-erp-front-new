import React from 'react';
import { useHistory } from 'react-router-dom';
import ICustomCard from '../../../../_helper/_customCard';
import { TableHeader } from '../Table/TableHeader';




export default function HRRumenarationComponentTypeLanding() {
    const history =useHistory();
    return (
        <ICustomCard title="Remuneration Type" createHandler={()=>{history.push('/human-capital-management/hcmconfig/hrrumenarationtype/create')}}>
             <TableHeader />
           
        </ICustomCard>
    )
}
