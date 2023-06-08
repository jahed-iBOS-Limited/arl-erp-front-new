import React from 'react';
import { useHistory } from 'react-router-dom';
import ICustomCard from '../../../../_helper/_customCard';
import { TableHeader } from '../Table/TableHeader';




export default function OrganizationComponentLanding() {
    const history =useHistory();
    return (
        <ICustomCard title="Organization Component" createHandler={()=>{history.push("/human-capital-management/hcmconfig/organizationcomponent/create")}}>
             <TableHeader />
        </ICustomCard>
    )
}
