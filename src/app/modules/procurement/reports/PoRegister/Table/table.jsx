import React, { useEffect, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  getSBUList,
  getPlantList,
  getPurchaseOrgList,
  getWhList,
  getPORegisterLanding,
} from "../helper";
import ILoader from "../../../../_helper/loader/_loader";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import PaginationTable from "./../../../../_helper/_tablePagination";
import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";
import { _todayDate } from "../../../../_helper/_todayDate";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { SetReportPoRegisterAction } from "../../../../_helper/reduxForLocalStorage/Actions";
// const statusData = [
//   { label: 'Approved', value: true },
//   { label: 'Pending', value: false },
// ]

const validationSchema = Yup.object().shape({
  toDate: Yup.string().when("fromDate", (fromDate, Schema) => {
    if (fromDate) return Schema.required("To date is required");
  }),
});

const PORegisterTable = () => {
  const { reportPoRegister } = useSelector((state) => state?.localStorage);

  const initData = {
    wh: reportPoRegister?.wh || "",
    plant: reportPoRegister?.plant || "",
    po: reportPoRegister?.po || "",
    sbu: reportPoRegister?.sbu || "",
    fromDate: reportPoRegister?.fromDate || _todayDate(),
    toDate: reportPoRegister?.toDate || _todayDate(),
    type: reportPoRegister?.type || "",
    typeCode: reportPoRegister?.typeCode || "",
  };

  // //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);

  // ddl state
  const [sbuList, setSbuList] = useState("");
  const [poList, setPoList] = useState("");
  const [plantList, setPlantList] = useState("");
  const [whList, setWhList] = useState("");

  // landing
  const [landing, setLanding] = useState([]);

  // loading
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  // redux data
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });

  // get ddl
  useEffect(() => {
    getSBUList(profileData?.accountId, selectedBusinessUnit?.value, setSbuList);
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getPlantList(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantList
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      // getLandingPageDataFunc(pageNo, pageSize)
      getPurchaseOrgList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPoList
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  // const history = useHistory()

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getPORegisterLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.po?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      values?.type?.value,
      values?.typeCode,
      pageNo,
      pageSize
    );
  };

  // const paginationSearchHandler = (value, values) => {
  //   getPORegisterLanding(
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     setLoading,
  //     setLanding,
  //     values?.sbu?.value,
  //     values?.po?.value,
  //     values?.plant?.value,
  //     values?.wh?.value,
  //     values?.fromDate,
  //     values?.toDate,
  //     pageNo,
  //     pageSize,
  //     value
  //   )
  // }

  const viewRegisterData = (values) => {
    getPORegisterLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.po?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      values?.type?.value,
      values?.typeCode,
      pageNo,
      pageSize
    );
  };

  return (
    <ICustomCard title="PO Register">
      <>
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
          initialValues={initData}
          //validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <>
              <Form className="form form-label-left">
                <div
                  className="row global-form"
                  style={{ background: " #d6dadd" }}
                >
                  <div className="col-lg-2">
                    <NewSelect
                      name="sbu"
                      options={sbuList || []}
                      value={values?.sbu}
                      label="SBU"
                      onChange={(v) => {
                        setFieldValue("sbu", v);
                        dispatch(
                          SetReportPoRegisterAction({
                            ...values,
                            sbu: v,
                          })
                        );
                      }}
                      placeholder="SBU"
                      errors={errors}
                      touched={touched}
                    />{" "}
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="po"
                      options={poList || []}
                      value={values?.po}
                      label="Purchase Organization"
                      onChange={(v) => {
                        setFieldValue("po", v);
                        dispatch(
                          SetReportPoRegisterAction({
                            ...values,
                            po: v,
                          })
                        );
                      }}
                      placeholder="Purchase Organization"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="plant"
                      options={plantList || []}
                      value={values?.plant}
                      label="Plant"
                      onChange={(v) => {
                        getWhList(
                          profileData?.userId,
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          v?.value,
                          setWhList
                        );
                        setFieldValue("plant", v);
                        setFieldValue("wh", "");
                        dispatch(
                          SetReportPoRegisterAction({
                            ...values,
                            plant: v,
                            wh: "",
                          })
                        );
                      }}
                      placeholder="Plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="wh"
                      options={whList || []}
                      value={values?.wh}
                      label="Warehouse"
                      onChange={(v) => {
                        setFieldValue("wh", v);
                        dispatch(
                          SetReportPoRegisterAction({
                            ...values,
                            wh: v,
                          })
                        );
                      }}
                      placeholder="Warehouse"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* <div className="col-lg-2">
                    <NewSelect
                      name="status"
                      options={statusData || []}
                      value={values?.status}
                      label="Status"
                      onChange={(v) => {
                        setFieldValue('status', v)
                      }}
                      placeholder="Status"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  <div className="col-lg-2">
                    <label>From Date</label>
                    <div className="d-flex">
                      <InputField
                       style={{ width: "100%" }}
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From date"
                        type="date"
                        onChange={(e) => {
                          dispatch(
                            SetReportPoRegisterAction({
                              ...values,
                              fromDate: e?.target?.value,
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <label>To Date</label>
                    <div className="d-flex">
                      <InputField
                        style={{ width: "100%" }}
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                        onChange={(e) => {
                          dispatch(
                            SetReportPoRegisterAction({
                              ...values,
                              toDate: e?.target?.value,
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="type"
                      options={[
                        { value: 1, label: "Purchase Request" },
                        { value: 2, label: "Purchase Order" },
                        { value: 3, label: "Inventory Transaction" },
                        { value: 4, label: "Item" },
                      ]}
                      value={values?.type}
                      label="Type"
                      onChange={(v) => {
                        setFieldValue("type", v);
                        setFieldValue("typeCode", "");
                        dispatch(
                          SetReportPoRegisterAction({
                            ...values,
                            type: v,
                            typeCode: "",
                          })
                        );
                      }}
                      placeholder="Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>
                      {values?.type?.value === 1
                        ? "Purchase Request Code"
                        : values?.type?.value === 2
                        ? "Purchase Order Code"
                        : values?.type?.value === 3
                        ? "Transaction Code"
                        : "Item"}
                    </label>
                    <div className="d-flex">
                      <InputField
                      style={{ width: "100%" }}
                        value={values?.typeCode}
                        name="typeCode"
                        placeholder={
                          values?.type?.value === 1
                            ? "Purchase Request Code"
                            : values?.type?.value === 2
                            ? "Purchase Order Code"
                            : values?.type?.value === 3
                            ? "Transaction Code"
                            : "Item"
                        }
                        type="text"
                        onChange={(e) => {
                          dispatch(
                            SetReportPoRegisterAction({
                              ...values,
                              typeCode: e?.target?.value,
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 mt-5">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        !values?.wh ||
                        !values?.plant ||
                        !values?.sbu ||
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.type
                        // ||
                        // !values?.typeCode
                      }
                      onClick={() => {
                        viewRegisterData(values);
                        // dispatch(setPurchaseRequestPPRAction(values))
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </Form>
              <div className="row">
                {/* {loading && <Loading />} */}

                <div className="col-lg-12">
                  {/* <PaginationSearch
                    placeholder="PO Code PR Code MMR No Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  /> */}
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table table-font-size-sm">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>PR No</th>
                          <th>PR Req Date</th>
                          <th>PR Approve Date</th>
                          <th>PO No</th>
                          <th>PO Value</th>
                          <th>PO Date</th>
                          <th>PO Approve Date</th>
                          <th>Supplier</th>
                          <th>MRR No</th>
                          <th>MRR Date</th>
                          <th>Invoice Date</th>
                          <th>Payment Amount</th>
                          {/* <th>Action</th> */}
                        </tr>
                      </thead>
                      {loading ? (
                        <ILoader />
                      ) : (
                        <tbody>
                          {landing?.map((item, index) => (
                            <tr key={index}>
                              <td>{item?.Sl || index + 1}</td>
                              <td>{item?.indent}</td>
                              <td>{_dateFormatter(item?.indDate)}</td>
                              <td>{_dateFormatter(item?.appDate)}</td>
                              <td>{item?.po}</td>
                              <td>
                                {numberWithCommas(
                                  (item?.poValue || 0).toFixed(2)
                                )}
                              </td>
                              <td>{_dateFormatter(item?.poDate)}</td>
                              <td>{_dateFormatter(item?.appDate)}</td>
                              <td>{item?.sup}</td>
                              <td>{item?.mrr}</td>
                              <td>{_dateFormatter(item?.mrrDate)}</td>
                              <td>{_dateFormatter(item?.paymentDate)}</td>
                              <td>
                                {numberWithCommas(
                                  (item?.payAmount || 0).toFixed(2)
                                )}
                              </td>
                              {/* <td className="text-center align-middle">
                              <div className="d-flex justify-content-around">
                                <span
                                  onClick={() =>
                                    history.push({
                                      pathname: `/mngProcurement/purchase-management/purchase-request/edit/${item?.purchaseRequestId}`,
                                      item,
                                      state: {
                                        ...values
                                      }
                                    })
                                  }
                                >
                                  {!item?.isApproved && <IEdit />}
                                </span>

                                <span>
                                  {' '}
                                  <IView
                                    clickHandler={() =>
                                      history.push({
                                        pathname: `/mngProcurement/purchase-management/purchase-request/report/${item?.purchaseRequestId}`,
                                        item,
                                      })
                                    }
                                  />{' '}
                                </span>
                              </div>
                            </td> */}
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
              {landing?.length > 0 && (
                <PaginationTable
                  count={landing[0]?.totalRows}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                  rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 300, 400, 500]}
                />
              )}
            </>
          )}
        </Formik>
      </>
    </ICustomCard>
  );
};

export default PORegisterTable;
