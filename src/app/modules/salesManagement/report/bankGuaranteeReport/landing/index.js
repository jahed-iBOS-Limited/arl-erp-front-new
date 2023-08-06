import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { ExcelRenderer } from "react-excel-renderer";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import ICard from "../../../../_helper/_card";
import { excelDateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import {
  getCustomerBankGuaranteeReport,
  getDistributionChannelDDL,
} from "../helper";
import BankGuaranteeReportLandingForm from "./form";
import TableOne from "./tableOne";
import TableTwo from "./tableTwo";

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
                  <BankGuaranteeReportLandingForm
                    obj={{
                      values,
                      errors,
                      rowDto,
                      touched,
                      initData,
                      setRowDto,
                      resetForm,
                      saveHandler,
                      viewHandler,
                      handleClick,
                      setShowReport,
                      setFieldValue,
                      setFileObject,
                      hiddenFileInput,
                      distributionChannelDDL,
                    }}
                  />
                  <div>
                    {/* Bank Guarantee Report */}
                    {rowDto?.length > 0 &&
                      [1].includes(values?.type?.value) && (
                        <TableOne obj={{ rowDto }} />
                      )}

                    {/* Bank Guarantee Excel Upload */}
                    {rowDto?.length > 0 &&
                      [3].includes(values?.type?.value) && (
                        <TableTwo obj={{ rowDto }} />
                      )}

                    {/* Bank Guarantee Dataset (with excel format) */}
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
