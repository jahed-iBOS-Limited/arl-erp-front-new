import React from 'react'
import CreateInventoryLoanForm from '../../inventoryLoan/form/addEditForm'

const ExternalLoan = ({ loanType }) => {
  return (
    <>
      <CreateInventoryLoanForm loanType={ loanType }/>
    </>
  )
}

export default ExternalLoan