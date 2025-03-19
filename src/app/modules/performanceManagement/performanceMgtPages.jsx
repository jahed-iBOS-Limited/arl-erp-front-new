import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { Suspense } from "react";
import KpiEntryForm from "./individualKpi/kpiTargetEntry/Form/addEditForm";
import PerformanceForm from "./individualKpi/PerformanceChart/Form/addEditForm";
import { KpiEntryLanding } from "./individualKpi/kpiTargetEntry";
import { BalancedScore } from "./individualKpi/balancedScore";
import kpiDashboard from "./individualKpi/kpiDashboard";
import IndividualKpiEditForm from "./individualKpi/kpiTargetEntry/Edit/EditForm";
import { StrategicParticulars } from "./strategicParticulars";
import StrategicParticularsForm from "./strategicParticulars/Form/addEditForm";
import { CoreValues } from "./coreValues";
import CoreValuesForm from "./coreValues/Form/addEditForm";
import { Competency } from "./competency";
import CompetencyForm from "./competency/Form/addEditForm";
import { ValuesAndCompetencyEmployee } from "./values_competency_employee";
import { ValuesCompetencySupervisor } from "./values_competency_supervisor";
import { PmsDimension } from "./pmsDimension";
import PmsDimensionForm from "./pmsDimension/Form/addEditForm";
import { MeasuringScaleMain } from "./measuringScale";
import MeasuringScaleForm from "./measuringScale/Form/addEditForm";
import { DepartmentalKpiEntryLanding } from "./departmentalKpi/kpiTargetEntry";
import DeapartmentalKpiEntryForm from "./departmentalKpi/kpiTargetEntry/Form/addEditForm";
import { SBUKpiEntryLanding } from "./sbuKpi/kpiTargetEntry";
import SBuKpiEntryForm from "./sbuKpi/kpiTargetEntry/Form/addEditForm";
import DepPerformanceForm from "./departmentalKpi/PerformanceChart/Form/addEditForm";
import DepAchievement from "./departmentalKpi/achievement";
import { DepBalancedScore } from "./departmentalKpi/balancedScore";
import SbuAchievement from "./sbuKpi/achievement";
import { SbuBalancedScore } from "./sbuKpi/balancedScore";
import DepkpiDashboard from "./departmentalKpi/kpiDashboard";
import SbukpiDashboard from "./sbuKpi/kpiDashboard";
import StrViewForm from "./strategicParticulars/ViewModal/mainForm";
import IndBSCPrint from "./individualKpi/balancedScore/Print/Header";
import DepKpiEditForm from "./departmentalKpi/kpiTargetEntry/Edit/EditForm";
import SbuPerformanceForm from "./sbuKpi/PerformanceChart/Form/addEditForm";
import SbuKpiEditForm from "./sbuKpi/kpiTargetEntry/Edit/EditForm";
import DepBSCPrint from "./departmentalKpi/balancedScore/Print/Header";
import SBUBSCPrint from "./sbuKpi/balancedScore/Print/Header";
import NotPermitted from "./notPermittedPage/notPermitted";
import { shallowEqual, useSelector } from "react-redux";
import Approve from "./individualKpi/approve";
import Strategicmap from "./strategicmap";
import { KpiConfigureLandingTable } from "./individualKpi/kpiConfigure/Table/tableHeader";
import KpiConfigureForm from "./individualKpi/kpiConfigure/Form/addEditForm";
import KPIConfigureExtendForm from "./individualKpi/kpiConfigure/extend/addEditForm";
import { PerformanceAppraisal } from "./report/performanceAppraisal";
import AchievementTableFromReport from "./report/performanceAppraisal/view/table";
import { EmpValuesAndcompetency } from "./report/empValuesAndcompetency/Table/tableHeader";
import { ValuesAndCompetencyEmployeeEntry } from "./report/empValuesAndcompetency/View/index";
import { CopyKpi } from "./individualKpi/copyKpi/index";
import { CorporateKpiEntryLanding } from "./corporateKpi/kpiTargetEntry/index";
import CorporateKpiEntryForm from "./corporateKpi/kpiTargetEntry/Form/addEditForm";
import CorporateKpiEditForm from "./corporateKpi/kpiTargetEntry/Edit/EditForm";
import CorporatePerformanceForm from "./corporateKpi/PerformanceChart/Form/addEditForm";
import CorporateAchievement from "./corporateKpi/achievement/index";
import CorporateBSCPrint from "./corporateKpi/balancedScore/Print/Header";
import { CorporateBalancedScore } from "./corporateKpi/balancedScore/index";
import CorporatekpiDashboard from "./corporateKpi/kpiDashboard/index";
import { CorporateInitiativeForm } from "./corporateKpi/CorporateInitiative/form/addEditForm";
import { StrategicYearPlan } from "./stategyYearsPlan/index";
import { SBUInitiativeForm } from "./sbuKpi/sbuInitiative/form/addEditForm";
import { DepartmentInitiativeForm } from "./departmentalKpi/departmentInitiative/form/addEditForm";
import { IndividualInitiativeForm } from "./individualKpi/individualInitiative/form/addEditForm";
import AchievementTable from "./individualKpi/achievement/Table/table";
import { PIP } from "./report/pip";
import { SBUProjectForm } from "./sbuKpi/sbuProject/form/addEditForm";
import { DepartmentProjectForm } from "./departmentalKpi/departmentProject/form/addEditForm";
import { KpiMasterForm } from "./kpiMaster/Form/addEditForm";
import { KpiLanding } from "./kpiMaster";
import KPIAchievementSetup from "./individualKpi/kpiAchievementSetup/kpiAchievementSetup";
import EmployeeCostReport from "./report/employeeCost/Table/table";
import ZoneVSTerritorySalesReport from "./report/zoneVSTerritorySales/table";
import BulkKPIEntryLanding from "./report/bulkKPIEntry/landingPage/table";
import BulkKPIEntryForm from "./report/bulkKPIEntry/form/addEditForm";

export function PerformanceMgtPages() {
  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let strategicPlan = null;
  let fiveYearsPlan = null;
  let depKpiTarget = null;
  let depKpiResult = null;
  let depKpiScoreCard = null;
  let depKpiDashboard = null;
  let depKpiInitiative = null;
  let sbuKpiTarget = null;
  let sbuKpiResult = null;
  let sbuKpiScore = null;
  let sbuKpiDashboard = null;
  let sbuKpiInitiative = null;
  let corKpiTarget = null;
  let corKpiResult = null;
  let corKpiScore = null;
  let corKpiDashboard = null;
  let corKpiInitiative = null;
  let reportEmpValuesComp = null;
  let empKpiReport = null;
  let indKpiTarget = null;
  let indKpiApprove = null;
  let copyKPI = null;
  let configPmsDimension = null;
  let configPmsMeasuring = null;
  let configPmsCoreValues = null;
  let configPmsCoreCompetencies = null;
  let kpiMasterData = null;
  let valuesCompSupEntry = null;
  let indKPIEntry = null;
  let indDashboard = null;
  let indScoreCard = null;
  let indInitiative = null;
  let PIPReport = null;
  let departmentProject = null;
  let sbuProject = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 288) {
      indInitiative = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 980) {
      departmentProject = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1039) {
      kpiMasterData = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 981) {
      sbuProject = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 166) {
      indScoreCard = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 166) {
      indDashboard = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 240) {
      indKPIEntry = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 180) {
      valuesCompSupEntry = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 160) {
      configPmsCoreCompetencies = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 159) {
      configPmsCoreValues = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 182) {
      configPmsMeasuring = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 181) {
      configPmsDimension = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 287) {
      copyKPI = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 183) {
      indKpiApprove = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 161) {
      indKpiTarget = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 283) {
      empKpiReport = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 282) {
      reportEmpValuesComp = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 281) {
      corKpiInitiative = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 280) {
      corKpiDashboard = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 278) {
      corKpiScore = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 277) {
      corKpiResult = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 275) {
      corKpiTarget = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 274) {
      sbuKpiInitiative = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 178) {
      sbuKpiDashboard = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 176) {
      sbuKpiScore = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 175) {
      sbuKpiResult = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 173) {
      sbuKpiTarget = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 273) {
      depKpiInitiative = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 172) {
      depKpiDashboard = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 170) {
      depKpiScoreCard = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 169) {
      depKpiResult = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 167) {
      depKpiTarget = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 272) {
      fiveYearsPlan = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 158) {
      strategicPlan = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 285) {
      PIPReport = userRole[i];
    }
  }

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect
          exact={true}
          from="/performance-management"
          to="/performance-management/core_values"
        />

        {/* Individual kpi => Individual kpi Approve */}

        <ContentRoute
          path="/performance-management/individual-kpi/individual-kpi-approve"
          component={indKpiApprove?.isClose ? Approve : NotPermitted}
        />

        {/* Individual kpi => Individual kpi target */}

        <ContentRoute
          path="/performance-management/individual-kpi/individual-kpi-target/view/:id"
          component={indKpiTarget?.isView ? KpiEntryForm : NotPermitted}
        />

        <ContentRoute
          path="/performance-management/individual-kpi/individual-kpi-target/create"
          component={indKpiTarget?.isCreate ? KpiEntryForm : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/individual-kpi/individual-kpi-target/perform-chart/:empId"
          component={indKpiTarget?.isView ? PerformanceForm : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/individual-kpi/individual-kpi-target"
          component={indKpiTarget?.isView ? KpiEntryLanding : NotPermitted}
        />

        <ContentRoute
          path="/performance-management/individualEdit/individualTarget/edit/:id"
          component={
            indKpiTarget?.isEdit ? IndividualKpiEditForm : NotPermitted
          }
        />

        {/* Individual kpi => Individual kpi achievement */}
        <ContentRoute
          path="/performance-management/individual-kpi/individual-kpi-achievement"
          component={indKPIEntry?.isCreate ? AchievementTable : NotPermitted}
        />
        {/* Individual kpi => Individual score card */}

        <ContentRoute
          path="/performance-management/individual-kpi/individual-scorecard/print"
          component={indScoreCard?.isView ? IndBSCPrint : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/individual-kpi/individual-scorecard"
          component={indScoreCard?.isView ? BalancedScore : NotPermitted}
        />
        {/* Individual kpi => Individual dashboard */}
        <ContentRoute
          path="/performance-management/individual-kpi/individual-dashboard"
          component={indDashboard?.isView ? kpiDashboard : NotPermitted}
        />

        <ContentRoute
          path="/performance-management/individual-kpi/individual-initiative"
          component={
            indInitiative?.isView ? IndividualInitiativeForm : NotPermitted
          }
        />

        {/* Departmental kpi => Target */}
        <ContentRoute
          path="/performance-management/departmental-kpi/target/perform-chart/:depId"
          component={depKpiTarget?.isView ? DepPerformanceForm : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/departmental-kpi/target/edit/:id"
          component={depKpiTarget?.isEdit ? DepKpiEditForm : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/departmental-kpi/target/view/:id"
          component={
            depKpiTarget?.isView ? DeapartmentalKpiEntryForm : NotPermitted
          }
        />
        <ContentRoute
          path="/performance-management/departmental-kpi/target/create"
          component={
            depKpiTarget?.isCreate ? DeapartmentalKpiEntryForm : NotPermitted
          }
        />
        <ContentRoute
          path="/performance-management/departmental-kpi/target"
          component={
            depKpiTarget?.isView ? DepartmentalKpiEntryLanding : NotPermitted
          }
        />
        {/* Departmental kpi => Achievement */}
        <ContentRoute
          path="/performance-management/departmental-kpi/achievement"
          component={depKpiResult?.isView ? DepAchievement : NotPermitted}
        />
        {/* Departmental kpi => Scorecard */}
        <ContentRoute
          path="/performance-management/departmental-kpi/scorecard/print"
          component={depKpiScoreCard?.isView ? DepBSCPrint : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/departmental-kpi/scorecard"
          component={depKpiScoreCard?.isView ? DepBalancedScore : NotPermitted}
        />
        {/* Departmental kpi => Dashboard */}
        <ContentRoute
          path="/performance-management/departmental-kpi/dashboard"
          component={depKpiDashboard?.isView ? DepkpiDashboard : NotPermitted}
        />

        <ContentRoute
          path="/performance-management/departmental-kpi/initiative"
          component={
            depKpiInitiative?.isView ? DepartmentInitiativeForm : NotPermitted
          }
        />

        <ContentRoute
          path="/performance-management/departmental-kpi/project"
          component={
            departmentProject?.isView ? DepartmentProjectForm : NotPermitted
          }
        />

        {/* SBU kpi => Target */}
        <ContentRoute
          path="/performance-management/sbu-kpi/target/create"
          component={sbuKpiTarget?.isCreate ? SBuKpiEntryForm : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/sbu-kpi/target/view/:id/:sectionId"
          component={sbuKpiTarget?.isView ? SBuKpiEntryForm : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/sbu-kpi/target/edit/:id"
          component={sbuKpiTarget?.isEdit ? SbuKpiEditForm : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/sbu-kpi/target/perform-chart/:sbuId/:yearId/:yearName"
          component={sbuKpiTarget?.isView ? SbuPerformanceForm : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/sbu-kpi/target"
          component={sbuKpiTarget?.isView ? SBUKpiEntryLanding : NotPermitted}
        />
        {/* SBU kpi => Achievement */}
        <ContentRoute
          path="/performance-management/sbu-kpi/achievement"
          component={sbuKpiResult?.isView ? SbuAchievement : NotPermitted}
        />
        {/* SBU kpi => scorecard */}
        <ContentRoute
          path="/performance-management/sbu-kpi/scorecard/print"
          component={sbuKpiScore?.isView ? SBUBSCPrint : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/sbu-kpi/scorecard"
          component={sbuKpiScore?.isView ? SbuBalancedScore : NotPermitted}
        />
        {/* SBU kpi => dashboard */}
        <ContentRoute
          path="/performance-management/sbu-kpi/dashboard"
          component={sbuKpiDashboard?.isView ? SbukpiDashboard : NotPermitted}
        />

        {/* SBU kpi => initiative */}
        <ContentRoute
          path="/performance-management/sbu-kpi/initiative"
          component={
            sbuKpiInitiative?.isView ? SBUInitiativeForm : NotPermitted
          }
        />

        {/* SBU kpi => project */}
        <ContentRoute
          path="/performance-management/sbu-kpi/project"
          component={sbuProject?.isView ? SBUProjectForm : NotPermitted}
        />

        {/* Corporate kpi => Target */}
        <ContentRoute
          path="/performance-management/corporate-kpi/target/create"
          component={
            corKpiTarget?.isCreate ? CorporateKpiEntryForm : NotPermitted
          }
        />
        <ContentRoute
          path="/performance-management/corporate-kpi/target/view/:id"
          component={
            corKpiTarget?.isView ? CorporateKpiEntryForm : NotPermitted
          }
        />
        <ContentRoute
          path="/performance-management/corporate-kpi/target/edit/:id"
          component={corKpiTarget?.isEdit ? CorporateKpiEditForm : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/corporate-kpi/target/perform-chart/:sbuId"
          component={
            corKpiTarget?.isView ? CorporatePerformanceForm : NotPermitted
          }
        />
        <ContentRoute
          path="/performance-management/corporate-kpi/target"
          component={
            corKpiTarget?.isView ? CorporateKpiEntryLanding : NotPermitted
          }
        />

        {/* Corporate kpi => Achievement */}
        <ContentRoute
          path="/performance-management/corporate-kpi/achievement"
          component={corKpiResult?.isView ? CorporateAchievement : NotPermitted}
        />

        {/* Corporate kpi => scorecard */}
        <ContentRoute
          path="/performance-management/corporate-kpi/scorecard/print"
          component={corKpiScore?.isView ? CorporateBSCPrint : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/corporate-kpi/scorecard"
          component={
            corKpiScore?.isView ? CorporateBalancedScore : NotPermitted
          }
        />

        {/* Corporate kpi => dashboard */}
        <ContentRoute
          path="/performance-management/corporate-kpi/dashboard"
          component={
            corKpiDashboard?.isView ? CorporatekpiDashboard : NotPermitted
          }
        />

        {/* Corporate Initiative  */}
        <ContentRoute
          path="/performance-management/corporate-kpi/initiative"
          component={
            corKpiInitiative?.isView ? CorporateInitiativeForm : NotPermitted
          }
        />

        {/* Strategicmap */}
        <ContentRoute
          path="/performance-management/str/strategicmap"
          component={Strategicmap}
        />

        {/* Core Values => Core Values */}
        <ContentRoute
          path="/performance-management/configuration/core_values/edit/:EditId"
          component={
            configPmsCoreValues?.isEdit ? CoreValuesForm : NotPermitted
          }
        />
        <ContentRoute
          path="/performance-management/configuration/core_values/create"
          component={
            configPmsCoreValues?.isCreate ? CoreValuesForm : NotPermitted
          }
        />
        <ContentRoute
          path="/performance-management/configuration/core_values"
          component={configPmsCoreValues?.isView ? CoreValues : NotPermitted}
        />

        {/* Core Competencies */}
        <ContentRoute
          path="/performance-management/configuration/core_competencies/edit/:EditId"
          component={
            configPmsCoreCompetencies?.isEdit ? CompetencyForm : NotPermitted
          }
        />
        <ContentRoute
          path="/performance-management/configuration/core_competencies/create"
          component={
            configPmsCoreCompetencies?.isCreate ? CompetencyForm : NotPermitted
          }
        />
        <ContentRoute
          path="/performance-management/configuration/core_competencies"
          component={
            configPmsCoreCompetencies?.isView ? Competency : NotPermitted
          }
        />

        <ContentRoute
          path="/performance-management/configuration/kpiMasterData/edit"
          component={kpiMasterData?.isEdit ? KpiMasterForm : NotPermitted}
        />

        <ContentRoute
          path="/performance-management/configuration/kpiMasterData/create"
          component={kpiMasterData?.isCreate ? KpiMasterForm : NotPermitted}
        />

        <ContentRoute
          path="/performance-management/configuration/kpiMasterData"
          component={kpiMasterData?.isView ? KpiLanding : NotPermitted}
        />

        {/* Strategic Particulars => Strategic Particulars */}
        <ContentRoute
          path="/performance-management/str/strategic_particulars/edit/:strId"
          component={
            strategicPlan?.isEdit ? StrategicParticularsForm : NotPermitted
          }
        />
        <ContentRoute
          path="/performance-management/str/strategic_particulars/view/:strId/:strTypeId"
          component={strategicPlan?.isView ? StrViewForm : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/str/strategic_particulars/create"
          component={
            strategicPlan?.isCreate ? StrategicParticularsForm : NotPermitted
          }
        />
        <ContentRoute
          path="/performance-management/str/strategic_particulars"
          component={
            strategicPlan?.isView ? StrategicParticulars : NotPermitted
          }
        />

        {/* Strategic Plan => 5 Years Strategic Plan */}
        <ContentRoute
          path="/performance-management/str/5yearsstrategyplan"
          component={fiveYearsPlan?.isView ? StrategicYearPlan : NotPermitted}
        />

        {/* Employee Entry  */}
        <ContentRoute
          path="/performance-management/employee-entry"
          component={ValuesAndCompetencyEmployee}
        />

        {/* there is something to create , so we check with isCreate */}
        <ContentRoute
          path="/performance-management/report/empValuesAndcompetency/view"
          component={
            reportEmpValuesComp?.isView
              ? ValuesAndCompetencyEmployeeEntry
              : NotPermitted
          }
        />

        {/* PIP Report */}
        <ContentRoute
          path="/performance-management/report/pip"
          component={PIPReport?.isView ? PIP : NotPermitted}
        />

        {/* Employee Cost */}
        <ContentRoute
          path="/performance-management/report/employeecost"
          component={PIPReport?.isView ? EmployeeCostReport : NotPermitted}
        />

        {/* Supervisor entry */}
        <ContentRoute
          path="/performance-management/sup_entry"
          component={
            valuesCompSupEntry?.isCreate
              ? ValuesCompetencySupervisor
              : NotPermitted
          }
        />

        {/* Pms dimension */}
        <ContentRoute
          path="/performance-management/configuration/pms-dimension/create"
          component={
            configPmsDimension?.isCreate ? PmsDimensionForm : NotPermitted
          }
        />
        <ContentRoute
          path="/performance-management/configuration/pms-dimension"
          component={configPmsDimension?.isView ? PmsDimension : NotPermitted}
        />
        {/*Measuring Scale */}
        <ContentRoute
          path="/performance-management/configuration/measuring-scale/create"
          component={
            configPmsMeasuring?.isCreate ? MeasuringScaleForm : NotPermitted
          }
        />
        <ContentRoute
          path="/performance-management/configuration/measuring-scale"
          component={
            configPmsMeasuring?.isView ? MeasuringScaleMain : NotPermitted
          }
        />

        {/* Report */}
        {/* Performance Appraisal Report */}
        <ContentRoute
          path="/performance-management/report/performance-appraisal/view/:id"
          component={
            empKpiReport?.isView ? AchievementTableFromReport : NotPermitted
          }
        />

        <ContentRoute
          path="/performance-management/report/performance-appraisal"
          component={empKpiReport?.isView ? PerformanceAppraisal : NotPermitted}
        />

        {/* KPI Configure */}
        <ContentRoute
          path="/performance-management/individual-kpi/kpi-configure/edit/:id"
          component={KpiConfigureForm}
        />
        <ContentRoute
          path="/performance-management/individual-kpi/kpi-configure/extend/:id"
          component={KPIConfigureExtendForm}
        />
        <ContentRoute
          path="/performance-management/individual-kpi/kpi-configure/create"
          component={KpiConfigureForm}
        />
        <ContentRoute
          path="/performance-management/individual-kpi/kpi-configure"
          component={KpiConfigureLandingTable}
        />

        <ContentRoute
          path="/performance-management/report/empValuesAndcompetency"
          component={
            reportEmpValuesComp?.isView ? EmpValuesAndcompetency : NotPermitted
          }
        />

        <ContentRoute
          path="/performance-management/individual-kpi/copy-kpi"
          component={copyKPI?.isCreate ? CopyKpi : NotPermitted}
        />
        <ContentRoute
          path="/performance-management/individual-kpi/kpiachievementstatus"
          component={KPIAchievementSetup}
        />

        <ContentRoute
          path="/performance-management/report/zonevsterritorysales"
          component={ZoneVSTerritorySalesReport}
        />

        <ContentRoute
          path="/performance-management/report/bulkkpientry/entry"
          component={BulkKPIEntryForm}
        />
        <ContentRoute
          path="/performance-management/report/bulkkpientry"
          component={BulkKPIEntryLanding}
        />
      </Switch>
    </Suspense>
  );
}

export default PerformanceMgtPages;
