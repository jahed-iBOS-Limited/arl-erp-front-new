import React from "react";
import { Redirect, Switch } from "react-router-dom";
import ComplainForm from "./complain/form/addEditForm";
import ComplainLanding from "./complain/landing";
import ComplainAssignConfigLanding from "./complaintAssignConfig";
import ComplainAssignConfigCreateEdit from "./complaintAssignConfig/addEditForm";
import ResolutionLanding from "./resolution/landing";
import { ContentRoute } from "../../../../../_metronic/layout";



export default function ComplainManagementPages(moduleName) {
  switch (moduleName) {
    case "self-service":
      return getSelfServiceRoutes();
    case "sales-management":
      return getSalesManagementRoutes();

    default:
      break;
  }

}



const getSelfServiceRoutes = () => {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/self-service/complainmanagement"
        to="/self-service/complainmanagement/complain"
      />
      <ContentRoute
        from="/self-service/complainmanagement/complain/entry"
        component={ComplainForm}
      />
      <ContentRoute
        from="/self-service/complainmanagement/complain/edit/:edit"
        component={ComplainForm}
      />
      <ContentRoute
        from="/self-service/complainmanagement/complain/view/:view"
        component={ComplainForm}
      />
      <ContentRoute
        from="/self-service/complainmanagement/complain"
        component={()=> ComplainLanding("self-service")}
      />{" "}
      <ContentRoute
        from="/self-service/complainmanagement/Delegate"
        component={ResolutionLanding}
      />
      <ContentRoute
        from="/self-service/complainmanagement/investigate"
        component={ResolutionLanding}
      />
    </Switch>)
}


const getSalesManagementRoutes = () => {
  return (
    <Switch>
      <Redirect
        exact={true}
        from="/sales-management/complainmanagement"
        to="/sales-management/complainmanagement/complain"
      />
      <ContentRoute
        from="/sales-management/complainmanagement/complain/entry"
        component={ComplainForm}
      />
      <ContentRoute
        from="/sales-management/complainmanagement/complain/edit/:edit"
        component={ComplainForm}
      />
      <ContentRoute
        from="/sales-management/complainmanagement/complain/view/:view"
        component={ComplainForm}
      />
      <ContentRoute
        from="/sales-management/complainmanagement/complain"
        component={()=> ComplainLanding("sales-management")}
      />{" "}
      <ContentRoute
        from="/sales-management/complainmanagement/Delegate"
        component={ResolutionLanding}
      />
      <ContentRoute
        from="/sales-management/complainmanagement/investigate"
        component={ResolutionLanding}
      />
      <ContentRoute
        from="/sales-management/complainmanagement/complaintassignconfig/create"
        component={ComplainAssignConfigCreateEdit}
      />
      <ContentRoute
        from="/sales-management/complainmanagement/complaintassignconfig/edit/:id"
        component={ComplainAssignConfigCreateEdit}
      />
      <ContentRoute
        from="/sales-management/complainmanagement/complaintassignconfig"
        component={ComplainAssignConfigLanding}
      />
    </Switch>
  )
}


