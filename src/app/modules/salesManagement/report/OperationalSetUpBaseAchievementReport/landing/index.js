import { Formik } from "formik";
import React, { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../_helper/_card";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { GetPartnerAllotmentLanding } from "../helper";
import Form from "./form";
import TableTwo from "./tableTwo";
import TargetVsSalesChart from "./targetVsSalesChart";
import TableOne from "./tableOne";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  certainDate: _todayDate(),
  reportType: { value: 1, label: "Customer Base" },
  viewType: "",
};

export default function OperationalSetUpBaseAchievement() {
  const printRef = useRef();
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPowerBIReport, setShowPowerBIReport] = useState();

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const getGridData = (values) => {
    GetPartnerAllotmentLanding(
      selectedBusinessUnit?.value,
      values?.reportType?.value,
      values?.fromDate,
      values?.toDate,
      values?.certainDate,
      setLoading,
      setRowDto,
      values
    );
  };

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="Set Up Base Achievement"
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
          isExcelBtn={true}
          excelFileNameWillbe="Set Up Base Achievement"
        >
          <div className="mx-auto">
            <Formik enableReinitialize={true} initialValues={initData}>
              {({ values, setFieldValue }) => (
                <>
                  <Form
                    obj={{
                      values,
                      setFieldValue,
                      setRowDto,
                      getGridData,
                      setShowPowerBIReport,
                    }}
                  />
                  {loading && <Loading />}

                  {rowDto?.length > 0 ? (
                    <div className="sta-scrollable-table scroll-table-auto">
                      <div
                        style={{ maxHeight: "500px" }}
                        className="scroll-table _table scroll-table-auto"
                      >
                        {[2, 3, 4].includes(values?.reportType?.value) ? (
                          <TableTwo
                            obj={{
                              rowDto,
                              printRef,
                              values,
                            }}
                          />
                        ) : [1].includes(values?.reportType?.value) ? (
                          <TableOne
                            obj={{
                              rowDto,
                              printRef,
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {rowDto?.length > 0 &&
                  [2, 3, 4].includes(values?.reportType?.value) ? (
                    <TargetVsSalesChart
                      rowData={rowDto}
                      reportType={values?.reportType?.value}
                    />
                  ) : null}

                  {showPowerBIReport && (
                    <PowerBIReport
                      reportId={`1bc970d0-a056-44b9-949d-b66dda9370e7`}
                      groupId={`e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`}
                      parameterValues={[
                        {
                          name: "intUnitId",
                          value: `${selectedBusinessUnit?.value || 0}`,
                        },
                        {
                          name: "intPartid",
                          value: `${values?.viewType?.value || 0}`,
                        },
                        {
                          name: "intShipPointid",
                          value: `${values?.shipPoint?.value || 0}`,
                        },
                        {
                          name: "intChannelid",
                          value: `${values?.channel?.value || 0}`,
                        },
                        {
                          name: "intRegionId",
                          value: `${values?.region?.value || 0}`,
                        },
                        {
                          name: "intAreaid",
                          value: `${values?.area?.value || 0}`,
                        },
                        {
                          name: "intTerritoryId",
                          value: `${values?.territory?.value || 0}`,
                        },
                        {
                          name: "dteFromDate",
                          value: values?.fromDate,
                        },
                        {
                          name: "dteToDate",
                          value: values?.toDate,
                        },
                      ]}
                      parameterPanel={false}
                    />
                  )}
                </>
              )}
            </Formik>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
