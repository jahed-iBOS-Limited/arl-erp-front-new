/* eslint-disable react-hooks/exhaustive-deps */
/*
 * Change: Last change assign by Ikbal Hossain
 * Des: Remove Country, District, Division, Thana from create, edit, view
 */

import React, { useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import IViewModal from "../../../../_helper/_viewModal";
import { getViewModalData } from "../_redux/Actions";
import { useSelector, shallowEqual, useDispatch } from "react-redux";

export default function ViewForm({ id, show, onHide }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      dispatch(getViewModalData(id));
    }
  }, [id]);

  // get view modal data from store
  const modalData = useSelector((state) => {
    return state.salesTerritory.viewModalData[0];
  }, shallowEqual);

  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const salesTerritory = userRole[37];

  return (
    <div>
      <IViewModal
        show={show}
        onHide={onHide}
        isShow={modalData && false}
        title={modalData?.territoryName || ""}
      >
        {modalData ? (
          <div>
            <Row className="global-form">
              {salesTerritory?.isView ? (
                <>
                  <Col lg="4">
                    <Form.Group controlId="territoryTypeName">
                      <Form.Label className="text-left">
                        Territory Type
                      </Form.Label>
                      <Form.Control
                        value={modalData.territoryTypeName}
                        type="text"
                        disabled
                        placeholder="Loading..."
                      />
                    </Form.Group>
                  </Col>
                  <Col lg="4">
                    <Form.Group controlId="territoryName">
                      <Form.Label>Territory Name</Form.Label>
                      <Form.Control
                        value={modalData.territoryName}
                        type="text"
                        disabled
                        placeholder="Loading..."
                      />
                    </Form.Group>
                  </Col>
                  <Col lg="4">
                    <Form.Group controlId="territoryCode">
                      <Form.Label>Code</Form.Label>
                      <Form.Control
                        value={modalData.territoryCode}
                        type="text"
                        disabled
                        placeholder="Loading..."
                      />
                    </Form.Group>
                  </Col>
                  <Col lg="4">
                    <Form.Group controlId="parentTerritoryName">
                      <Form.Label>Parent Territory</Form.Label>
                      <Form.Control
                        value={modalData.parentTerritoryName}
                        type="text"
                        disabled
                        placeholder="Loading..."
                      />
                    </Form.Group>
                  </Col>
                  <Col lg="4">
                    <Form.Group controlId="address">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        value={modalData.address}
                        type="text"
                        disabled
                        placeholder="Loading..."
                      />
                    </Form.Group>
                  </Col>{" "}
                </>
              ) : (
                <h3 className="my-2">
                  You don't have permission to view this page
                </h3>
              )}

              {/*             <Col lg="4">
              <Form.Group controlId="countryName">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  value={modalData.countryName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col> */}

              {/*             <Col lg="4" className="mb-2">
              <Form.Group controlId="divisionName">
                <Form.Label>Division</Form.Label>
                <Form.Control
                  value={modalData.divisionName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col> */}

              {/*             <Col lg="4" className="mb-2">
              <Form.Group controlId="distirctName">
                <Form.Label>District</Form.Label>
                <Form.Control
                  value={modalData.distirctName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col> */}

              {/*             <Col lg="4" className="mb-2">
              <Form.Group controlId="thanaName">
                <Form.Label>Thana</Form.Label>
                <Form.Control
                  value={modalData.thanaName}
                  type="text"
                  disabled
                  placeholder="Loading..."
                />
              </Form.Group>
            </Col> */}
            </Row>
          </div>
        ) : (
          <h5>Loading.....</h5>
        )}
      </IViewModal>
    </div>
  );
}
