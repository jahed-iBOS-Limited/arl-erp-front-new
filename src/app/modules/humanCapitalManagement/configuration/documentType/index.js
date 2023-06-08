import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import { DocumentTypeTable } from "./Landing/tableHeader";

function DocumentTypeLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(
        `/human-capital-management/hcmconfig/documenttype/edit/${id}`
      );
    }
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <DocumentTypeTable />
    </UiProvider>
  );
}
export default DocumentTypeLanding;
