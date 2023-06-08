import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import VatAdjustmentCreateForm from "./vatAdjustment/create/addForm";
import VatAdjustmentLanding from "./vatAdjustment";
import findIndex from "./../../_helper/_findIndex";
import NotPermittedPage from "./../../_helper/notPermitted/NotPermittedPage";

export function VoucherPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const vATAdjustment = userRole[findIndex(userRole, "VAT Adjustment")];

  return (
    <Switch>
      <Redirect exact={true} from="/voucher" to="/mngVat/voucher" />

      {/* branch route */}
      <ContentRoute
        path="/mngVat/voucher/vat-adjustment/edit/:id"
        component={
          vATAdjustment?.isEdit ? VatAdjustmentCreateForm : NotPermittedPage
        }
      />

      <ContentRoute
        path="/mngVat/voucher/vat-adjustment/create"
        component={
          vATAdjustment?.isCreate ? VatAdjustmentCreateForm : NotPermittedPage
        }
      />

      <ContentRoute
        path="/mngVat/voucher/vat-adjustment"
        component={VatAdjustmentLanding}
      />
    </Switch>
  );
}

export default VoucherPages;
