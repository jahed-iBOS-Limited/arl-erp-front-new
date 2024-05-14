import React from "react";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
// import { saveSalesOrderInactiveView } from "../helper";

export default function SalesOrderReportModal({
  data,
  setData,
  show,
  onHide,
  landingDataCallback,
  setLoading,
}) {
  // Undelivery QTY Handler
  const rowDtoHandler = (name, value, index) => {
    let copy = [...data];
    let sl = copy[index];
    sl[name] = value;
    setData([...copy]);
  };

  const saveHandler = () => {
    // const payload = data?.map((item) => {
    //   return {
    //     rowId: +item?.rowId,
    //     salesOrderId: +item?.salesOrderId,
    //     itemId: +item?.itemId,
    //     itemName: item?.itemName,
    //     itemCode: item?.itemCode,
    //     orderQuantity: +item?.orderQuantity,
    //     deliveredQuantity: +item?.deliveredQuantity,
    //     undeliveryQuantity: +item?.undeliveryQuantity,
    //   };
    // });
    // saveSalesOrderInactiveView(payload, setLoading, landingDataCallback);
  };

  return (
    <div className="viewModal">
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        aria-labelledby="example-modal-sizes-title-xl"
      >
        {true && <ModalProgressBar variant="query" />}

        <Modal.Header>
          <Modal.Title className="mt-3">View Sales Order Inactive</Modal.Title>
        </Modal.Header>
        <Modal.Body id="example-modal-sizes-title-xl">
          <div className="d-flex justify-content-end w-100">
            <div className="my-4">
              <button
                type="button"
                className="btn btn-primary"
                onClick={(e) => {
                  saveHandler();
                }}
              >
                Inactive
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-bordered bj-table bj-table-landing">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Item Name</th>
                  <th>Order Quantity</th>
                  <th>Delivery Quantity</th>
                  <th>Pending Quantity</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item?.itemName}</td>
                    <td className="text-right">{item?.orderQuantity}</td>
                    <td className="text-right">{item?.deliveredQuantity}</td>
                    <td style={{ width: "130px" }}>
                      <input
                        name="undeliveryQuantity"
                        className="form-controls w-100 text-right"
                        value={item?.undeliveryQuantity}
                        type="number"
                        max={item?.orderQuantity}
                        min="0"
                        onChange={(e) => {
                          if (
                            e.target.value >= 0 &&
                            e.target.value <= item?.orderQuantity
                          ) {
                            rowDtoHandler(
                              "undeliveryQuantity",
                              e.target.value,
                              index
                            );
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
