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

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  certainDate: _todayDate(),
  reportType: { value: 1, label: "Customer Base" },
};

export default function OperationalSetUpBaseAchievement() {
  const printRef = useRef();
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

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
      values,
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
                    obj={{ values, setFieldValue, setRowDto, getGridData }}
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
                        ) : (
                          <TableOne
                            obj={{
                              rowDto,
                              printRef,
                            }}
                          />
                        )}
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
                </>
              )}
            </Formik>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
