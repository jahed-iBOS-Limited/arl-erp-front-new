import React from 'react';
import { Route } from 'react-router-dom';
import ApproveTable from './Table/table';
import Form from './View/viewModal';

export default function Approve() {
  return (
    <>
      <ApproveTable />
      <Route path="/performance-management/individual-kpi/individual-kpi-approve/view/:kpiId/:frId/:year/:enroll">
        {({ history, match }) => (
          <Form
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push(
                '/performance-management/individual-kpi/individual-kpi-approve'
              );
            }}
          />
        )}
      </Route>
    </>
  );
}
