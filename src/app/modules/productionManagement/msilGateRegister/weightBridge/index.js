import { Formik } from "formik";
import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";

const initData = {
  date: "",
  receiveType: "",
};

function Weightbridge() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      values?.receiveType?.value === 2
        ? `/mes/MSIL/GetWeightBridgeLanding?date=${values?.date}&pageNo=${pageNo}&pageSize=${pageSize}`
        : `/mes/MSIL/GetAllGateInByPOLanding?PageNo=${pageNo}&PageSize=${pageSize}&Date=${values?.date}&BusinessunitId=${selectedBusinessUnit?.value}`
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Weighbridge"}>
                <CardHeaderToolbar>
                  {/* <button
                    onClick={() => {
                      history.push({
                        pathname: `/production-management/msil-gate-register/Gate-Item-Entry/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="receiveType"
                        options={[
                          // { value: 1, label: "With PO" },
                          { value: 2, label: "Without PO" },
                        ]}
                        value={values?.receiveType}
                        label="Receive Type"
                        onChange={(valueOption) => {
                          setFieldValue("receiveType", valueOption);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.date}
                        label="Date"
                        name="date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("date", e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary"
                        disabled={!values?.date || !values?.receiveType?.value}
                        onClick={() => {
                          getRowData(
                            values?.receiveType?.value === 2
                              ? `/mes/MSIL/GetWeightBridgeLanding?date=${values?.date}&pageNo=${pageNo}&pageSize=${pageSize}`
                              : `/mes/MSIL/GetAllGateInByPOLanding?PageNo=${pageNo}&PageSize=${pageSize}&Date=${values?.date}&BusinessunitId=${selectedBusinessUnit?.value}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>ড্রাইভারের নাম</th>
                            <th>মোবাইল নাম্বার</th>
                            <th>গাড়ীর নাম্বার</th>
                            <th>চালান নাম্বার</th>
                            <th>পণ্যের নাম</th>
                            <th>সাপ্লায়ারের নাম</th>
                            <th>ওজন নং</th>
                            <th>1st Weight</th>
                            <th>2nd Weight</th>
                            <th>Net Weight</th>
                            <th style={{ width: "50px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.data?.length > 0 &&
                            rowData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {item?.strDriverName}
                                </td>
                                <td>{item?.strDriverMobileNo}</td>
                                <td>{item?.strTruckNumber}</td>
                                <td>{item?.strInvoiceNumber}</td>
                                <td>{item?.strItemName}</td>
                                <td>{item?.strSupplierName}</td>
                                <td className="text-center">
                                  {item?.strWeightNo}
                                </td>
                                <td>{item?.numVehicleWeightWithScrap}</td>
                                <td className="text-center">
                                  {item?.numVehicleWeightWithoutScrap}
                                </td>
                                <td>{item?.numScrapWeight}</td>
                                <td className="text-center">
                                  <div>
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip id="cs-icon">
                                          {"Create"}
                                        </Tooltip>
                                      }
                                    >
                                      <span>
                                        <i
                                          className={`fas fa-plus-square`}
                                          onClick={() =>
                                            history.push({
                                              pathname: `/production-management/msil-gate-register/Weighbridge/edit/${item?.intGateEntryItemListId}`,
                                              state: { ...item },
                                            })
                                          }
                                        ></i>
                                      </span>
                                    </OverlayTrigger>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {rowData?.data?.length > 0 && (
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

export default Weightbridge;
