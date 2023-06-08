import React from "react";
import HeaderForm from "./form";
import { useHistory } from "react-router-dom";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";

export default function DisbursementCenter() {
  let history = useHistory();
  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title={"Disbursement Center"}>
          <CardHeaderToolbar>
            <button
              className="btn btn-primary"
              onClick={() =>
                history.push({
                  pathname:
                    "/financial-management/configuration/disbursementCenter/add",
                })
              }
            >
              Create
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <HeaderForm />
        </CardBody>
      </Card>
    </>
  );
}
