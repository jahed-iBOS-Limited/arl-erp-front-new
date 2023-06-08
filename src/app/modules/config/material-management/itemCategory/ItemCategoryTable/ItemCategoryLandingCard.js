import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ItemCategoryTable } from "./ItemCategoryTableCard";

export function ItemCategoryandingCard() {
  let history = useHistory();
  return (
    <Card>
      <CardHeader title="Item Category">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/config/material-management/item-category/add")
            }
          >
            Create New
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <ItemCategoryTable />
      </CardBody>
    </Card>
  );
}
