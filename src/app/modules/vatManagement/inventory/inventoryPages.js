import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Redirect, Switch } from 'react-router-dom';
import { ContentRoute } from '../../../../_metronic/layout';
import findIndex from './../../_helper/_findIndex';
import NotPermittedPage from './../../_helper/notPermitted/NotPermittedPage';
import { TransferOutIbosTable } from './transfer-out-ibos/Table/tableHeader';
import TransferOutIbosCreateForm from './transfer-out-ibos/create/addForm';

export default function InventoryPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual,
  );

  const transferOutIbos = userRole[findIndex(userRole, 'Transfer Out (IBOS)')];

  return (
    <Switch>
      <Redirect exact={true} from="/purchase" to="/mngVat/inventory" />
      {/* transfer-out-ibos */}
      <ContentRoute
        path="/mngVat/inventory/transferoutIbos/create"
        component={
          transferOutIbos?.isCreate
            ? TransferOutIbosCreateForm
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/mngVat/inventory/transferoutIbos"
        component={TransferOutIbosTable}
      />
    </Switch>
  );
}
