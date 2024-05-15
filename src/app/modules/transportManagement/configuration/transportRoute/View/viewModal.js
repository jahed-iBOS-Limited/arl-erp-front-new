/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import IViewModal from "../../../../_helper/_viewModal";
import { getTransportRouteById } from "../_redux/Actions";

export default function ViewForm({ id, show, onHide }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(getTransportRouteById(id));
    }
  }, [id]);

  // get view modal data from store
  const singleData = useSelector((state) => {
    return state.transportRoute.singleData;
  }, shallowEqual);
  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={"View Transport Route"}
        isShow={singleData && false}
      >
        {singleData ? (
          <>
            <div className="global-form">
              <Row>
                <Col lg="6">
                  <Form.Group controlId="routeName">
                    <Form.Label className="text-left">Route Name</Form.Label>
                    <Form.Control
                      value={singleData?.objHeader?.routeName}
                      type="text"
                      disabled
                      placeholder="Loading..."
                    />
                  </Form.Group>
                </Col>
                <Col lg="6">
                  <Form.Group controlId="businessUnitCode">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      value={singleData?.objHeader?.routeAddress}
                      type="text"
                      disabled
                      placeholder="Loading..."
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
            <div className="table-responsive">
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th scope="col">SL</th>
                    <th scope="col">Transport Zone</th>
                  </tr>
                </thead>
                <tbody>
                  {singleData?.objRow?.map((itm, idx) => (
                    <tr key={itm?.value}>
                      <td className="text-center">{idx + 1}</td>
                      <td>{itm?.transportZoneName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <h5>Loading.....</h5>
        )}
      </IViewModal>
    </div>
  );
}
