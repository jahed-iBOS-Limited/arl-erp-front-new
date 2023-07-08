import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls/Card";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import "./style.scss";
import CategoryWiseCard from "./categoryWiseCard";
import IViewModal from "../../../_helper/_viewModal";
import WarehouseWiseStockReport from "../../../inventoryManagement/reports/whStockReport";
import DepoPendingChart from "./DepoPendingChart";
import {
  getDashBoardPDDDCPendingQtyReportApi,
  getDashBoardPDDDepotPendingReportApi,
  getDashBoardPDDOnTimeDeliveryReportApi,
  getDashBoardPDDReportApi,
  getDashBoardPDDReportVehicleApi,
  getDashBoardPDDReporttransferOutQntApi,
} from "./helper";
const initData = {
  shipPoint: { value: 0, label: "All" },
};

function Dashboardpdd() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
    isInventoryStockModalOpen: false,
  });

  const [DCPending, setDCPending] = useState("");
  const [DCDeliverd, setDCDeliverd] = useState("");
  const [DCProsessing, setDCProsessing] = useState("");
  const [DCDeliveredQty, setDCDeliveredQty] = useState("");
  const [VehicleAvailable, setVehicleAvailable] = useState("");
  const [DCVehicleOut, setDCVehicleOut] = useState("");
  const [DCTransferOutQty, setDCTransferOutQty] = useState("");
  const [DCPendingQty, setDCPendingQty] = useState("");
  const [OnTimeDelivery, setOnTimeDelivery] = useState("");
  const [DCDepotPending, setDCDepotPending] = useState("");

  // Get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const shippointDDL = useSelector((state) => {
    return state.commonDDL.shippointDDL;
  }, shallowEqual);

  React.useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
    }
  }, [profileData, selectedBusinessUnit]);

  const commonGetApi = (values) => {
    // DC Pending
    getDashBoardPDDReportApi(
      selectedBusinessUnit?.value,
      values?.shipPoint?.value,
      1,
      setDCPending,
      setLoading
    );
    // DC Deliverd
    getDashBoardPDDReportApi(
      selectedBusinessUnit?.value,
      values?.shipPoint?.value,
      2,
      setDCDeliverd,
      setLoading
    );
    // DC Prosessing
    getDashBoardPDDReportApi(
      selectedBusinessUnit?.value,
      values?.shipPoint?.value,
      3,
      setDCProsessing,
      setLoading
    );
    // Delivered Qty
    getDashBoardPDDReportApi(
      selectedBusinessUnit?.value,
      values?.shipPoint?.value,
      4,
      setDCDeliveredQty,
      setLoading
    );

    // Vehicle Available
    getDashBoardPDDReportVehicleApi(
      selectedBusinessUnit?.value,
      values?.shipPoint?.value,
      5,
      setVehicleAvailable,
      setLoading
    );
    // Vehicle Out
    getDashBoardPDDReportVehicleApi(
      selectedBusinessUnit?.value,
      values?.shipPoint?.value,
      6,
      setDCVehicleOut,
      setLoading
    );
    // Transfer Out Qty
    getDashBoardPDDReporttransferOutQntApi(
      selectedBusinessUnit?.value,
      values?.shipPoint?.value,
      7,
      setDCTransferOutQty,
      setLoading
    );
    // DC Pending Qty
    getDashBoardPDDDCPendingQtyReportApi(
      selectedBusinessUnit?.value,
      values?.shipPoint?.value,
      8,
      setDCPendingQty,
      setLoading
    );

    // On Time Delivery
    getDashBoardPDDOnTimeDeliveryReportApi(
      selectedBusinessUnit?.value,
      values?.shipPoint?.value,
      9,
      setOnTimeDelivery,
      setLoading
    );
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      commonGetApi(initData);
      //Depot Pending
      getDashBoardPDDDepotPendingReportApi(
        selectedBusinessUnit?.value,
        0,
        10,
        setDCDepotPending,
        setLoading
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  function calculateTotals(options) {
    let total = 0;

    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        total += options[key];
      }
    }

    return total;
  }

  return (
    <>
      {loading && <Loading />}
      <div className="Dashboardpdd">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
          }}
        >
          {({ values, setFieldValue, touched, errors }) => (
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"DashBoard PDD"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <>
                  <Form>
                    <div className="row global-form p-0 m-0 pb-1">
                      <div className="col-lg-3">
                        <NewSelect
                          name="shipPoint"
                          options={
                            [{ value: 0, label: "All" }, ...shippointDDL] || []
                          }
                          value={values?.shipPoint}
                          label="Ship Point"
                          onChange={(valueOption) => {
                            setFieldValue("shipPoint", valueOption);
                            commonGetApi({
                              ...values,
                              shipPoint: valueOption,
                            });
                          }}
                          placeholder="Ship Point"
                          errors={errors}
                          touched={touched}
                          isClearable={false}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12">
                        <div className="DashboardpddBox">
                          <CategoryWiseCard
                            className="DashboardpddBox__One"
                            customOnClick={(item) => {}}
                            categoryWiseCardObj={{
                              title: `DC Pending - ${calculateTotals(
                                DCPending
                              )}`,
                              categoryList: [
                                {
                                  title: "Regular",
                                  value: DCPending?.Regular,
                                },
                                {
                                  title: "Special",
                                  value: DCPending?.Special,
                                },
                                {
                                  title: "Express",
                                  value: DCPending?.Express,
                                },
                              ],
                            }}
                          />

                          <CategoryWiseCard
                            className="DashboardpddBox__Two"
                            customOnClick={(item) => {}}
                            categoryWiseCardObj={{
                              title: `DC Delivered - ${calculateTotals(
                                DCDeliverd
                              )}`,
                              categoryList: [
                                {
                                  title: "Regular",
                                  value: DCDeliverd?.Regular,
                                },
                                {
                                  title: "Special",
                                  value: DCDeliverd?.Special,
                                },
                                {
                                  title: "Express",
                                  value: DCDeliverd?.Express,
                                },
                              ],
                            }}
                          />
                          <CategoryWiseCard
                            className="DashboardpddBox__Three"
                            customOnClick={(item) => {}}
                            categoryWiseCardObj={{
                              title: `DC Prosessing - ${calculateTotals(
                                DCProsessing
                              )}`,
                              categoryList: [
                                {
                                  title: "Regular",
                                  value: DCProsessing?.Regular,
                                },
                                {
                                  title: "Special",
                                  value: DCProsessing?.Special,
                                },
                                {
                                  title: "Express",
                                  value: DCProsessing?.Express,
                                },
                              ],
                            }}
                          />
                          <CategoryWiseCard
                            className="DashboardpddBox__Four"
                            customOnClick={(item) => {}}
                            categoryWiseCardObj={{
                              title: `Delivered Qty - ${calculateTotals(
                                DCDeliveredQty
                              )}`,
                              categoryList: [
                                {
                                  title: "Regular",
                                  value: DCDeliveredQty?.Regular,
                                },
                                {
                                  title: "Special",
                                  value: DCDeliveredQty?.Special,
                                },
                                {
                                  title: "Express",
                                  value: DCDeliveredQty?.Express,
                                },
                              ],
                            }}
                          />
                          <CategoryWiseCard
                            className="DashboardpddBox__Five"
                            customOnClick={(item) => {}}
                            categoryWiseCardObj={{
                              title: `Vehicle  Available - ${calculateTotals(
                                VehicleAvailable
                              )}`,
                              categoryList: [
                                {
                                  title: "Company",
                                  value: VehicleAvailable?.Company,
                                },
                                {
                                  title: "Supplier",
                                  value: VehicleAvailable?.Supplier,
                                },
                              ],
                            }}
                          />
                          <CategoryWiseCard
                            className="DashboardpddBox__Six"
                            customOnClick={(item) => {}}
                            categoryWiseCardObj={{
                              title: `Vehicle  Out - ${calculateTotals(
                                DCVehicleOut
                              )}`,
                              categoryList: [
                                {
                                  title: "Company",
                                  value: DCVehicleOut?.Company,
                                },
                                {
                                  title: "Supplier",
                                  value: DCVehicleOut?.Supplier,
                                },
                              ],
                            }}
                          />
                          <CategoryWiseCard
                            className="DashboardpddBox__Seven"
                            customOnClick={(item) => {}}
                            categoryWiseCardObj={{
                              title: "Transfer Out Qty",
                              categoryList: [
                                {
                                  value: DCTransferOutQty?.transferOutQnt,
                                },
                              ],
                            }}
                          />
                          <CategoryWiseCard
                            className="DashboardpddBox__Eight cursor-pointer"
                            categoryWiseCardObj={{
                              title: "Inventory  Stock",
                              categoryList: [],
                            }}
                            customCardOnClick={(item) => {
                              setIsModalOpen({
                                ...isModalOpen,
                                isInventoryStockModalOpen: true,
                              });
                            }}
                          />
                          <CategoryWiseCard
                            className="DashboardpddBox__Nine"
                            categoryWiseCardObj={{
                              title: `DC Pending Qty - ${calculateTotals(
                                DCPendingQty
                              )}`,
                              categoryList: [
                                {
                                  title: "Regular",
                                  value: DCPendingQty?.Regular,
                                },
                                {
                                  title: "Special",
                                  value: DCPendingQty?.Special,
                                },
                                {
                                  title: "Express",
                                  value: DCPendingQty?.Express,
                                },
                              ],
                            }}
                            customOnClick={(item) => {}}
                          />
                          <CategoryWiseCard
                            className="DashboardpddBox__Ten"
                            categoryWiseCardObj={{
                              title: "On Time Delivery",
                              categoryList: [
                                {
                                  value: `${OnTimeDelivery?.onTimeDelivery ||
                                    0}%`,
                                },
                              ],
                            }}
                          />
                        </div>
                      </div>

                      {/* DepoPending Chart  */}
                      <div className="col-lg-12">
                        <DepoPendingChart DCDepotPending={DCDepotPending} />
                      </div>
                    </div>

                    {/* Inventory  Stock Model */}
                    <IViewModal
                      show={isModalOpen?.isInventoryStockModalOpen}
                      onHide={() => {
                        setIsModalOpen({
                          ...isModalOpen,
                          isInventoryStockModalOpen: false,
                        });
                      }}
                    >
                      <WarehouseWiseStockReport />
                    </IViewModal>
                  </Form>
                </>
              </CardBody>
            </Card>
          )}
        </Formik>
      </div>
    </>
  );
}

export default Dashboardpdd;
