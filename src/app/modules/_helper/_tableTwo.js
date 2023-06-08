import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  ModalProgressBar,
} from "../../../_metronic/_partials/controls";
import { useHistory } from "react-router-dom";
export function ITableTwo({
  renderProps,
  children,
  title,
  viewLink,
  createLink,
  isHidden,
}) {
  let history = useHistory();
  return (
    <>
      <Card>
       <ModalProgressBar />
        <CardHeader title={title}></CardHeader>
        <CardBody>
          {renderProps()}
          <div className="d-flex justify-content-end my-3">
            {
              !isHidden && <>
                <button
              type="button"
              className="btn btn-primary"
              onClick={() => history.push(viewLink)}
            >
              View
            </button>
            <button
              type="button"
              className="btn btn-primary ml-3"
              onClick={() => history.push(createLink)}
            >
              Create
            </button>
              </> 
            }
          </div>
          {children}
        </CardBody>
      </Card>
    </>
  );
}
