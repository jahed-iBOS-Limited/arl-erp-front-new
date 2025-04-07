import React from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import IForm from '../../../_helper/_form';
import Loading from '../../../_helper/_loading';
import ExternalLoan from './Components/ExternalLoan';
import InternalLoan from './Components/InternalLoan';

export default function InventoryLoanCreateEditNew() {
  return (
    <>
      {false && <Loading />}
      <IForm isHiddenReset isHiddenBack isHiddenSave title={'Inventory Loan'}>
        <Tabs
          defaultActiveKey="internal-loan"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab unmountOnExit eventKey="internal-loan" title="Internal Loan">
            <InternalLoan loanType={1} />
          </Tab>
          <Tab unmountOnExit eventKey="external-loan" title="External Loan">
            <ExternalLoan loanType={2} />
          </Tab>
        </Tabs>
      </IForm>
    </>
  );
}
