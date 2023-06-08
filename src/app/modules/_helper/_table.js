import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { useHistory } from "react-router-dom";
import IViewModal from "./_viewModal";
export function ITable({ title, children, link, isHelp, helpModalComponent }) {
  let history = useHistory();
  const [isShowModal, setisShowModal] = useState(false);
  return (
    <>
      <Card>
        <CardHeader title={title}>
          <CardHeaderToolbar>
            {isHelp && (
              <button
                type="button"
                className="btn btn-primary mr-2"
                onClick={() => {
                  setisShowModal(true);
                }}
              >
                Help
              </button>
            )}
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => history.push(link)}
            >
              Create New
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {/* modal*/}
          {isHelp && (
            <IViewModal show={isShowModal} onHide={() => setisShowModal(false)}>
              {helpModalComponent}
            </IViewModal>
          )}

          {children}
        </CardBody>
      </Card>
    </>
  );
}
