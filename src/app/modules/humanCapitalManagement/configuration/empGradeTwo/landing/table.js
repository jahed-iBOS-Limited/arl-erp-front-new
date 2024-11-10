import React from 'react'
import { useHistory } from 'react-router';
import ICustomCard from '../../../../_helper/_customCard'

const EmpGradeTableTwo = () => {

    const history = useHistory();

    return (
        <ICustomCard title="Employee Grade Two" createHandler={() => {
            history.push("/human-capital-management/hcmconfig/empgrade/create")
        }}>
            hello world
        </ICustomCard>
    )
}

export default EmpGradeTableTwo
