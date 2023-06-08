import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import IViewModal from "../../../../_helper/_viewModal";
import { getShippingPointById } from "../_redux/Actions";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

export default function ViewForm({ id, show, onHide }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(getShippingPointById(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // get view modal data from store
  const singleData = useSelector((state) => {
    return state.shippingPoint.singleData;
  }, shallowEqual);

  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );
  const shippingPoint = userRole[69];

  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={singleData?.objHeader?.shipPointName || ""}
        isShow={singleData && false}
      >
        {singleData ? (
          <>
            {shippingPoint?.isView ? (
              <>
                <Row style={{ marginTop: "25px" }}>
                  <Col lg="6">
                    <Form.Group controlId="shipPointName">
                      <Form.Label className="text-left">Route Name</Form.Label>
                      <Form.Control
                        value={singleData?.objHeader?.shipPointName}
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
                        value={singleData?.objHeader?.address}
                        type="text"
                        disabled
                        placeholder="Loading..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row style={{ marginTop: "25px" }}>
                  <table className="table table-striped table-bordered table table-head-custom table-vertical-center">
                    <thead>
                      <tr>
                        <th scope="col">SL</th>
                        <th scope="col">Warehouse</th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleData.objRow.map((itm, idx) => (
                        <tr key={itm.value}>
                          <td className="text-center">{idx + 1}</td>
                          <td>{itm.wearHouseName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Row>
              </>
            ) : (
              <h3 className="my-2">
                You don't have permission to view this page
              </h3>
            )}
          </>
        ) : (
          <h5>Loading.....</h5>
        )}
      </IViewModal>
    </div>
  );
}
