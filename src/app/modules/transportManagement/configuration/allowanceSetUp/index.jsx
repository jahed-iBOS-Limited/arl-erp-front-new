import React from "react";
import { UiProvider } from "../../../_helper/uiContextHelper";
import MillageSetUpCreateForm from "./CreateM/millageaddForm";
import AllowanceSetUpCreateForm from "./Create/addForm";




function AllowanceSetUpLanding({ history }) {
  const uIEvents = {
    openEditPage: (id) => {
      history.push(`/transport-management/configuration/allowancesetup/${id}`);
    },
    openViewDialog: (id) => {
      history.push(`/transport-management/configuration/allowancesetup/view/${id}`);
    },
  };

  return (
    <UiProvider uIEvents={uIEvents}>
      <AllowanceSetUpCreateForm />
     
      <MillageSetUpCreateForm />
    </UiProvider>
  );
}
export default AllowanceSetUpLanding;
