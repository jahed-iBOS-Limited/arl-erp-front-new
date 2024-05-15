import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import PaginationTable from "../../../_helper/_tablePagination";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

function KeyRegisterLanding() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      `/mes/MSIL/GetAllKeyRegisterLanding?intBusinessUnitId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}`
      //  `/mes/MSIL/GetAllKeyRegisterLanding?PageNo=${pageNo}&PageSize=${pageSize}&search=asd&date=2022-01-02`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      `/mes/MSIL/GetAllKeyRegisterLanding?intBusinessUnitId=${
        selectedBusinessUnit?.value
      }&PageNo=${pageNo}&PageSize=${pageSize}&search=${searchValue}&date=${values?.date ||
        ""}`
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={{}} onSubmit={() => {}}>
        {({ values, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Key Register"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/production-management/msil-gate-register/Key-Register/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <InputField
                        value={values?.date}
                        label="Date"
                        name="date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("date", e.target.value);
                          //setDate(e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary ml-2"
                        disabled={false}
                        onClick={() => {
                          getRowData(
                            `/mes/MSIL/GetAllKeyRegisterLanding?intBusinessUnitId=${
                              selectedBusinessUnit?.value
                            }&PageNo=${pageNo}&PageSize=${pageSize}&search=${""}&date=${
                              values?.date
                            }`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </div>
                <div className="po_custom_search">
                  <PaginationSearch
                    placeholder="Search here..."
                    paginationSearchHandler={paginationSearchHandler}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>তারিখ</th>
                            <th>চাবি গ্রহনকারীর নাম</th>
                            <th>পদবী</th>
                            <th>চাবির স্থান</th>
                            <th>চাবির সংখ্যা</th>
                            <th>চাবি প্রদানের সময়</th>
                            <th>চাবি গ্রহণের সময়</th>
                            <th>চাবি প্রদানকারীর নাম</th>
                            <th style={{ width: "50px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.keyRegisterList?.length > 0 &&
                            rowData?.keyRegisterList?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteDate)}
                                </td>
                                <td>{item?.strKeyReceiverName}</td>
                                <td>{item?.strDesignation}</td>
                                <td>{item?.strKeyLocation}</td>
                                <td className="text-center">
                                  {item?.numKeyQuantity}
                                </td>
                                <td className="text-center">
                                  {_timeFormatter(item?.tmKeyProvideTime || "")}
                                </td>
                                <td className="text-center">
                                  {_timeFormatter(item?.tmKeyReceiveTime || "")}
                                </td>
                                <td>{item?.strKeyProviderName}</td>
                                <td className="text-center">
                                  <IEdit
                                    onClick={() =>
                                      history.push({
                                        pathname: `/production-management/msil-gate-register/Key-Register/edit/${item?.intGateKeyRegisterId}`,
                                        state: { ...item },
                                      })
                                    }
                                  />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {rowData?.keyRegisterList?.length > 0 && (
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
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default KeyRegisterLanding;
