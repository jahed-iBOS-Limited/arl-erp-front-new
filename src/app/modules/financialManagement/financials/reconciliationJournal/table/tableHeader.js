/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { DropzoneDialogBase } from "material-ui-dropzone";
import {
  getSbuDDL,
  getInventoryJournalGenLedger,
  getInventoryJournal,
  postInventoryJournal,
  getType,
  getDepreciationGenLedgerList,
  getDepreciationJournal,
  postDepreciationJournal
} from "../helper";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
} from "./../../../../../../_metronic/_partials/controls";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import * as Yup from "yup";
import { SetFinancialsInventoryJournalAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import Loading from "../../../../_helper/_loading";

// Validation schema
const validationSchema = Yup.object().shape({});

const ReconciliationJournal = () => {
  const { financialsInventoryJournal } = useSelector(
    (state) => state?.localStorage
  );

  const dispatch = useDispatch();

  const initData = {
    transactionDate:
      financialsInventoryJournal?.transactionDate || _todayDate(),
    fromDate: financialsInventoryJournal?.fromDate || _todayDate(),
    toDate: financialsInventoryJournal?.toDate || _todayDate(),
    sbu: financialsInventoryJournal?.sbu || "",
    type: financialsInventoryJournal?.type || "",
    closingType: financialsInventoryJournal?.closingType || "",
  };

  // ref
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(false);

  // states
  const [fileObject, setFileObject] = useState("");
  const [sbuDDL, setSbuDDL] = useState([]);
  const [typeDDL] = useState(getType());
  // eslint-disable-next-line no-unused-vars

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  //storingData
  const [jounalLedgerData, setJounalLedgerData] = useState([]);
  const [journalData, setJournalData] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSbuDDL(profileData?.accountId, selectedBusinessUnit?.value, setSbuDDL);
    }
  }, [profileData, selectedBusinessUnit]);

  const setDataToRow = (values) => {
    if (values?.type?.value === 1) {
      getInventoryJournalGenLedger(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values?.fromDate,
        values?.toDate,
        setJounalLedgerData,
        setLoading
      );
      getInventoryJournal(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values?.fromDate,
        values?.toDate,
        setJournalData,
        setLoading
      );
    } else if (values?.type?.value === 2) {
      getDepreciationGenLedgerList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values?.transactionDate,
        setJounalLedgerData,
        setLoading
      );
      getDepreciationJournal(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values?.transactionDate,
        setJournalData,
        setLoading
      );
    }
  };

  const saveHandler = async (values, cb) => {
    // setLoading(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (values?.type?.value === 1) {
        postInventoryJournal(
          values?.closingType,
          profileData?.accountId,
          selectedBusinessUnit?.value,
          values?.sbu?.value,
          values?.fromDate,
          values?.toDate,
          profileData?.userId,
          setLoading,
          cb
        );

      } else if (values?.type?.value === 2) {
        postDepreciationJournal(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          values?.sbu?.value,
          values?.transactionDate,
          profileData?.userId,
          setLoading,
          cb
        )
      }

    } else {
      setLoading(false);
    }
  };
  const totalJournalAmount = useMemo(() => {
    if (jounalLedgerData?.length > 0) {
      return _formatMoney(
        jounalLedgerData?.reduce((acc, item) => (acc += item?.numAmount), 0)
      );
    } else {
      return 0;
    }
  }, [jounalLedgerData]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          let confirmObject = {
            title: `${values?.type?.label} Journal`,
            message: `Are you sure want to create ${values?.type?.label} Journal?`,
            yesAlertFunc: async () => {
              saveHandler(values, (code) => {
                resetForm(initData);
                setJounalLedgerData([]);
                setJournalData([]);

                const nestedConfirmObject = {
                  title: `${values?.type?.label} Journal`,
                  message: `${values?.type?.label} Journal has been created successfully with code ${code}`,
                  buttons: [
                    {
                      label: "OK",
                      onClick: () => { },
                    },
                  ],
                };
                IConfirmModal(nestedConfirmObject);
              });
            },
            noAlertFunc: () => { },
          };
          IConfirmModal(confirmObject);
        }}
      >
        {({ handleSubmit, values, errors, touched, setFieldValue }) => (
          <div className="">
            {loading && <Loading />}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Reconciliation Journal"}>
                <CardHeaderToolbar>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary ml-2"
                    type="submit"
                    disabled={
                      Math.abs(
                        Math.round(
                          jounalLedgerData?.reduce(
                            (acc, item) => acc + item.numAmount,
                            0
                          )
                        )
                      ) || jounalLedgerData?.length === 0 || (
                        values?.type?.value === 1 && !values?.closingType
                      )
                    }
                  >
                    Create Journal
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="form-group row global-form align-items-end">
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
                        onClick={(_) => {
                          setDataToRow(values);
                        }}
                      >
                        Show
                      </button>
                    </div>
                    {/* new changes from miraj bhai */}
                    {
                      values?.type?.value === 1 ? (
                        <div className="col-lg-2">
                          <NewSelect
                            name="closingType"
                            options={[
                              {
                                value: 1,
                                label: "Monthly",
                              },
                              {
                                value: 2,
                                label: "Continuous",
                              }
                            ]}
                            value={values?.closingType}
                            label="Closing Type"
                            onChange={(valueOption) => {
                              setFieldValue("closingType", valueOption);
                              dispatch(
                                SetFinancialsInventoryJournalAction({
                                  ...values,
                                  closingType: valueOption,
                                })
                              );
                            }}
                            placeholder="Closing Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      ) : null
                    }
                  </div>
                  <div></div>
                  <div className="row">
                    <div className="col-12">
                      <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5">
                        <thead className="bg-secondary">
                          <tr>
                            <th>SL</th>
                            <th>General Ledger Code</th>
                            <th>General Ledger Name</th>
                            <th>Narration</th>
                            <th style={{ width: "100px" }}>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {jounalLedgerData?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">
                                {item?.strGenLedgerCode}
                              </td>
                              <td className="text-center">
                                {item?.strGenLedgerName}
                              </td>
                              <td className="text-right">
                                {item?.strNarration}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.numAmount)}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td
                              colSpan={4}
                              className="text-right font-weight-bold"
                            >
                              Total
                            </td>
                            <td className="text-right font-weight-bold">
                              {totalJournalAmount}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {values?.type?.value === 1 ? (
                    <div className="text-center">
                      <h3 className="mt-2">Breakdown Of COGS</h3>
                    </div>
                  ) : null}
                  {journalData?.length > 0 ? (
                    <div className="d-flex justify-content-end mt-2">
                      <ReactHtmlTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button btn btn-primary ml-2"
                        table={
                          values?.type?.value === 1 ? "cogs" : "depreciation"
                        }
                        filename={
                          values?.type?.value === 1
                            ? "Breakdown Of COGS"
                            : "Depreciation"
                        }
                        sheet="Sheet-1"
                        buttonText="Export Excel"
                      />
                    </div>
                  ) : null}
                  <table
                    id={values?.type?.value === 1 ? "cogs" : "depreciation"}
                    className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5"
                  >
                    <thead className="bg-secondary">
                      {values?.type?.value === 1 && (
                        <tr>
                          <th>SL</th>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Profit Center</th>
                          <th>Quantity</th>
                          <th>Avg. COGS</th>
                          <th>Amount</th>
                        </tr>
                      )}
                      {values?.type?.value === 2 && (
                        <tr>
                          <th>SL</th>
                          <th>Asset Code</th>
                          <th>Asset Description</th>
                          <th>Salvage Value</th>
                          <th>Asset Value</th>
                          <th style={{ width: "100px" }}>Depriciation Rate</th>
                          <th>Accumulate Depriciation</th>
                          <th>Net value</th>
                          <th>Last Depriciation Run Date</th>
                          <th style={{ width: "100px" }}>
                            Depriciation Amount
                          </th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {values?.type?.value === 1 && (
                        <>
                          {journalData?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">
                                {item?.strItemCode}
                              </td>
                              <td>{item?.strItemName}</td>
                              <td>{item?.strProfitCenterName}</td>
                              <td className="text-right">{item?.numQty}</td>
                              <td className="text-right">
                                {item?.numAvgCOGS.toFixed(2)}
                              </td>
                              <td className="text-right">
                                {item?.numValue.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td
                              colSpan="4"
                              className="text-right font-weight-bold"
                            >
                              Total
                            </td>
                            <td className="text-right font-weight-bold">
                              {numberWithCommas(
                                journalData
                                  ?.reduce((acc, item) => acc + item.numQty, 0)
                                  .toFixed(2)
                              )}
                            </td>
                            <td></td>
                            <td className="text-right font-weight-bold">
                              {numberWithCommas(
                                journalData
                                  ?.reduce(
                                    (acc, item) => acc + item.numValue,
                                    0
                                  )
                                  .toFixed(2)
                              )}
                            </td>
                          </tr>
                        </>
                      )}
                      {values?.type?.value === 2 && (
                        <>
                          {journalData?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">
                                {item?.strAssetCode}
                              </td>
                              <td className="text-center">
                                {item?.strAssetDescription}
                              </td>
                              <td className="text-right">
                                {item?.numSalvageValue}
                              </td>
                              <td className="text-right">
                                {numberWithCommas(
                                  Math.round(item?.numAcquisitionValue)
                                )}
                              </td>
                              <td className="text-right">
                                {item?.numDepRate || 0}
                              </td>
                              <td className="text-right">
                                {numberWithCommas(
                                  Math.round(item?.numTotalDepValue)
                                )}
                              </td>
                              <td className="text-right">
                                {numberWithCommas(
                                  Math.round(item?.numNetValue)
                                )}
                              </td>
                              <td className="text-center">
                                {_dateFormatter(item?.dteDepRunDate)}
                              </td>
                              <td className="text-right">
                                {numberWithCommas(
                                  Math.round(item?.numDepAmount)
                                )}
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td className="text-right font-weight-bold">
                              Total
                            </td>
                            <td className="text-right font-weight-bold">
                              {numberWithCommas(
                                Math.round(
                                  journalData?.reduce(
                                    (acc, item) => acc + item.numDepAmount,
                                    0
                                  )
                                )
                              )}
                            </td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                  <>
                    <DropzoneDialogBase
                      filesLimit={1}
                      acceptedFiles={[".xlsx", ".xls"]}
                      fileObjects={fileObject}
                      cancelButtonText={"cancel"}
                      submitButtonText={"submit"}
                      maxFileSize={100000000000000}
                      open={open}
                      onAdd={(newFileObjs) => {
                        setFileObject(newFileObjs);
                      }}
                      onClose={() => setOpen(false)}
                      onSave={() => { }}
                      showPreviews={true}
                      showFileNamesInPreview={true}
                    />
                  </>
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
};

export default ReconciliationJournal;
