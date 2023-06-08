import React from 'react';
import { useHistory } from 'react-router-dom';
import ICustomCard from '../../../../_helper/_customCard';
import { TableHeader } from '../Table/TableHeader';




export default function EmpHRLanding() {
    const history =useHistory();
    return (
        <ICustomCard title="HR Position" createHandler={()=>{history.push('/human-capital-management/hcmconfig/emphrposition/create')}}>
             <TableHeader />
        </ICustomCard>
    )
}
