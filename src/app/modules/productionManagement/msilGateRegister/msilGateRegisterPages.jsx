import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import ContractorLabourRegister from "./contractorLabourRegister";
import ContractorLabourRegisterCreate from "./contractorLabourRegister/createEdit";
import GradingCreate from "./firstWeight/grading";
import GateInByPoLanding from "./gateInByPO";
import GateItemEntry from "./gateItemEntry";
import GateEntryCreate from "./gateItemEntry/createEdit";
import GateOutByDeliveryChallanLanding from "./gateOutByDeliveryChallan";
import GetOutByCard from "./gateOutByDeliveryChallan/gateOutByCard";
import GateOutByGatePassLanding from "./gateOutByGatePass";
import KeyRegisterLanding from "./keyRegister";
import KeyRegisterCreateEdit from "./keyRegister/createEdit";
import PhysicalTestLanding from "./physicalTest";
import PhysicalTestForm from "./physicalTest/createEdit";
import PhysicalTestReport from "./physicalTest/report";
import QcAndWeighment from "./qcAndWeighment";
import GradingCreateTwo from "./qualityCheck/grading";
import RentedVehicleRegisterLanding from "./rentedVehicleRegister";
import RentalVehicleInOutCreateEdit from "./rentedVehicleRegister/createEdit";
import RowMaterialAutoPR from "./rmAutoPR";
import RMPRItemList from "./rmAutoPR/prItemList";
import SecurityPostAssign from "./securityPostAssign";
import MSILSecurityPostAssignCreate from "./securityPostAssign/createEdit";
import VisitorRegisterLanding from "./visitorRegister";
import VisitorRegisterCreateEdit from "./visitorRegister/createEdit";
import Weightbridge from "./weightBridge";
import WeightbridgeEdit from "./weightBridge/createEdit";
import WeightScale from "./weightScale";

export function MsilGateRegisterPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let weightbridge = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1188) {
      weightbridge = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production-management"
        to="/production-management/msil-gate-register"
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Key-Register/edit/:id"
        component={KeyRegisterCreateEdit}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Key-Register/create"
        component={KeyRegisterCreateEdit}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Key-Register"
        component={KeyRegisterLanding}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Visitor-Register/edit/:id"
        component={VisitorRegisterCreateEdit}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Visitor-Register/create"
        component={VisitorRegisterCreateEdit}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Visitor-Register"
        component={VisitorRegisterLanding}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Rented-Vehicle-Register/edit/:id"
        component={RentalVehicleInOutCreateEdit}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Rented-Vehicle-Register/create"
        component={RentalVehicleInOutCreateEdit}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Rented-Vehicle-Register"
        component={RentedVehicleRegisterLanding}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Gate-Out-By-Delivery-Challan/card"
        component={GetOutByCard}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Gate-Out-By-Delivery-Challan"
        component={GateOutByDeliveryChallanLanding}
      />

      <ContentRoute
        path="/production-management/msil-gate-register/Gate-Out-By-Gate-Pass"
        component={GateOutByGatePassLanding}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Gate-In-By-PO"
        component={GateInByPoLanding}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Gate-Item-Entry/physicalTest/report"
        component={PhysicalTestReport}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Gate-Item-Entry/physicalTest/edit/:id"
        component={PhysicalTestForm}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Gate-Item-Entry/physicalTest/create"
        component={PhysicalTestForm}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Gate-Item-Entry/physicalTest"
        component={PhysicalTestLanding}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Gate-Item-Entry/edit/:id"
        component={GateEntryCreate}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Gate-Item-Entry/create"
        component={GateEntryCreate}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Gate-Item-Entry"
        component={GateItemEntry}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Weighbridge/edit/:editId"
        component={weightbridge?.isEdit ? WeightbridgeEdit : NotPermittedPage}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Weighbridge"
        component={weightbridge?.isView ? Weightbridge : NotPermittedPage}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Security-Post-Assign/edit/:id"
        component={MSILSecurityPostAssignCreate}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Security-Post-Assign/create"
        component={MSILSecurityPostAssignCreate}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Security-Post-Assign"
        component={SecurityPostAssign}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Contractor-Labour-Register/edit/:id"
        component={ContractorLabourRegisterCreate}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Contractor-Labour-Register/create"
        component={ContractorLabourRegisterCreate}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Contractor-Labour-Register"
        component={ContractorLabourRegister}
      />
      {/* FirstWeight */}

      <ContentRoute
        path="/production-management/msil-gate-register/First-Weight/grading/:id"
        component={GradingCreate}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/First-Weight/grading-two/:id"
        component={GradingCreateTwo}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/QCnWeighment"
        component={QcAndWeighment}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/Weight-Scale"
        component={WeightScale}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/RMAutoPO/create"
        component={RMPRItemList}
      />
      <ContentRoute
        path="/production-management/msil-gate-register/RMAutoPO"
        component={RowMaterialAutoPR}
      />
    </Switch>
  );
}
