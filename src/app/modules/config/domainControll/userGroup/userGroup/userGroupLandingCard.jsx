import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { UserGroupTable } from "./userGroupTableCard";

export function UserGroupLandingCard() {
  let history = useHistory();
  return (
    <Card>
      <CardHeader title="User Group">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/config/domain-controll/user-group/add")
            }
          >
            Create User Group
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <UserGroupTable />
      </CardBody>
    </Card>
  );
}
