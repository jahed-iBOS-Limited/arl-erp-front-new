import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import { UsersTable } from "./user-table/UsersTable";
export function CreateUserCard() {
  let history = useHistory();

  return (
    <Card>
      <CardHeader title="User list">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/config/domain-controll/create-user/new")
            }
          >
            Create New
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {/* <UserFilter /> */}
        {/* {userUIProps.ids.length > 0 && (
          <>
            <UserGrouping />
          </>
        )} */}
        <UsersTable />
      </CardBody>
    </Card>
  );
}
