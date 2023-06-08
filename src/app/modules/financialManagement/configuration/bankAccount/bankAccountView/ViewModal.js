/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { getViewModalData } from "../_redux/Actions";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import IViewModal from "../../../../_helper/_viewModal";
export function ViewModal({ id, show, onHide }) {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    // setShow(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (id) {
      dispatch(getViewModalData(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // get view modal data from store
  const modalData = useSelector((state) => {
    return state.bankAccount.viewModalData[0];
  }, shallowEqual);

  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        isShow={modalData && false}
        title={modalData?.bankACName || ""}
      >
        {modalData ? (
          <Row>
            <Col lg="4">
              <Form.Group controlId="bankName">
                <Form.Label className="text-left">Bank</Form.Label>
                <Form.Control
                  value={modalData.bankName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col>
            <Col lg="4">
              <Form.Group controlId="bankBranchName">
                <Form.Label className="text-left">Bank Branch Name</Form.Label>
                <Form.Control
                  value={modalData.bankBranchName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col>
            <Col lg="4">
              <Form.Group controlId="bankACTypeName">
                <Form.Label className="text-left">
                  Bank Account Type Name
                </Form.Label>
                <Form.Control
                  value={modalData.bankACTypeName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col>
            <Col lg="4">
              <Form.Group controlId="bankACName">
                <Form.Label className="text-left">Bank Account Name</Form.Label>
                <Form.Control
                  value={modalData.bankACName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col>
            <Col lg="4">
              <Form.Group controlId="bankACNo">
                <Form.Label className="text-left">Bank Account No</Form.Label>
                <Form.Control
                  value={modalData.bankACNo}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col>
            <Col lg="4">
              <Form.Group controlId="generalLedgerName">
                <Form.Label className="text-left">
                  General Ledger Name
                </Form.Label>
                <Form.Control
                  value={modalData.generalLedgerName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col>
          </Row>
        ) : (
          <h5>Loading.....</h5>
        )}
      </IViewModal>
    </div>
  );
}
