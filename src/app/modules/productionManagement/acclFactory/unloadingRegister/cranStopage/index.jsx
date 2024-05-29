import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";
import { _monthLastDate } from "../../../../_helper/_monthLastDate";
import PaginationSearch from "../../../../_helper/_search";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { getShiftDDL } from "../../../manufacturingExecutionSystem/productionEntry/helper";
import {
  breakdownTypeDDLForCraneStopageDetails,
  craneNameDDLForCraneStopageDetails,
  onCreateOrEditCraneStopageDetails,
  onGetCraneStopageDetailsLanding,
} from "../helper";
const initialValues = {
  id: null,
  date: null,
  shift: null,
  craneName: "",
  breakdownType: null,
  duration: "",
  stopageDetails: "",
  createdAt: null,
  createdBy: null,
};
// const validationSchema = Yup.object().shape({
//   date: Yup.string()
//     .required("Date is required")
//     .typeError("Date is required"),
//   shift: Yup.object({
//     label: Yup.string().required("Shift is required"),
//     value: Yup.number().required("Shift is required"),
//   })
//     .required("Shift is required")
//     .typeError("Shift is required"),
//   craneName: Yup.object({
//     label: Yup.string().required("Crane name is required"),
//     value: Yup.number().required("Crane name is required"),
//   })
//     .required("Crane name is required")
//     .typeError("Crane name is required"),
//   breakdownType: Yup.object({
//     label: Yup.string().required("Breakdown Type is required"),
//     value: Yup.number().required("Breakdown Type is required"),
//   })
//     .required("Breakdown Type is required")
//     .typeError("Breakdown Type is required"),
//   duration: Yup.string()
//     .required("Duration is required")
//     .typeError("Duration is required"),
//   stopageDetails: Yup.string()
//     .required("Stopes Details is required")
//     .typeError("Stopes Details is required"),
// });
const CranStopage = () => {
  const {
    selectedBusinessUnit,
    profileData: { accountId, userId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [rowList, setRowList] = useState([]);
  const [filterObj, setFilterObj] = useState({
    fromDate: _monthFirstDate(),
    toDate: _monthLastDate(),
    search: "",
    pageNo: 1,
    pageSize: 10,
  });
  const [objProps, setObjprops] = useState({});
  const [shiftDDL, setShiftDDL] = useState([]);
  useEffect(() => {
    getShiftDDL(accountId, selectedBusinessUnit?.value, setShiftDDL);
  }, [accountId, selectedBusinessUnit]);
  const [
    ,
    createCraneStopesDetails,
    loadingOnCreateCranStopesDetails,
  ] = useAxiosPost();
  const [
    cranStopageDetailsLanding,
    getCranStopageDetailsLanding,
    loadingOnGetCraneStopageDetailsLanding,
  ] = useAxiosGet();

  useEffect(() => {
    onGetCraneStopageDetailsLanding({
      getCranStopageDetailsLanding,
      accountId,
      businessUnitId: selectedBusinessUnit?.value,
      fromDate: filterObj?.fromDate,
      toDate: filterObj?.toDate,
      pageNo: filterObj?.pageNo,
      pageSize: filterObj?.pageSize,
      search: filterObj?.search,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {(loadingOnCreateCranStopesDetails ||
        loadingOnGetCraneStopageDetailsLanding) && <Loading />}
      <IForm title="Crane Stoppage Details" getProps={setObjprops}>
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={(formValues, { resetForm }) => {
            if (!rowList?.length) {
              return toast.warn("Please add at least one row");
            }
            onCreateOrEditCraneStopageDetails({
              accountId,
              businessUnitId: selectedBusinessUnit?.value,
              userId,
              createCraneStopesDetails,
              formValues,
              rowList,
              cb: () => {
                resetForm();
                onGetCraneStopageDetailsLanding({
                  getCranStopageDetailsLanding,
                  accountId,
                  businessUnitId: selectedBusinessUnit?.value,
                  fromDate: filterObj?.fromDate,
                  toDate: filterObj?.toDate,
                  pageNo: filterObj?.pageNo,
                  pageSize: filterObj?.pageSize,
                  search: filterObj?.search,
                });
              },
            });
          }}
        >
          {({
            handleSubmit,
            resetForm,
            setFieldValue,
            values,
            errors,
            touched,
            setValues,
          }) => (
            <>
              <Form>
                <button
                  type="button"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onClick={handleSubmit}
                ></button>
                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onClick={() => {
                    resetForm();
                  }}
                ></button>
                <div className="form-group  global-form row">
                  <div className="col-md-3">
                    <InputField
                      value={values?.date}
                      label="Date"
                      name="date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                      }}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-3">
                    <NewSelect
                      name="shift"
                      options={shiftDDL || []}
                      value={values?.shift}
                      label="Shift"
                      onChange={(valueOption) => {
                        setFieldValue("shift", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-3">
                    <NewSelect
                      name="craneName"
                      options={craneNameDDLForCraneStopageDetails}
                      value={values?.craneName}
                      label="Crane Name"
                      onChange={(valueOption) => {
                        setFieldValue("craneName", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-3">
                    <NewSelect
                      name="breakdownType"
                      options={breakdownTypeDDLForCraneStopageDetails}
                      value={values?.breakdownType}
                      label="Breakdown Type"
                      onChange={(valueOption) => {
                        setFieldValue("breakdownType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-3">
                    <InputField
                      value={values?.duration}
                      label="Duration"
                      name="duration"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("duration", e.target.value);
                      }}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-3">
                    <InputField
                      value={values?.stopageDetails}
                      label="Stopage Details"
                      name="stopageDetails"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("stopageDetails", e.target.value);
                      }}
                      touched={touched}
                    />
                  </div>
                  <div style={{ marginTop: "17px" }}>
                    <button
                      disabled={
                        !values?.date ||
                        !values?.shift ||
                        !values?.craneName ||
                        !values?.breakdownType ||
                        !values?.duration ||
                        !values?.stopageDetails
                      }
                      type="button"
                      onClick={() => {
                        setRowList((prev) => [...prev, values]);
                      }}
                      className="btn btn-primary"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Shift</th>
                            <th>Crane Name</th>
                            <th>Breakdown Type</th>
                            <th style={{ width: "70px" }}>Duration</th>
                            <th>Stopage Details</th>
                            <th style={{ width: "70px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowList?.length > 0 &&
                            rowList.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">
                                  {item?.date
                                    ? moment(
                                        item?.date,
                                        "YYYY-MM-DDThh:mm:ss"
                                      ).format("DD-MM-YYYY")
                                    : "N/A"}
                                </td>
                                <td>{item?.shift?.label}</td>
                                <td>{item?.craneName?.label}</td>
                                <td>{item?.breakdownType?.label}</td>
                                <td className="text-center">
                                  {item?.duration}
                                </td>
                                <td className="text-center">
                                  {item?.stopageDetails}
                                </td>
                                <td className="text-center">
                                  <IDelete
                                    remover={(index) => {
                                      const data = rowList?.filter(
                                        (item, i) => i !== index
                                      );
                                      setRowList(data);
                                    }}
                                    id={index}
                                  />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-md-7 form-group  global-form row ml-3">
                    <div className="col-md-5">
                      <InputField
                        value={filterObj?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFilterObj((prev) => ({
                            ...prev,
                            fromDate: e?.target?.value || "",
                          }));
                        }}
                      />
                    </div>
                    <div className="col-md-5">
                      <InputField
                        value={filterObj?.toDate}
                        label="To Date"
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setFilterObj((prev) => ({
                            ...prev,
                            toDate: e?.target?.value || "",
                          }));
                        }}
                      />
                    </div>
                    <div className="col-md-2">
                      <button
                        style={{ marginTop: "18px" }}
                        type="button"
                        className="btn btn-primary ml-3"
                        onClick={() => {
                          onGetCraneStopageDetailsLanding({
                            getCranStopageDetailsLanding,
                            accountId,
                            businessUnitId: selectedBusinessUnit?.value,
                            fromDate: filterObj?.fromDate,
                            toDate: filterObj?.toDate,
                            pageNo: filterObj?.pageNo,
                            pageSize: filterObj?.pageSize,
                            search: filterObj?.search,
                          });
                        }}
                        disabled={!(filterObj?.fromDate && filterObj?.toDate)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  {cranStopageDetailsLanding?.data?.length > 0 ? (
                    <div className="col-md-12">
                      <PaginationSearch
                        placeholder="Search"
                        paginationSearchHandler={(fieldValue) => {
                          setFilterObj((prev) => ({
                            ...prev,
                            search: fieldValue,
                          }));
                          onGetCraneStopageDetailsLanding({
                            getCranStopageDetailsLanding,
                            accountId,
                            businessUnitId: selectedBusinessUnit?.value,
                            fromDate: filterObj?.fromDate,
                            toDate: filterObj?.toDate,
                            pageNo: filterObj?.pageNo,
                            pageSize: filterObj?.pageSize,
                            search: fieldValue,
                          });
                        }}
                      />
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Date</th>
                              <th>Shift</th>
                              <th>Crane Name</th>
                              <th>Breakdown Type</th>
                              <th style={{ width: "70px" }}>Duration</th>
                              <th>Stopage Details</th>
                              {/* <th style={{ width: "70px" }}>Action</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {cranStopageDetailsLanding?.data?.map((item) => (
                              <tr key={item?.sl}>
                                <td className="text-center">{item?.sl}</td>
                                <td className="text-center">
                                  {item?.entryDate
                                    ? moment(
                                        item?.entryDate,
                                        "YYYY-MM-DDThh:mm:ss"
                                      ).format("DD-MM-YYYY")
                                    : "N/A"}
                                </td>
                                <td>{item?.shiftName}</td>
                                <td>{item?.craneName}</td>
                                <td>{item?.breakdownTypeName}</td>
                                <td className="text-center">
                                  {item?.duration}
                                </td>
                                <td>{item?.stopesDetails}</td>
                                {/* <td className="text-center">
                                <IEdit
                                  onClick={() => {
                                    console.log("working");
                                    setValues({
                                      ...values,
                                      id: item?.craneStopageId,
                                      date: dateFormatterForInput(
                                        item?.entryDate
                                      ),
                                      shift: {
                                        label: item?.shiftName,
                                        value: item?.shiftId,
                                      },
                                      craneName: {
                                        label: item?.craneName,
                                        value: item?.craneId,
                                      },
                                      breakdownType: {
                                        label: item?.breakdownTypeName,
                                        value: item?.breakdownTypeId,
                                      },
                                      duration: item?.duration
                                        ? JSON.stringify(item?.duration)
                                        : "",
                                      stopageDetails: item?.stopesDetails,
                                      createdAt: item?.createdAt,
                                      createdBy: item?.createdBy,
                                    });
                                  }}
                                />
                              </td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <PaginationTable
                        count={cranStopageDetailsLanding?.totalCount}
                        setPositionHandler={(newPageNo, newPageSize, _) => {
                          onGetCraneStopageDetailsLanding({
                            getCranStopageDetailsLanding,
                            accountId,
                            businessUnitId: selectedBusinessUnit?.value,
                            fromDate: filterObj?.fromDate,
                            toDate: filterObj?.toDate,
                            pageNo: newPageNo,
                            pageSize: newPageSize,
                            search: filterObj?.search,
                          });
                        }}
                        paginationState={{
                          pageNo: filterObj?.pageNo,
                          setPageNo: (newPageNo) => {
                            setFilterObj((prev) => ({
                              ...prev,
                              pageNo: newPageNo,
                            }));
                          },
                          pageSize: filterObj?.pageSize,
                          setPageSize: (newPageSize) => {
                            setFilterObj((prev) => ({
                              ...prev,
                              pageSize: newPageSize,
                            }));
                          },
                        }}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </Form>
            </>
          )}
        </Formik>
      </IForm>
    </>
  );
};

export default CranStopage;
