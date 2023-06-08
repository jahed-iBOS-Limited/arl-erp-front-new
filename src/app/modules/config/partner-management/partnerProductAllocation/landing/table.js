/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import { DropzoneDialogBase } from "material-ui-dropzone";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import PaginationTable from "../../../../_helper/_tablePagination";
import ICustomTable from "../../../../_helper/_customTable";
import { Form, Formik } from "formik";
import {
  GetPartnerProductAllocationLandingData,
  CreatePartnerAllotmentExcel_api,
  getBusinessPartnerDDL,
} from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import InputField from "../../../../_helper/_inputField";
import IView from "../../../../_helper/_helperIcons/_view";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import moment from "moment";
import NewSelect from "../../../../_helper/_select";

const type = [
  {
    label: "Partner Wise",
    value: 1,
  },
  {
    label: "Date Wise",
    value: 2,
  },
];
const header = [
  "SL",
  "Customer Name",
  "Item Name",
  "Alloted Qty",
  "PH. DLV.",
  "CMN. DLV.",
  "Pending Qty",
  "Item Rate",
  "From Date",
  "To Date",
  "Remaining Days",
  "Action",
];

const initData = { fromDate: _todayDate(), toDate: _todayDate() };

const PartnerProductAllocation = () => {
  const history = useHistory();
  const [fileObjects, setFileObjects] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [open, setOpen] = React.useState(false);

  const [partnerDDL, setPartnerDDL] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    GetPartnerProductAllocationLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.businessPartner?.value,
      values?.type?.value,
      values?.fromDate,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };
  useEffect(() => {
    getGrid(initData);
    getBusinessPartnerDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPartnerDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const getGrid = (values) => {
    GetPartnerProductAllocationLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.businessPartner?.value,
      values?.type?.value,
      values?.fromDate,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, type: type[1] }}
        onSubmit={() => {}}
      >
        {({ touched, values, setFieldValue, errors }) => (
          <>
            <Card>
              <CardHeader title="Partner Product Allocation">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push(
                        "/config/partner-management/partner-prod-allocation/add"
                      );
                    }}
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="type"
                        label="Type"
                        options={type}
                        value={values?.type}
                        onChange={(valueOption) => {
                          setFieldValue("type", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    {/* if type is equal Partner Wise */}
                    {values?.type?.value === 1 && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="businessPartner"
                          label="Business Partner"
                          options={partnerDDL}
                          value={values?.businessPartner}
                          onChange={(valueOption) => {
                            setFieldValue("businessPartner", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )}

                    {/* if type is equal Date */}
                    {values?.type?.value === 2 && (
                      <div className="col-lg-3">
                        <label>Report Date</label>
                        <InputField
                          value={values?.fromDate}
                          placeholder="Report Date"
                          name="fromDate"
                          type="date"
                          touched={touched}
                        />
                      </div>
                    )}

                    {/* <div className="col-lg-3">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        placeholder="To Date"
                        name="toDate"
                        type="date"
                        touched={touched}
                      />
                    </div> */}
                    <div className="col-lg-1 mt-5">
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          getGrid(values);
                        }}
                      >
                        View
                      </button>
                    </div>
                    <div className="col text-right ">
                      <button
                        className="btn btn-primary mt-5"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Allocation Upload
                      </button>
                    </div>
                  </div>

                  <ICustomTable ths={header}>
                    {gridData?.data?.length > 0 &&
                      gridData?.data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td
                              style={{ width: "30px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.customerName}</td>
                            <td>{item?.itemName}</td>
                            <td className="text-right">{item?.allotedQty}</td>
                            <td className="text-right">
                              {item?.pysicalDelivery}
                            </td>
                            <td className="text-right">
                              {item?.commissionDelivery}
                            </td>
                            <td className="text-right">{item?.pendingQTY}</td>
                            <td className="text-right">{item?.itemRate}</td>

                            <td>
                              {moment(item?.fromDate).format("MMMM DD, YYYY")}
                            </td>
                            <td>
                              {moment(item?.toDate).format("MMMM DD, YYYY")}
                            </td>
                            <td className="text-right">{item?.remainingDay}</td>
                            <td
                              style={{ width: "100px" }}
                              className="text-center"
                            >
                              <span
                                className="view pr-2"
                                onClick={(e) =>
                                  history.push({
                                    pathname: `/config/partner-management/partner-prod-allocation/view/${item?.allotmentId}`,
                                  })
                                }
                              >
                                <IView />
                              </span>
                              <span
                                className="edit pr-2"
                                onClick={(e) =>
                                  history.push({
                                    pathname: `/config/partner-management/partner-prod-allocation/edit/${item?.allotmentId}`,
                                  })
                                }
                              >
                                <IEdit />
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </ICustomTable>

                  {/* Pagination Code */}
                  {gridData?.data?.length > 0 && values?.type?.value !== 1 && (
                    <PaginationTable
                      count={gridData?.totalCount}
                      values={values}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                    />
                  )}

                  <DropzoneDialogBase
                    filesLimit={1}
                    acceptedFiles={[".xlsx", ".xls"]}
                    fileObjects={fileObjects}
                    cancelButtonText={"cancel"}
                    submitButtonText={"submit"}
                    maxFileSize={1000000}
                    open={open}
                    onAdd={(newFileObjs) => {
                      setFileObjects(newFileObjs);
                    }}
                    onDelete={(deleteFileObj) => {
                      const newData = fileObjects.filter(
                        (item) => item.file.name !== deleteFileObj.file.name
                      );
                      setFileObjects(newData);
                    }}
                    onClose={() => setOpen(false)}
                    onSave={() => {
                      console.log(fileObjects);
                      setOpen(false);
                      CreatePartnerAllotmentExcel_api({
                        accountId: profileData?.accountId,
                        buid: selectedBusinessUnit?.value,
                        userId: profileData?.userId,
                        fileObjects: fileObjects,
                        setLoading: setLoading,
                      });
                      // setFileObjects([])
                    }}
                    showPreviews={true}
                    showFileNamesInPreview={true}
                  />
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default PartnerProductAllocation;
