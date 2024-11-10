// import React from "react";
// import { UiProvider } from "../../../_helper/uiContextHelper";
// import { ProductionTable } from "./Table/tableHeader";

// function PrimarySalesLanding({ history }) {
//   const uIEvents = {
//     openEditPage: (id) => {
//       history.push(`/rtm-management/primarySale/salesTarget/edit/${id}`);
//     },
//   };

//   return (
//     <UiProvider uIEvents={uIEvents}>
//       <ProductionTable />
//     </UiProvider>
//   );
// }
// export default PrimarySalesLanding;

import React from "react";
import SalesTargetCreateForm from "./Form/addEditForm";
import "./style.css";
function salesTarget() {
  return (
    <div>
      <SalesTargetCreateForm />
    </div>
  );
}

export default salesTarget;
