import React from 'react';
import { Route } from 'react-router-dom';
import { ViewModal } from './priceStructureView/viewModal';
import { PriceStructureLandingCard } from "./priceStructureTable/priceStructureLandingCard"
import { UiProvider } from '../../../_helper/uiContextHelper';

export default function PriceStructure({ history }) {
  const uIEvents = {
    openViewDialog: (id) => {
      history.push(`/config/material-management/price-structure/view/${id}`);
    }
  };
  return (
    <>
      <UiProvider uIEvents={uIEvents}>
        <Route path="/config/material-management/price-structure/view/:id">
          {({ history, match }) => (
            <ViewModal
              show={match != null}
              id={match && match.params.id}
              history={history}
              onHide={() => {
                history.push("/config/material-management/price-structure")
              }} />
          )}
        </Route>
        <PriceStructureLandingCard />
      </UiProvider>
    </>
  )
};

