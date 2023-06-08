/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../../_metronic/_partials/controls";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../../_helper/_formatMoney";
import IEdit from "../../../../../_helper/_helperIcons/_edit";
import IView from "../../../../../_helper/_helperIcons/_view";
import Loading from "../../../../../_helper/_loading";
import PaginationTable from "../../../../../_helper/_tablePagination";
import IViewModal from "../../../../../_helper/_viewModal";
import { getFundLimitLandingData } from "../../helper";
import FundLimitDetailsModal from "../view/FundLimitDetailsModal";
// import { ExcelRenderer } from "react-excel-renderer";

// const header = [
//   "SL",
//   "Tr Date",
//   "Particulers",
//   "Insurence No",
//   "Credit Amount",
//   "Debit Amount",
//   "Balance",
// ];

// Validation schema
const validationSchema = Yup.object().shape({});

const FundLimitLanding = () => {
  const history = useHistory();

  const initData = {};

  // ref
  // eslint-disable-next-line no-unused-vars
  const printRef = useRef();

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  //storingData
  // const [fileData, setFileData] = useState([]);
  // const [filteredFileData, setFilteredFileData] = useState([]);
  const [fundLimitData, setFundLimitData] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [singleItem, setSingleItem] = useState({});
  const [isModalShow, setIsModalShow] = useState(false);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    setLoading(true);
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getFundLimitLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setFundLimitData,
      setLoading
    );
  };

  useEffect(() => {
    getFundLimitLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setFundLimitData,
      setLoading
    );
  }, []);
  const totalLimitAmount = useMemo(
    () => fundLimitData?.data?.reduce((a, c) => a + c.numLimit, 0),
    [fundLimitData?.data]
  );
  const totalUtilizedAmount = useMemo(
    () => fundLimitData?.data?.reduce((a, c) => a + c.utilizedAmount, 0),
    [fundLimitData?.data]
  );
  const totalBalance = useMemo(
    () =>
      fundLimitData?.data?.reduce(
        (a, c) => a + (c.numLimit - c.utilizedAmount),
        0
      ),
    [fundLimitData?.data]
  );
  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, (code) => {});
        }}
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
          <div className="">
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Fund Limit"}>
                <CardHeaderToolbar>
                  <button
                    className="btn btn-primary ml-2"
                    type="submit"
                    disabled={false}
                    onClick={() => {
                      history.push({
                        pathname: `${window.location.pathname}/create`,
                        state: {
                          ...values,
                        },
                      });
                    }}
                  >
                    Create Fund Limit
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {/* <div className="form-group row global-form align-items-end">
                    <div className="col-lg-2">
                      <NewSelect
                        name="sbu"
                        options={sbuDDL || []}
                        value={values?.sbu}
                        label="SBU"
                        onChange={(valueOption) => {
                          setFieldValue("sbu", valueOption);
                          dispatch(
                            SetFinancialsInventoryJournalAction({
                              ...values,
                              sbu: valueOption,
                            })
                          );
                        }}
                        placeholder="SBU"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="type"
                        options={typeDDL || []}
                        value={values?.type}
                        label="Type"
                        onChange={(valueOption) => {
                          setFieldValue("type", valueOption);
                          setJounalLedgerData([]);
                          setJournalData([]);
                          dispatch(
                            SetFinancialsInventoryJournalAction({
                              ...values,
                              type: valueOption,
                            })
                          );
                        }}
                        placeholder="Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {values?.type?.value === 1 && (
                      <div className="col-lg-2">
                        <label>From Date</label>
                        <InputField
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("fromDate", e.target.value);
                            dispatch(
                              SetFinancialsInventoryJournalAction({
                                ...values,
                                fromDate: e.target.value,
                              })
                            );
                          }}
                        />
                      </div>
                    )}
                    {values?.type?.value === 1 && (
                      <div className="col-lg-2">
                        <label>To Date</label>
                        <InputField
                          value={values?.toDate}
                          name="toDate"
                          placeholder="Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("toDate", e.target.value);
                            dispatch(
                              SetFinancialsInventoryJournalAction({
                                ...values,
                                toDate: e.target.value,
                              })
                            );
                          }}
                        />
                      </div>
                    )}
                    {values?.type?.value === 2 && (
                      <div className="col-lg-2">
                        <label>Transaction Date</label>
                        <InputField
                          value={values?.transactionDate}
                          name="transactionDate"
                          placeholder="Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("transactionDate", e.target.value);
                            dispatch(
                              SetFinancialsInventoryJournalAction({
                                ...values,
                                transactionDate: e.target.value,
                              })
                            );
                          }}
                        />
                      </div>
                    )}

                    <div className="col-lg-2">
                      <button
                        className="btn btn-primary mr-2"
                        type="button"
                        onClick={(e) => {
                          setDataToRow(values);
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div> */}
                  <div></div>
                  <div className="row">
                    <div className="col-12">
                      <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5">
                        <thead className="bg-secondary">
                          <tr>
                            <th>SL</th>
                            <th>Bank Name</th>
                            <th>Facilities</th>
                            <th>Limit Amount</th>
                            <th>Utilized Amount</th>
                            <th>Balance</th>
                            <th>Last Updated Date</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fundLimitData?.data?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td className="">{item?.bankName}</td>
                              <td className="">{item?.facilityName}</td>

                              <td className="text-right">
                                {_formatMoney(item?.numLimit)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.utilizedAmount)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(
                                  item?.numLimit - item?.utilizedAmount
                                )}
                              </td>
                              <td className="text-center">
                                {_dateFormatter(item?.loanUpdateDate)}
                              </td>
                              <td className="text-center">
                                <span
                                  style={{ marginRight: "4px" }}
                                  onClick={() => {
                                    setSingleItem(item);
                                    setIsModalShow(true);
                                  }}
                                >
                                  <IView />
                                </span>
                                <span
                                  onClick={() =>
                                    history.push({
                                      pathname: `/financial-management/banking/fund-limit/edit/${item?.bankLoanLimitId}`,
                                    })
                                  }
                                >
                                  <IEdit />
                                </span>
                              </td>
                            </tr>
                          ))}

                          <tr>
                            <td></td>
                            <td></td>
                            <td style={{ textAlign: "right" }}>
                              <b>Total</b>
                            </td>

                            <td style={{ textAlign: "right" }}>
                              <b>{_formatMoney(totalLimitAmount)}</b>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <b>{_formatMoney(totalUtilizedAmount)}</b>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <b>{_formatMoney(totalBalance)}</b>
                            </td>
                            <td></td>
                            <td></td>
                            {/* <td></td> */}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Form>
              </CardBody>
            </Card>
            <IViewModal
              show={isModalShow}
              onHide={() => setIsModalShow(false)}
              title={"Fund Limit Details"}
            >
              <FundLimitDetailsModal singleItem={singleItem} />
            </IViewModal>
            {fundLimitData?.data?.length > 0 && (
              <PaginationTable
                count={fundLimitData?.totalCount}
                setPositionHandler={setPositionHandler}
                paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
              />
            )}
          </div>
        )}
      </Formik>
    </>
  );
};

export default FundLimitLanding;
