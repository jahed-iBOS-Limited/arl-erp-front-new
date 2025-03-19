import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Redirect, Switch } from "react-router-dom";
import { ContentRoute } from "../../../../_metronic/layout";
import NotPermittedPage from "../../_helper/notPermitted/NotPermittedPage";
import AccidentEntry from "./AccidentEntry";
import AccidentEntryCreate from "./AccidentEntry/createEdit";
import ChemicalComposition from "./chemicalComposition";
import ChemicalCompositionCreate from "./chemicalComposition/Form/addEditForm";
import MedicalLeaveReportRDLC from "./medicalLeaveReportRDLC/medicalLeaveReportRDLC";
import MedicalRegisterLanding from "./medicalRegister";
import MedicalRegisterCreate from "./medicalRegister/createEdit";
import MedicalStock from "./medicalStock";
import MedicalStockForm from "./medicalStock/components/AddForm";
import MeltingProduction from "./meltingProduction";
import MeltingProductionCreate from "./meltingProduction/Form/addEditForm";
import ScrapusedLanding from "./scrapused";
import ScrapusedCreate from "./scrapused/Form/addEditForm";

export function MilProductionPages() {
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  let meltingProduction = null;
  let scrapusedLanding = null;
  let chemicalComposition = null;
  let medicineStock = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1058) {
      meltingProduction = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1059) {
      scrapusedLanding = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1060) {
      chemicalComposition = userRole[i];
    }
    if (userRole[i]?.intFeatureId === 1198) {
      medicineStock = userRole[i];
    }
  }

  return (
    <Switch>
      <Redirect
        exact={true}
        from="/production-management"
        to="/production-management/msil-Production"
      />
      <ContentRoute
        path="/production-management/msil-Production/meltingproduction/edit/:id"
        component={
          meltingProduction?.isEdit ? MeltingProductionCreate : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Production/meltingproduction/create"
        component={
          meltingProduction?.isCreate
            ? MeltingProductionCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Production/meltingproduction"
        component={
          meltingProduction?.isView ? MeltingProduction : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Production/scrapused/edit/:id"
        component={
          scrapusedLanding?.isEdit ? ScrapusedCreate : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Production/scrapused/create"
        component={
          scrapusedLanding?.isCreate ? ScrapusedCreate : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Production/scrapused"
        component={
          scrapusedLanding?.isView ? ScrapusedLanding : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Production/chemicalcomposition/edit/:id"
        component={
          chemicalComposition?.isEdit
            ? ChemicalCompositionCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Production/chemicalcomposition/create"
        component={
          chemicalComposition?.isCreate
            ? ChemicalCompositionCreate
            : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Production/chemicalcomposition"
        component={
          chemicalComposition?.isView ? ChemicalComposition : NotPermittedPage
        }
      />
      <ContentRoute
        path="/production-management/msil-Production/medicalregister/edit/:id"
        component={ MedicalRegisterCreate }
      />
      <ContentRoute
        path="/production-management/msil-Production/medicalregister/create"
        component={ MedicalRegisterCreate }
      />
      <ContentRoute
        path="/production-management/msil-Production/medicalregister"
        component={ MedicalRegisterLanding }
      />
      <ContentRoute
        path="/production-management/msil-Production/accidententry/edit/:id"
        component={ AccidentEntryCreate }
      />
      <ContentRoute
        path="/production-management/msil-Production/accidententry/create"
        component={ AccidentEntryCreate }
      />
      <ContentRoute
        path="/production-management/msil-Production/accidententry"
        component={ AccidentEntry }        
      />
      <ContentRoute 
        path="/production-management/msil-Production/medicinestock/add"
        component={ medicineStock?.isCreate ?  MedicalStockForm : NotPermittedPage }
      />
      <ContentRoute
        path="/production-management/msil-Production/medicinestock"
        component={ medicineStock?.isView ?  MedicalStock : NotPermittedPage}
      />
      <ContentRoute
        path="/production-management/msil-Production/MedicalLeaveReport"
        component={ MedicalLeaveReportRDLC }
      />

    </Switch>
  );
}
