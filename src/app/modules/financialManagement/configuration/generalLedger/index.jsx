import React from "react";
import { ControllingUnitTable } from "./Table/tableHeader";
import { UiProvider } from "../../../_helper/uiContextHelper";

import './generalLedgerCustom.css';

const GeneralLedger = ({ history })=> {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <ControllingUnitTable />
    </UiProvider>
  );
};
export default GeneralLedger;