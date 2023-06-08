/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import IViewModal from "../../../../_helper/_viewModal";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getSingleById } from "../_redux/Actions";

export default function ViewForm({ id, show, onHide }) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(getSingleById(id));
    }
  }, [id]);

  // get view modal data from store
  const singleData = useSelector((state) => {
    return state.taxBranch.singleData;
  }, shallowEqual);

  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        title={`Branch Name: ${singleData?.branchName}`}
        isShow={singleData && false}
      >
        {singleData ? (
          <>
            <div className="global-form">
              <Row>
                <Col lg="3">
                  <Form.Group controlId="businessUnit">
                    <Form.Label className="text-left">Business Unit</Form.Label>
                    <Form.Control
                      value={singleData?.businessUnit?.label}
                      type="text"
                      disabled
                      placeholder="Loading..."
                    />
                  </Form.Group>
                </Col>
                <Col lg="3">
                  <Form.Group controlId="branchName">
                    <Form.Label>Branch Name</Form.Label>
                    <Form.Control
                      value={singleData?.branchName}
                      type="text"
                      disabled
                      placeholder="Loading..."
                    />
                  </Form.Group>
                </Col>
                <Col lg="3">
                  <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      value={singleData?.address}
                      type="text"
                      disabled
                      placeholder="Loading..."
                    />
                  </Form.Group>
                </Col>
                <Col lg="3">
                  <Form.Group controlId="country">
                    <Form.Label>Country</Form.Label>
                    <Form.Control
                      value={singleData?.country?.label}
                      type="text"
                      disabled
                      placeholder="Loading..."
                    />
                  </Form.Group>
                </Col>
                <Col lg="3">
                  <Form.Group controlId="division">
                    <Form.Label>State/Division</Form.Label>
                    <Form.Control
                      value={singleData?.division?.label}
                      type="text"
                      disabled
                      placeholder="Loading..."
                    />
                  </Form.Group>
                </Col>
                <Col lg="3">
                  <Form.Group controlId="district">
                    <Form.Label>City/District</Form.Label>
                    <Form.Control
                      value={singleData?.district?.label}
                      type="text"
                      disabled
                      placeholder="Loading..."
                    />
                  </Form.Group>
                </Col>
                <Col lg="3">
                  <Form.Group controlId="policeStation">
                    <Form.Label>Police Station</Form.Label>
                    <Form.Control
                      value={singleData?.policeStation?.label}
                      type="text"
                      disabled
                      placeholder="Loading..."
                    />
                  </Form.Group>
                </Col>
                <Col lg="3">
                  <Form.Group controlId="postCode">
                    <Form.Label>Post Code</Form.Label>
                    <Form.Control
                      value={singleData?.postCode?.label}
                      type="text"
                      disabled
                      placeholder="Loading..."
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </>
        ) : (
          <h5>Loading.....</h5>
        )}
      </IViewModal>
    </div>
  );
}
