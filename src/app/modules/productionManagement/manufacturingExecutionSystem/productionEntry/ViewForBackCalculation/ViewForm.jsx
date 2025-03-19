import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

export default function BackCalculationPEViewForm({ data }) {
  console.log("data: ", data);
  const dispatch = useDispatch();

  // console.log(data);
  return (
    <>
      <Form className="my-5">
        <Row className="global-form">
          <Col lg="4">
            <Form.Group controlId="productionDate">
              <Form.Label className="text-left">Date</Form.Label>
              <Form.Control
                value={
                  data?.header?.productionDate
                    ? _dateFormatter(data?.header?.productionDate)
                    : ""
                }
                type="date"
                disabled
                placeholder="Date"
              />
            </Form.Group>
          </Col>
          <Col lg="4">
            <Form.Group controlId="shiftName">
              <Form.Label className="text-left">Shift Name</Form.Label>
              <Form.Control
                value={data?.header?.shiftName ? data?.header?.shiftName : ""}
                type="text"
                disabled
                placeholder="Shit Name"
              />
            </Form.Group>
          </Col>
          <Col lg="4">
            <Form.Group controlId="plant">
              <Form.Label className="text-left">Plant Name</Form.Label>
              <Form.Control
                value={data?.header?.plantName ? data?.header?.plantName : ""}
                type="text"
                disabled
                placeholder="Plant Name"
              />
            </Form.Group>
          </Col>

          <Col lg="4">
            <Form.Group controlId="itemName">
              <Form.Label className="text-left">Item Name</Form.Label>
              <Form.Control
                value={data?.header?.itemName}
                type="text"
                disabled
                placeholder="Item Name"
              />
            </Form.Group>
          </Col>
          {/* <Col lg="4">
            <Form.Group controlId="productionOrderId">
              <Form.Label className="text-left">Production Order No</Form.Label>
              <Form.Control
                value={
                  data?.objHeader?.productionOrderCode
                    ? data?.objHeader?.productionOrderCode
                    : ""
                }
                type="text"
                disabled
                placeholder="Production Order"
              />
            </Form.Group>
          </Col> */}
          <Col lg="4">
            <Form.Group controlId="shopFloorId">
              <Form.Label className="text-left">Shop Floor</Form.Label>
              <Form.Control
                value={
                  data?.header?.shopFloorName ? data?.header?.shopFloorName : ""
                }
                type="text"
                disabled
                placeholder="Shop Floor"
              />
            </Form.Group>
          </Col>
          <Col lg="4">
            <Form.Group controlId="workCenter">
              <Form.Label className="text-left">Work Center</Form.Label>
              <Form.Control
                value={data?.header?.workCenterName}
                type="text"
                disabled
                placeholder="Work Center"
              />
            </Form.Group>
          </Col>

          <Col lg="4">
            <Form.Group controlId="goodProductionQty">
              <Form.Label className="text-left">
                Good Production Quantity
              </Form.Label>
              <Form.Control
                value={""}
                type="text"
                disabled
                placeholder="Good Production Quantity"
              />
            </Form.Group>
          </Col>
          <Col lg="4">
            <div className="mt-5">
              <IView
                clickHandler={() => {
                  dispatch(
                    getDownlloadFileView_Action(data?.header?.attachment)
                  );
                }}
              />
            </div>
          </Col>
          {/* <Col lg="4">
            <Form.Group controlId="wastageQty">
              <Form.Label className="text-left">Wastage Quantity</Form.Label>
              <Form.Control
                value={""}
                type="number"
                disabled
                placeholder="Wastage Quantity"
              />
            </Form.Group>
          </Col> */}
        </Row>
        <Row>
          <Col lg="12">
            <div className="table-responsive">
              <table className="table table-striped table-bordered mt-5 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}>SL</th>
                    <th style={{ width: "50px" }}>Output Item</th>
                    <th style={{ width: "50px" }}>Output UoM</th>
                    <th style={{ width: "50px" }}>Output Quantity</th>
                    <th style={{ width: "50px" }}>QC Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.row?.length > 0 &&
                    data?.row?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>
                          <div className="pl-2">{item?.itemName}</div>
                        </td>
                        <td className="pl-2">{item?.uomname}</td>
                        <td className="text-center">{item?.numQuantity}</td>
                        <td className="text-center">
                          {item?.approvedQuantity}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
        {data?.billOfMaterialRow?.length > 0 && (
          <Row>
            <Col lg="12 mt-5">
              <h6>
                <strong>BoM Details :</strong>
              </h6>
              <div className="table-responsive">
                <table className="table table-striped table-bordered mt-2 bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}>SL</th>
                      <th style={{ width: "50px" }}>Material</th>
                      <th style={{ width: "50px" }}>Qty</th>
                      <th style={{ width: "50px" }}>UoM</th>
                      <th style={{ width: "50px" }}>BoM version</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.billOfMaterialRow?.length > 0 &&
                      data?.billOfMaterialRow?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>
                            <div className="pl-2">{item?.material}</div>
                          </td>
                          <td className="text-center">{item?.qty}</td>
                          <td className="pl-2">{item?.uom}</td>
                          <td className="pl-2">{item?.version}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        )}
      </Form>
    </>
  );
}
