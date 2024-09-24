import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { BasicInfornationTable } from "./basicInfornationTableCard";

export function BasicInfornationLandingCard() {
  let history = useHistory();
  return (
    <Card>
      <CardHeader title="Item Basic Info">
        <CardHeaderToolbar>
          {/* <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/config/material-management/item-basic-info/add")
            }
          >
            Create New
          </button>
          <button
            type="button"
            className="btn btn-primary ml-10"
            onClick={() =>
              history.push("/config/material-management/item-basic-info/bulk-upload")
            }
          >
            Bulk Upload
          </button> */}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <BasicInfornationTable />
      </CardBody>
    </Card>
  );
}
