import React from 'react'
import { RegisterReport } from '../RegisterReport'

const Employee = () => {
  return (
    <RegisterReport title="Employee" registerTypeId={7} partnerTypeId={3} partnerTypeName={"Employee"} />
  )
}

export default Employee