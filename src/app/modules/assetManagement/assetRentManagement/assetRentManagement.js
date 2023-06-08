import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import CreateAssetRentForm from "./assetRent/form/addEditForm";
import AssetRentLanding from "./assetRent/landing";
import AssetRentInvoiceForm from "./assetRentInvoice/form/addEditForm";
import AssetRentInvoiceLanding from "./assetRentInvoice/landing";

export function AssetRentManagementPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/mngAsset/assetRentMangmnt"
        to="/mngAsset/report"
      />

      {/* Asset Rent */}
      <ContentRoute
        from="/mngAsset/assetRentMangmnt/rentAsset/:type/:id"
        component={CreateAssetRentForm}
      />
      <ContentRoute
        from="/mngAsset/assetRentMangmnt/rentAsset/create"
        component={CreateAssetRentForm}
      />
      <ContentRoute
        from="/mngAsset/assetRentMangmnt/rentAsset"
        component={AssetRentLanding}
      />
      <ContentRoute
        from="/mngAsset/assetRentMangmnt/rentAssetInvoice/:type/:id"
        component={AssetRentInvoiceForm}
      />
      <ContentRoute
        from="/mngAsset/assetRentMangmnt/rentAssetInvoice/create"
        component={AssetRentInvoiceForm}
      />
      <ContentRoute
        from="/mngAsset/assetRentMangmnt/rentAssetInvoice"
        component={AssetRentInvoiceLanding}
      />
    </Switch>
  );
}
