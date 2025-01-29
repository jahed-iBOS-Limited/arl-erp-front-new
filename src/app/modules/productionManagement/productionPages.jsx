import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../_metronic/layout";
import { AcclFactoryPages } from "./acclFactory/acclFactoryPages";
import { AcclFactoryReportPages } from "./acclFactoryReport/acclFactoryReportPages";
import { ConfigurationPages } from "./configuration/configurationPages";
import { ManufacturingExecutionSystemPages } from "./manufacturingExecutionSystem/manufacturingExecutionSystemPages";
import { MsilElectricalDepartmentPages } from "./msilElectricalDepartment/msilElectricalDepartmentPages";
import { MsilGateRegisterPages } from "./msilGateRegister/msilGateRegisterPages";
import { MilProductionPages } from "./msilProduction/msilProductionPages";
import { MsilProductionBreakdownPages } from "./msilProductionBreakdown/msilProductionBreakdownPages";
import MSILReportsPages from "./msilReport/msilReportsPages";
import { MsilRollingDepartmentPages } from "./msilRollingDepartment/msilRollingDepartmentPages";
import { MsilStoreDepartmentPages } from "./msilStoreDepartment/msilStoreDepartmentPages";
import { MesReportPages } from "./report/reportPages";
import { salesAndOperationsPlanning } from "./salesAndOperationPlanning/salesAndOpearationPlanning";

export function ProductionPages() {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production-management"
        to="/production-management/mes/bill-of-material"
      />
      <ContentRoute
        path="/production-management/msil-report"
        component={MSILReportsPages}
      />
      <ContentRoute
        path="/production-management/mes"
        component={ManufacturingExecutionSystemPages}
      />
      <ContentRoute
        path="/production-management/msil-Production"
        component={MilProductionPages}
      />
      <ContentRoute
        path="/production-management/msil-gate-register"
        component={MsilGateRegisterPages}
      />
      <ContentRoute
        path="/production-management/msil-Rolling"
        component={MsilRollingDepartmentPages}
      />
      <ContentRoute
        path="/production-management/msil-Store"
        component={MsilStoreDepartmentPages}
      />
      <ContentRoute
        path="/production-management/ACCLFactory"
        component={AcclFactoryPages}
      />
      <ContentRoute
        path="/production-management/accl-factory-report"
        component={AcclFactoryReportPages}
      />
      <ContentRoute
        path="/production-management/msil-ProductionBreakdown"
        component={MsilProductionBreakdownPages}
      />
      <ContentRoute
        path="/production-management/configuration"
        component={ConfigurationPages}
      />

      <ContentRoute
        path="/production-management/configuration"
        component={ConfigurationPages}
      />

      <ContentRoute
        path="/production-management/salesAndOperationsPlanning"
        component={salesAndOperationsPlanning}
      />

      <ContentRoute
        path="/production-management/report"
        component={MesReportPages}
      />
      <ContentRoute
        path="/production-management/msil-Electrical"
        component={MsilElectricalDepartmentPages}
      />
    </Switch>
  );
}

export default ProductionPages;
