import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomTable from "../../../_helper/_customTable";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import InputField from "../../../_helper/_inputField";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import { getWareHouseDDL } from "../../salesInvoice/helper";
import { getVoucherLandingData } from "../helper";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../_metronic/_partials/controls";
import Loading from "./../../../_helper/_loading";

const header = ["SL", "Warehouse", "Voucher No", "Narration", "Date", "Amount", "Action"];

const initData = {
  whName: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const VoucherLanding = () => {
  const history = useHistory();
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [whName, setWhName] = useState([]);
  const dispatch = useDispatch();

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getWareHouseDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        setWhName
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getVoucherLandingData(
      values?.whName?.value,
      profileData?.accountId,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };

  return (
    <>
      {loading && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ setFieldValue, values, errors, touched }) => (
          <>
            <Card>
              <CardHeader title="Voucher">
                <CardHeaderToolbar>
                  <button
                    onClick={() =>
                      history.push(
                        "/pos-management/sales/create-voucher/create"
                      )
                    }
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="whName"
                        options={whName}
                        value={values?.whName}
                        onChange={(valueOption) => {
                          setFieldValue("whName", valueOption);
                        }}
                        placeholder="Warehouse Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        placeholder="From Date"
                        name="fromDate"
                        type="date"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        placeholder="To Date"
                        name="toDate"
                        type="date"
                        touched={touched}
                      />
                    </div>
                    <div style={{ marginTop: "18px" }} className="col-lg-1">
                      <button
                        disabled={
                          !values?.fromDate ||
                          !values?.toDate ||
                          !values?.whName
                        }
                        className="btn btn-primary"
                        onClick={() => {
                          getVoucherLandingData(
                            values?.whName?.value,
                            profileData?.accountId,
                            values?.fromDate,
                            values?.toDate,
                            pageNo,
                            pageSize,
                            setGridData,
                            setLoading
                          );
                        }}
                        type="button"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </Form>
                <ICustomTable ths={header}>
                  {gridData?.data?.length > 0 &&
                    gridData?.data?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ width: "30px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td>
                            <span className="pl-2">{item?.whName}</span>
                          </td>
                          <td>
                            <span className="pl-2">{item?.strVoucherNo}</span>
                          </td>
                          <td>
                            <span className="pl-2">{item?.strNaration}</span>
                          </td>
                          <td>
                            <span className="pl-2">
                              {_dateFormatter(item?.dteDate)}
                            </span>
                          </td>
                          <td className="text-right">
                            <span className="pl-2">
                              {item?.numAmount.toFixed(2)}
                            </span>
                          </td>
                          {/* <td className="text-center">
                            <span
                              onClick={(e) => {
                                history.push(`/pos-management/sales/create-voucher/edit/${item?.intid}`)
                              }}
                            >
                              <IEdit />
                            </span>
                          </td> */}
                          <td className="text-center">
                            {item?.strAttachment ? (
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  dispatch(
                                    getDownlloadFileView_Action(
                                      item?.strAttachment
                                    )
                                  );
                                }}
                              >
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">
                                      {"Attachment"}
                                    </Tooltip>
                                  }
                                >
                                  <span>
                                    <i
                                      class="fa fa-paperclip"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                              </span>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                </ICustomTable>
                {/* Pagination Code */}
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
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
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default VoucherLanding;
