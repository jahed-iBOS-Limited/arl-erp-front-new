import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import Loading from "../../../_helper/_loading";
import PaginationTable from "../../../_helper/_tablePagination";

function CostCalculationLanding() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    // getRowData(
    //   `/mes/MSIL/GetAllKeyRegisterLanding?intBusinessUnitId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}`
    //   //  `/mes/MSIL/GetAllKeyRegisterLanding?PageNo=${pageNo}&PageSize=${pageSize}&search=asd&date=2022-01-02`
    // );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    // getRowData(
    //   `/mes/MSIL/GetAllKeyRegisterLanding?intBusinessUnitId=${
    //     selectedBusinessUnit?.value
    //   }&PageNo=${pageNo}&PageSize=${pageSize}&search=${searchValue}&date=${values?.date ||
    //     ""}`
    // );
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
              <CardHeader title={"Cost Calculation"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/internal-control/costing/costingcalculation/create`,
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
                {/* <div className="form-group  global-form">
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
                </div> */}
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Product Name</th>
                            <th style={{ width: "50px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.keyRegisterList?.length > 0 &&
                            rowData?.keyRegisterList?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.strKeyReceiverName}</td>
                                <td className="text-center">
                                  {/* <IEdit
                                    onClick={() =>
                                      history.push({
                                        pathname: `/production-management/msil-gate-register/Key-Register/edit/${item?.intGateKeyRegisterId}`,
                                        state: { ...item },
                                      })
                                    }
                                  /> */}
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

export default CostCalculationLanding;
