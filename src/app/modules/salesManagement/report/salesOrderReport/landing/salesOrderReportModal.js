import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";

export default function SalesOrderReportModal({ data, show, onHide }) {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    // setShow(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);
  let totalDeliveryQty = 0;
  let totalDeliveryValue = 0;
  return (
    <div className="viewModal">
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        aria-labelledby="example-modal-sizes-title-xl"
      >
        {isLoading && <ModalProgressBar variant="query" />}

        <Modal.Header>
          <Modal.Title className="mt-3">Sales Order Report Details</Modal.Title>
        </Modal.Header>
        <Modal.Body id="example-modal-sizes-title-xl">
          <div className="loan-scrollable-table">
            <div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered bj-table bj-table-landing text-center">
                  <thead>
                    <tr>
                      <th style={{ minWidth: "50px" }}>SL</th>
                      <th style={{ minWidth: "100px" }}>Delivery Date</th>
                      <th style={{ minWidth: "100px" }}>Delivery Code</th>
                      <th style={{ minWidth: "75px" }}>Item Code</th>
                      <th style={{ minWidth: "75px" }}>Item Name</th>

                      <th style={{ minWidth: "75px" }}>Delivery Quantity</th>
                      <th style={{ minWidth: "100px" }}>Delivery Value</th>
                      <th style={{ minWidth: "100px" }}>
                        Shipment Complete Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((item, index) => {
                      totalDeliveryQty += item?.deliveryQty;
                      totalDeliveryValue += item?.deliveryValue;
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{_dateFormatter(item?.deliveryDate)}</td>
                          <td>{item?.deliveryCode}</td>
                          <td>{item?.itemCode}</td>
                          <td>{item?.itemName}</td>
                          <td className="text-right">
                            {_fixedPoint(item?.deliveryQty, true, 0)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(item?.deliveryValue, true, 0)}
                          </td>
                          <td>{_dateFormatter(item?.shipmentCompleteDate)}</td>
                        </tr>
                      );
                    })}
                    <tr style={{ fontWeight: "bold", textAlign: "right" }}>
                      <td colSpan={5} className="text-right">
                        <b>Total</b>
                      </td>
                      <td>{_fixedPoint(totalDeliveryQty, true, 0)}</td>
                      <td>{_fixedPoint(totalDeliveryValue, true, 0)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div>
            <button
              type="button"
              onClick={() => onHide()}
              className="btn btn-light btn-elevate"
            >
              Cancel
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
