import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IView from "../../../_helper/_helperIcons/_view";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import ApprovalView from "./approvalView";
const initData = {};
export default function InventoryAdjustApprove() {
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [rowData, getRowData, loadar] = useAxiosGet();
  const [isShowModal, setIsShowModal] = useState(false);
  const [singleData, setSingleData] = useState({});

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
          {loadar && <Loading />}
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
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>Sl</th>
                          <th>Trans Code</th>
                          <th>Trans Type</th>
                          <th>Profit Center</th>
                          <th>Plant</th>
                          <th>Warehouse</th>
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
                            <td>{item?.strProfitCenterName}</td>
                            <td>{item?.strPlantName}</td>
                            <td>{item?.strWarehouseName}</td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center">
                                <span
                                  onClick={() => {
                                    setSingleData(item);
                                    setIsShowModal(true);
                                  }}
                                >
                                  <IView />
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Form>
          </IForm>
          <div>
            <IViewModal
              title="Approval View"
              show={isShowModal}
              onHide={() => {
                setIsShowModal(false);
              }}
            >
              <ApprovalView
                singleData={singleData}
                getRowData={getRowData}
                setIsShowModal={setIsShowModal}
              />
            </IViewModal>
          </div>
        </>
      )}
    </Formik>
  );
}
