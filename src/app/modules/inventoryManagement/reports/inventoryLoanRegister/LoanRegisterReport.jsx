import { Formik, Form } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import ICustomTable from "../../../_helper/_customTable";
import InfoCircle from "../../../_helper/_helperIcons/_infoCircle";
import Loading from "../../../_helper/_loading";
import IViewModal from "../../../_helper/_viewModal";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import NewSelect from "../../../_helper/_select";
import {
  getRegisterReportAction,
  getSbuDDLAction,
} from "./helper";
import RegisterDetailsModal from "./RegisterDetailsModal";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import { _firstDateofMonth } from "../../../_helper/_firstDateOfCurrentMonth";
// import { useHistory } from "react-router-dom";
import { setRegisterReportAction } from "../../../_helper/reduxForLocalStorage/Actions";

const initData = {
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  sbu: "",
  registerType: "",
  generalLedger: "",
};
export function LoanRegisterReport() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  const dispatch = useDispatch();
  const { registerReport } = useSelector(
    (state) => state?.localStorage,
    shallowEqual
  );
  // const history = useHistory();
  const [sbuDDL, setSbuDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [tableItem, setTableItem] = useState("");

  useEffect(() => {
    getSbuDDLAction(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setSbuDDL
    );

    if (registerReport?.sbu?.value) {
      getRegisterReportAction(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        registerReport,
        setRowDto,
        setLoading
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  let totalAmount = 0;

  const getThRow = (values) => {
    return [
      "SL",
      "Partner Code",
      "Partner Name",
      "Opening",
      "Debit",
      "Credit",
      "Ledger Balance",
      "Action",
    ];
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, ...registerReport }}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Loan Register Report">
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="row global-form">
                    <div className="col-md-3 col-lg-2">
                      <NewSelect
                        name="sbu"
                        options={sbuDDL || []}
                        value={values?.sbu}
                        label="SBU"
                        onChange={(valueOption) => {
                          setFieldValue("sbu", valueOption);
                        }}
                        placeholder="SBU"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    {/* <div className="col-md-3 col-lg-2">
                      <NewSelect
                        name="registerType"
                        options={registerTypeDDL}
                        value={values?.registerType}
                        label="Register Type"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("registerType", valueOption);
                          setFieldValue("generalLedger", "");
                          if (valueOption?.value === 5) {
                            getGeneralLedgerDDL(setLoading, setGeneralLedger);
                          }
                        }}
                        placeholder="Partner Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}

                    <div className="col-md-3 col-lg-2">
                      <InputField
                        value={values?.fromDate}
                        label="From date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e?.target?.value);
                          setRowDto([]);
                        }}
                        resetFieldValue={() => {
                          setFieldValue("fromDate", "");
                        }}
                      />
                    </div>

                    <div className="col-md-3 col-lg-2">
                      <InputField
                        value={values?.toDate}
                        label="To Date"
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e?.target?.value);
                          setRowDto([]);
                        }}
                      />
                    </div>

                    <div className="col-lg-1">
                      <ButtonStyleOne
                        label="View"
                        onClick={() => {
                          if (!values?.sbu?.value)
                            return toast.warn("Please select SBU");
                          // if (
                          //   values?.registerType?.value === 5 &&
                          //   !values?.generalLedger?.value
                          // ) {
                          //   return toast.warn("Please select General Ledger");
                          // }
                          getRegisterReportAction(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values,
                            setRowDto,
                            setLoading
                          );
                          dispatch(setRegisterReportAction(values));
                        }}
                        style={{ marginTop: "19px" }}
                      />
                    </div>
                  </div>
                  {rowDto?.length > 0 && !values?.generalLedger?.value && (
                    <ICustomTable
                      ths={getThRow(values)}
                      className="table-font-size-sm"
                    >
                      {rowDto?.map((item, index) => {
                        totalAmount += +item?.numLedgerBalance
                          ? +item?.numLedgerBalance || 0
                          : item?.numBalance || 0;

                        return (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">
                              {item?.strPartnerCode}
                            </td>
                            <td>{item?.strPartnerName}</td>
                            <td className="text-right">
                              {_formatMoney(item?.numOppening)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numDebit)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numCredit)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numLedgerBalance)}
                            </td>
                            <td className="text-center">
                              <InfoCircle
                                clickHandler={() => {
                                  setTableItem(item);
                                  setIsShowModal(true);
                                }}
                                classes="text-primary"
                              />
                            </td>
                          </tr>
                        );
                      })}
                      {values?.registerType?.value === 7 ? (
                        <tr>
                          <td colSpan="3" className="text-right">
                            <b>Total</b>
                          </td>
                          <td className="text-right">
                            <b>
                              {_formatMoney(
                                rowDto
                                  ?.reduce(
                                    (acc, item) => acc + item?.numOppening,
                                    0
                                  )
                                  .toFixed(2)
                              )}
                            </b>
                          </td>
                          <td className="text-right">
                            <b>
                              {_formatMoney(
                                rowDto
                                  ?.reduce(
                                    (acc, item) => acc + item?.numDebit,
                                    0
                                  )
                                  .toFixed(2)
                              )}
                            </b>
                          </td>
                          <td className="text-right">
                            <b>
                              {_formatMoney(
                                rowDto
                                  ?.reduce(
                                    (acc, item) => acc + item?.numCredit,
                                    0
                                  )
                                  .toFixed(2)
                              )}
                            </b>
                          </td>
                          <td className="text-right">
                            <b>{_formatMoney(totalAmount?.toFixed(2))}</b>
                          </td>
                          <td></td>
                        </tr>
                      ) : (
                        <tr>
                          <td
                            colSpan={
                              values?.registerType?.value !== 6 &&
                              values?.registerType?.value
                                ? 3
                                : 5
                            }
                          >
                            <b>Total</b>
                          </td>

                          {totalAmount < 0 && <td></td>}
                          <td className="text-right">
                            <b>{_formatMoney(totalAmount?.toFixed(2))}</b>
                          </td>
                          {/* {totalAmount >= 0 && <td></td>} */}
                          {totalAmount >= 0 && values?.registerType?.value && (
                            <td></td>
                          )}
                          {values?.registerType?.value !== 7 && <td></td>}
                        </tr>
                      )}
                    </ICustomTable>
                  )}
                  <IViewModal
                    title=""
                    show={isShowModal}
                    onHide={() => setIsShowModal(false)}
                  >
                    <RegisterDetailsModal
                      tableItem={tableItem}
                      values={values}
                    />
                  </IViewModal>
                  {/* <IViewModal
                    title=""
                    show={partnerLedgerModalStatus}
                    onHide={() => setPartnerLedgerModalStatus(false)}
                  >
                    <PartnerLedger modalData={partnerLedgerModalData} />
                  </IViewModal> */}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
