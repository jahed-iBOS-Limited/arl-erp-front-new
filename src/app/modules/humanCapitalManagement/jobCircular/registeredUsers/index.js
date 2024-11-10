import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import LoanApplicationTable from "./Table/TableHeader";
import './loanApplication.css'

export default function LoanApplication({ history }) {
  const uIEvents = {};

  return (
    <UiProvider uIEvents={uIEvents}>
      <LoanApplicationTable></LoanApplicationTable>
    </UiProvider>
  );
}
