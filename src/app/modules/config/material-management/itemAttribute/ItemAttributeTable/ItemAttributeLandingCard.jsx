import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ItemAttributesTable } from "./ItemAttributesTableCard";

export function ItemAttributeLandingCard() {
  let history = useHistory();
  return (
    <Card>
      <CardHeader title="Item Attribute">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/config/material-management/item-attribute/add")
            }
          >
            Create New
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <ItemAttributesTable />
      </CardBody>
    </Card>
  );
}


