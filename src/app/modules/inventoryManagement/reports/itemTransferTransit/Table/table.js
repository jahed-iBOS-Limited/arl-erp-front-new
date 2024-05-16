import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useSelector, shallowEqual } from "react-redux";
import {
  getItemTransferTransitReport,
  getPlantDDL,
  getWarehouseDDL,
} from "../helper";
import { TransferTransitDetail } from "../modal/transferTransitDetail";
import ICustomCard from "../../../../_helper/_customCard";
import NewSelect from "../../../../_helper/_select";
import Loading from "../../../../_helper/_loading";
import { _dateFormatterTwo } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";

const initData = {
  warehouse: "",
  expireType: "",
  plant: "",
};

export function ItemTransferTransit() {
  const [loading, setLoading] = useState(false);

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [gridData, setGridData] = useState([]);
  const [warehouseDDL, setWarehouseDDL] = useState([]);
  const [currentItem, setCurrentItem] = useState("");
  const [isShowRowItemModal, setIsShowRowItemModal] = useState(false);
  const [plantList, setPlantList] = useState([]);

  const viewGridData = (values) => {
    getItemTransferTransitReport(
      values?.warehouse?.value,
      values?.expireType?.value,
      setGridData,
      setLoading
    );
  };

  useEffect(() => {
    if (accId && buId) {
      getPlantDDL(accId, userId, buId, setPlantList);
    }
  }, [accId, buId, userId]);

  const receiveStatusDDL = [
    { value: 0, label: "All" },
    { value: 1, label: "Pending" },
    { value: 2, label: "Partial Receive" },
  ];

  let totalTransfer = 0;
  let totalReceive = 0;

  return (
    <>
      <ICustomCard title="Item Transfer Transit">
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={() => {}}
        >
          {({ setFieldValue, values }) => (
            <>
              <Form className="form form-label-left">
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      placeholder="Plant Name"
                      label="Plant Name"
                      value={values?.plant}
                      options={plantList || []}
                      onChange={(v) => {
                        setFieldValue("plant", v);
                        setFieldValue("warehouse", "");
                        if (v?.value) {
                          getWarehouseDDL(
                            accId,
                            userId,
                            buId,
                            v?.value,
                            setWarehouseDDL
                          );
                        }
                        setGridData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="warehouse"
                      placeholder="Warehouse Name"
                      label="Warehouse Name"
                      value={values?.warehouse}
                      options={warehouseDDL || []}
                      isDisabled={!values?.plant}
                      onChange={(v) => {
                        setFieldValue("warehouse", v);
                        setGridData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="receiveStatus"
                      options={receiveStatusDDL || []}
                      value={values?.expireType}
                      label="Receive Status"
                      placeholder="Receive Status"
                      onChange={(v) => {
                        setFieldValue("expireType", v);
                        setGridData([]);
                      }}
                    />
                  </div>
                  <div className="col d-flex justify-content-end align-items-end">
                    <button
                      type="submit"
                      className="btn btn-primary mt-2"
                      onClick={(e) => {
                        viewGridData(values);
                      }}
                      disabled={!values?.expireType || !values?.warehouse}
                    >
                      View
                    </button>
                  </div>
                </div>
              </Form>
              <div className="row">
                <div className="col-lg-12">
                  {loading && <Loading />}
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table table-font-size-sm">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>From Warehouse</th>
                          <th>Reference No</th>
                          <th>Transfer Date</th>
                          <th>To Warehouse</th>
                          <th>Receive Status</th>
                          <th>Transfer Quantity</th>
                          <th>Receive Quantity</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => {
                          totalTransfer += item?.transferQty;
                          totalReceive += item?.receiveQty;
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "30px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.fromWarehouseName}</td>
                              <td>{item?.referenceNo}</td>
                              <td>{_dateFormatterTwo(item?.transferDate)}</td>
                              <td>{item?.toWarehouseName}</td>
                              <td>{item?.receiveStatus}</td>
                              <td className="text-right">
                                {item?.transferQty}
                              </td>
                              <td className="text-right">{item?.receiveQty}</td>
                              <td className="text-center">
                                <button
                                  className="btn"
                                  onClick={(e) => {
                                    setCurrentItem(item);
                                    setIsShowRowItemModal(true);
                                  }}
                                >
                                  <IView />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {gridData?.length > 0 && (
                          <tr
                            style={{ textAlign: "right", fontWeight: "bold" }}
                          >
                            <td colSpan={6} className="text-right">
                              Total
                            </td>
                            <td>{totalTransfer}</td>
                            <td>{totalReceive}</td>
                            <td></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <IViewModal
                show={isShowRowItemModal}
                onHide={() => setIsShowRowItemModal(false)}
              >
                <TransferTransitDetail currentItem={currentItem} />
              </IViewModal>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}
