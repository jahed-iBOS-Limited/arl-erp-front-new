import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { ExcelRenderer } from "react-excel-renderer";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import ICard from "../../../../_helper/_card";
import ICustomTable from "../../../../_helper/_customTable";
import { excelDateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getCustomerBankGuaranteeReport,
  getDistributionChannelDDL,
} from "../helper";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

// Table Header
const ths = [
  "Sl",
  "Party Name",
  "Bank Guarantee",
  "Actual Credit Limit",
  "BG vs Limit (%)",
  "Approved OD (30%)",
  "Used OD",
  "Out of 30% OD",
  "Debit",
  "Sales",
  "BG COMM/Bag",
  "Total BG Commission",
  "Remarks",
];
const ths_2 = [
  "Sl",
  "Partner Name",
  "Existing Mortgage Amount",
  "Updated Mortgage Amount",
  "Existing Bank Name",
  "Updated Bank Name",
  "Branch Name",
  "Issue Date",
  "Expire Date",
  "Remarks",
];

// Validation schema
const validationSchema = Yup.object().shape({
  date: Yup.date().required("From Date is required"),
  distributionChannel: Yup.object().shape({
    label: Yup.string().required("Distribution Channel is required"),
    value: Yup.string().required("Distribution Channel is required"),
  }),
});

const initData = {
  date: _todayDate(),
  distributionChannel: "",
  expireWithin: { value: 0, label: "All" },
  type: "",
};

const types = [
  { value: 1, label: "Bank Guarantee Report" },
  { value: 2, label: "Bank Guarantee Dataset (with excel format)" },
  { value: 3, label: "Bank Guarantee Excel Upload" },
];

export default function BankGuaranteeReport() {
  const printRef = useRef();
  const hiddenFileInput = useRef(null);

  const [fileObject, setFileObject] = useState("");
  const [rowDto, setRowDto] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [, updateBankGuaranteeInfo, loader] = useAxiosPost();

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getDistributionChannelDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (fileObject) {
      ExcelRenderer(fileObject, (err, resp) => {
        if (err) {
          toast.warning("An unexpected error occurred");
        } else {
          const modify = resp.rows?.slice(1)?.map((itm, index) => {
            console.log(itm, "itm");
            return {
              intAccountId: profileData?.accountId,
              intBusinessUnitId: selectedBusinessUnit?.value,
              intBusinessPartnerId: itm[1],
              businessPartnerName: itm[2],
              businessPartnerCode: itm[3],
              // intMortgageType: itm[4],
              existingMortgageAmount: itm[4],
              numMortgageAmount: itm[5],
              strNarration: itm[11],
              strRefNo: itm[12],
              preBankName: itm[9],
              strBankName: itm[10],
              // intBranchId: itm[7],
              // strBranchName: itm[8],
              intBankId: itm[8],
              dteIssueDate: itm[6] ? excelDateFormatter(itm[6]) : "",
              intActionBy: profileData?.userId,
              dteExpireDate: itm[7] ? excelDateFormatter(itm[7]) : "",
            };
          });

          setRowDto(modify);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileObject]);

  const viewHandler = async (values) => {
    getCustomerBankGuaranteeReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.distributionChannel?.value,
      values?.date,
      setLoading,
      setRowDto
    );
  };

  const saveHandler = (cb) => {
    const payload = rowDto?.map((element) => {
      return {
        ...element,
        numMortgageAmount:
          element?.numMortgageAmount || element?.existingMortgageAmount,
        strBankName: element?.strBankName || element?.preBankName,
        intBranchId: 0,
        strBranchName: "string",
      };
    });
    updateBankGuaranteeInfo(
      `/partner/BusinessPartnerSales/CreateBulkSalesMortgage`,
      payload,
      () => cb(),
      true
    );
  };

  let totalBG = 0;
  let totalActualCreditLimit = 0;
  let totalBGvsLimit = 0;
  let totalApprovedOD = 0;
  let totalUsedOD = 0;
  let totalOutOf30OD = 0;
  let totalDebit = 0;
  let totalSales = 0;
  // let totalBGComm = 0;
  let totalCommission = 0;

  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `c74cc804-d70e-4d81-98d0-45eea55f6625`;

  const parameterValues = (values) => {
    return [
      { name: "Bunit", value: `${selectedBusinessUnit?.value}` },
      { name: "ChannelID", value: `${values?.distributionChannel?.value}` },
      { name: "ViewType", value: `${2}` },
    ];
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      {({ values, errors, touched, setFieldValue, resetForm }) => (
        <>
          {(loading || loader) && <Loading />}
          <ICard
            printTitle="Print"
            title="Bank Guarantee"
            isExcelBtn={true}
            isPrint={true}
            isShowPrintBtn={true}
            componentRef={printRef}
            excelFileNameWillbe="Bank Guarantee Report"
            pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
          >
            <div ref={printRef}>
              <div className="mx-auto">
                <div className="text-center my-2">
                  <h3>
                    <b>Bank Guarantee Report</b>
                  </h3>
                  <h4>
                    <b>{selectedBusinessUnit?.label}</b>
                  </h4>
                </div>

                <>
                  <form className="form form-label-right">
                    <div className="form-group row global-form printSectionNone">
                      <div className="col-lg-3">
                        <NewSelect
                          name="type"
                          options={types}
                          value={values?.type}
                          label="Operation Type"
                          onChange={(valueOption) => {
                            setFieldValue("type", valueOption);
                            setRowDto([]);
                            setShowReport(false);
                          }}
                          placeholder="Select operation type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      {values?.type?.value === 1 && (
                        <div className="col-lg-3">
                          <InputField
                            value={values?.date}
                            label="Date"
                            name="date"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("date", e?.target?.value);
                              setRowDto([]);
                              setShowReport(false);
                            }}
                          />
                        </div>
                      )}
                      {[1, 2].includes(values?.type?.value) && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="distributionChannel"
                            options={[
                              { value: 0, label: "All" },
                              ...distributionChannelDDL,
                            ]}
                            value={values?.distributionChannel}
                            label="Distribution Channel"
                            onChange={(valueOption) => {
                              setFieldValue("distributionChannel", valueOption);
                              setRowDto([]);
                              setShowReport(false);
                            }}
                            placeholder="Distribution Channel"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}

                      {[1, 2].includes(values?.type?.value) && (
                        <div>
                          <button
                            disabled={!values?.distributionChannel}
                            type="button"
                            className="btn btn-primary mt-5"
                            style={{ marginLeft: "13px" }}
                            onClick={() => {
                              viewHandler(values);
                              setShowReport(true);
                            }}
                          >
                            View
                          </button>
                        </div>
                      )}
                      {values?.type?.value === 3 && (
                        <div>
                          <button
                            className="btn btn-primary mt-5"
                            onClick={handleClick}
                            type="button"
                          >
                            Upload Excel
                          </button>
                          <input
                            type="file"
                            onChange={(e) => {
                              setFileObject(e.target.files[0]);
                            }}
                            ref={hiddenFileInput}
                            style={{ display: "none" }}
                            accept=".csv, .ods, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          />
                        </div>
                      )}
                      {values?.type?.value === 3 && rowDto?.length > 0 && (
                        <button
                          className="btn btn-info mt-5 ml-3"
                          type="button"
                          onClick={() => {
                            saveHandler(() => {
                              setRowDto([]);
                              resetForm(initData);
                            });
                          }}
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </form>
                  <div>
                    {rowDto?.length > 0 && [1].includes(values?.type?.value) && (
                      <ICustomTable ths={ths} id="table-to-xlsx">
                        {rowDto?.map((itm, index) => {
                          totalBG += itm.BG;
                          totalActualCreditLimit += itm.ActualCL;
                          totalBGvsLimit += itm.BgVSL;
                          totalApprovedOD += itm.ApprovedOD30;
                          totalUsedOD += itm.UsedOD;
                          totalOutOf30OD += itm.Outof30OD;
                          totalDebit += itm.Debit;
                          totalSales += itm.SalesBag;
                          // totalBGComm += itm.BGCommissionBag;
                          totalCommission += itm.TotalCommission;

                          return (
                            <>
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td> {itm?.CustomerName}</td>
                                <td className="text-right"> {itm?.BG}</td>
                                <td className="text-right">{itm?.ActualCL}</td>
                                <td className="text-right">{itm?.BgVSL}</td>
                                <td className="text-right">
                                  {itm?.ApprovedOD30}
                                </td>
                                <td className="text-right">{itm?.UsedOD}</td>
                                <td className="text-right">{itm?.Outof30OD}</td>
                                <td className="text-right">{itm?.Debit}</td>
                                <td className="text-right">{itm?.SalesBag}</td>
                                <td className="text-right">
                                  {itm?.BGCommissionBag}
                                </td>
                                <td className="text-right">
                                  {itm?.TotalCommission}
                                </td>
                                <td className="text-right">{itm?.Remarks}</td>
                              </tr>
                            </>
                          );
                        })}
                        <tr style={{ fontWeight: "bold" }}>
                          <td className="text-right" colSpan={2}>
                            Total
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalBG, true)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalActualCreditLimit, true)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalBGvsLimit, true)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalApprovedOD, true)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalUsedOD, true)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalOutOf30OD, true)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalDebit, true)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalSales, true)}
                          </td>
                          <td className="text-right"></td>
                          <td className="text-right">
                            {_fixedPoint(totalCommission, true)}
                          </td>
                          <td></td>
                        </tr>
                      </ICustomTable>
                    )}
                    {rowDto?.length > 0 && [3].includes(values?.type?.value) && (
                      <ICustomTable ths={ths_2} id="table-to-xlsx">
                        {rowDto?.map((itm, index) => {
                          return (
                            <>
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td> {itm?.businessPartnerName}</td>
                                <td className="text-right">
                                  {_fixedPoint(
                                    itm?.existingMortgageAmount,
                                    true,
                                    0
                                  )}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(itm?.numMortgageAmount, true, 0)}
                                </td>
                                <td>{itm?.preBankName}</td>
                                <td>{itm?.strBankName}</td>
                                <td>{itm?.strBranchName}</td>
                                <td>
                                  {
                                    itm?.dteIssueDate
                                    // ? excelDateFormatter(itm?.dteIssueDate)
                                    // : ""
                                  }
                                </td>
                                <td>
                                  {
                                    itm?.dteExpireDate
                                    // ? excelDateFormatter(itm?.dteExpireDate)
                                    // : ""
                                  }
                                </td>
                                <td className="text-right">
                                  {itm?.strNarration}
                                </td>
                              </tr>
                            </>
                          );
                        })}
                        {/* <tr style={{ fontWeight: "bold" }}>
                          <td className="text-right" colSpan={2}>
                            Total
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalBG, true)}
                          </td>

                          <td colSpan={5}></td>
                        </tr> */}
                      </ICustomTable>
                    )}

                    {showReport && values?.type?.value === 2 && (
                      <PowerBIReport
                        reportId={reportId}
                        groupId={groupId}
                        parameterValues={parameterValues(values)}
                        parameterPanel={false}
                      />
                    )}
                  </div>
                </>
              </div>
            </div>
          </ICard>
        </>
      )}
    </Formik>
  );
}
