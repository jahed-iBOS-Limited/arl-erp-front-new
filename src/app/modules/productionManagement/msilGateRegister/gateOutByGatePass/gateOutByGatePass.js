import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import Loading from "../../../_helper/_loading";
import PaginationTable from "../../../_helper/_tablePagination";
import { _timeFormatter } from "../../../_helper/_timeFormatter";

function GateOutDelivary() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      `/mes/MSIL/GetAllGateOutByGatePassLanding?PageNo=${pageNo}&PageSize=${pageSize}&intBusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      `/mes/MSIL/GetAllGateOutByGatePassLanding?PageNo=${pageNo}&PageSize=${pageSize}&intBusinessUnitId=${selectedBusinessUnit?.value}`
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <>
            {lodar && <Loading />}
            <div className="row">
              <div className="col-lg-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Date</th>
                        <th>Out Time</th>
                        <th>Gate Pass Code</th>
                        <th>Item Name</th>
                        <th>UoM</th>
                        <th>Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.gateOutByGatePassList?.length > 0 &&
                        rowData?.gateOutByGatePassList?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.dteDate)}
                            </td>
                            <td className="text-center">
                              {_timeFormatter(item?.tmOutTime || "")}
                            </td>
                            <td className="text-center">
                              {item?.strGatePassCode}
                            </td>
                            <td>{item?.strItemName}</td>
                            <td>{item?.strUoM}</td>
                            <td>{item?.strRemarks}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {rowData?.gateOutByGatePassList?.length > 0 && (
                  <PaginationTable
                    count={rowData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}

export default GateOutDelivary;
