import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IConfirmModal from "../../../_helper/_confirmModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
const initData = {};
export default function InventoryAdjustApprove() {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [rowData, getRowData, loadar, setRowData] = useAxiosGet();
  const [, approveRectionHandler, saveLoader] = useAxiosPost();

  useEffect(() => {
    getRowData(
      `/wms/InventoryTransaction/GetPendingAdjustments?intBusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit]);

  const saveHandler = (values, cb) => {};
  const history = useHistory();
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(loadar || saveLoader) && <Loading />}
          <IForm
            title="Inventory Adjust Approve"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <></>;
            }}
          >
            <Form>
              <div className="mt-5">
                {rowData?.length > 0 && (
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>Sl</th>
                        <th>Trans Code</th>
                        <th>Trans Type</th>
                        <th>Item</th>
                        <th>UOM Name</th>
                        <th>Trans Qty</th>
                        <th>Trans Value</th>
                        <th>Profit Center</th>
                        <th>Plant</th>
                        <th>Warehouse</th>
                        <th>Inventory Location</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-center">
                            {item?.strInventoryTransactionCode}
                          </td>
                          <td>{item?.strTransactionTypeName}</td>
                          <td>{item?.strItemName}</td>
                          <td>{item?.strUoMname}</td>
                          <td className="text-center">{item?.numTransactionQuantity}</td>
                          <td className="text-center">{item?.monTransactionValue}</td>
                          <td>
                            {item?.strProfitCenterName}
                          </td>
                          <td>{item?.strPlantName}</td>
                          <td>{item?.strWarehouseName}</td>
                          <td>{item?.strInventoryLocationName}</td>
                          <td>
                            <div className="d-flex">
                              <div className="mr-3">
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">Approve</Tooltip>
                                  }
                                >
                                  <span
                                    onClick={() => {
                                      IConfirmModal({
                                        message: `Are you sure to Approve?`,
                                        yesAlertFunc: () => {
                                          approveRectionHandler(
                                            `/wms/InventoryTransaction/AdjustmentApproval?intInventoryTransactionId=${item?.intInventoryTransactionId}&isApprove=true
                                                `,
                                            null,
                                            () => {
                                              getRowData(
                                                `/wms/InventoryTransaction/GetPendingAdjustments?intBusinessUnitId=${selectedBusinessUnit?.value}`
                                              );
                                            }
                                          );
                                        },
                                        noAlertFunc: () => {},
                                      });
                                    }}
                                  >
                                    <i
                                      style={{ fontSize: "16px" }}
                                      className={`fas fa-check-circle pointer`}
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                              </div>
                              <OverlayTrigger
                                overlay={<Tooltip id="cs-icon">Reject</Tooltip>}
                              >
                                <span
                                  onClick={() => {
                                    IConfirmModal({
                                      message: `Are you sure to Reject?`,
                                      yesAlertFunc: () => {
                                        approveRectionHandler(
                                          `/wms/InventoryTransaction/AdjustmentApproval?intInventoryTransactionId=${item?.intInventoryTransactionId}&isApprove=false
                                                `,
                                          null,
                                          () => {
                                            getRowData(
                                              `/wms/InventoryTransaction/GetPendingAdjustments?intBusinessUnitId=${selectedBusinessUnit?.value}`
                                            );
                                          }
                                        );
                                      },
                                      noAlertFunc: () => {},
                                    });
                                  }}
                                >
                                  <i
                                    style={{ fontSize: "16px" }}
                                    className={`fa fa-times-circle closeBtn cursor-pointer`}
                                  ></i>
                                </span>
                              </OverlayTrigger>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
