import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export default function ProductionEntryViewForm({ data }) {
  console.log(data);

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
                  data?.objHeader?.dteProductionDate
                    ? _dateFormatter(data?.objHeader?.dteProductionDate)
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
                value={data?.shift?.label ? data?.shift?.label : ""}
                type="text"
                disabled
                placeholder="Shift Name"
              />
            </Form.Group>
          </Col>
          <Col lg="4">
            <Form.Group controlId="plant">
              <Form.Label className="text-left">Plant Name</Form.Label>
              <Form.Control
                value={data?.plantName?.label ? data?.plantName?.label : ""}
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
                value={data?.itemName}
                type="text"
                disabled
                placeholder="Item Name"
              />
            </Form.Group>
          </Col>
          <Col lg="4">
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
          </Col>
          <Col lg="4">
            <Form.Group controlId="workCenter">
              <Form.Label className="text-left">Work Center</Form.Label>
              <Form.Control
                value={data?.objHeader?.workcenterName}
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
                    <th style={{ width: "50px" }}>Item Code</th>
                    <th style={{ width: "50px" }}>Output Item</th>
                    <th style={{ width: "50px" }}>Output Quantity</th>
                    <th style={{ width: "50px" }}>QC Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.objRow &&
                    data?.objRow.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td>
                          <div className="pl-2">{item.strItemCode}</div>
                        </td>
                        <td>
                          <div className="pl-2">{item.strItemName}</div>
                        </td>
                        <td className="text-center">{item.outPutQuantity}</td>
                        <td className="text-center">{item.approvedQuantity}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
}
