import React from "react";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ActivityGroupTable } from "./activityGroupTableCard";

export function ActivityGroupLandingCard() {
  let history = useHistory();
  return (
    <Card>
      <CardHeader title="Activity Group">
        <CardHeaderToolbar>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              history.push("/config/domain-controll/activity-group/add")
            }
          >
            Create Activity Group
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <ActivityGroupTable />
      </CardBody>
    </Card>
  );
}
