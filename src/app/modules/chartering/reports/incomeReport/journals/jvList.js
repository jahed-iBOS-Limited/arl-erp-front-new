/* eslint-disable react-hooks/exhaustive-deps */

import { Formik } from "formik";
import React, { useEffect, useRef } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _dateTimeFormatter } from "../../../../_helper/_dateFormate";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import ICustomTable from "../../../_chartinghelper/_customTable";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import Loading from "../../../_chartinghelper/loading/_loading";
import { imarineBaseUrl } from "../../../../../App";

const initData = { fromDate: _firstDateofMonth(), toDate: _todayDate() };

export default function JVListTable() {
  const printRef = useRef();
  const [gridData, getGridData, loading] = useAxiosGet();

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values) => {
    getGridData(
      `${imarineBaseUrl}/domain/Report/VesselVoyageWiseJournalReport?AccountId=${accId}&BusinessUnitId=${buId}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`
    );
  };

  useEffect(() => {
    getData(initData);
  }, [accId, buId]);

  const headers = [
    { name: "SL" },
    { name: "Journal Code" },
    { name: "Vessel Name" },
    { name: "Voyage No" },
    { name: "Charterer Name" },
    { name: "From Date" },
    { name: "To Date" },
    { name: "Journal Date" },
    { name: "Amount" },
  ];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-content">
                <div className="row">
                  <FromDateToDateForm
                    obj={{
                      values,
                      setFieldValue,
                      onChange: (allValues) => {
                        getData(allValues);
                      },
                    }}
                  />
                </div>
              </div>

              <div ref={printRef}>
                <ICustomTable id="table-to-xlsx" ths={headers || []}>
                  {gridData?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.journalCode}</td>
                      <td>{item?.vesselName}</td>
                      <td>{item?.voyageNo}</td>
                      <td>{item?.chartarerName}</td>
                      <td>{_dateFormatter(item?.dteFromDate)}</td>
                      <td>{_dateFormatter(item?.dteToDate)}</td>
                      <td>{_dateTimeFormatter(item?.journalCreateTime)}</td>
                      <td className="text-right">
                        {_fixedPoint(item?.amount, true, 0)}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ textAlign: "right", fontWeight: "bold" }}>
                    <td colSpan={8}>Total</td>
                    <td>
                      {_fixedPoint(
                        gridData?.reduce(
                          (total, item) => (total += item?.amount),
                          0
                        ),
                        true,
                        0
                      )}
                    </td>
                  </tr>
                </ICustomTable>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
