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
  getSubmittedBankGuarantee,
} from "../helper";
import BankGuaranteeReportLandingForm from "./form";
import TableOne from "./tableOne";
import TableTwo from "./tableTwo";
import TableThree from "./tableThree";
import PaginationTable from "../../../../_helper/_tablePagination";

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
  customer: "",
  month: "",
  year: "",
  status: "",
};

export default function BankGuaranteeReport() {
  const printRef = useRef();
  const hiddenFileInput = useRef(null);

  const [fileObject, setFileObject] = useState("");
  const [rowDto, setRowDto] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [, postData, loader] = useAxiosPost();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(30);

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      getDistributionChannelDDL(accId, buId, setDistributionChannelDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

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
              intAccountId: accId,
              intBusinessUnitId: buId,
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
              intActionBy: userId,
              dteExpireDate: itm[7] ? excelDateFormatter(itm[7]) : "",
            };
          });

          setRowDto(modify);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileObject]);

  const viewHandler = async (values, _pageNo = 0, _pageSize = 15) => {
    const typeId = values?.type?.value;
    if (typeId === 1) {
      getCustomerBankGuaranteeReport(
        accId,
        buId,
        values?.distributionChannel?.value,
        values?.date,
        setLoading,
        setRowDto
      );
    } else if (typeId === 4) {
      getSubmittedBankGuarantee({
        accId,
        buId,
        status: values?.status?.value,
        partnerId: values?.customer?.value || 0,
        monthId: values?.month?.value,
        yearId: values?.year?.value,
        pageNo: _pageNo,
        pageSize: _pageSize,
        setLoading,
        setter: setRowDto,
      });
    }
  };

  const saveHandler = (values, cb) => {
    const typeId = values?.type?.value;
    const date = new Date(values?.date);
    const selectedItems = rowDto?.filter((item) => item?.isSelected);
    if (typeId === 1 && selectedItems?.length < 1) {
      return toast.warn("Please select at least one row!");
    }

    // Payload for Bank Guarantee Excel Upload
    const payloadOne = rowDto?.map((element) => {
      return {
        ...element,
        numMortgageAmount:
          element?.numMortgageAmount || element?.existingMortgageAmount,
        strBankName: element?.strBankName || element?.preBankName,
        intBranchId: 0,
        strBranchName: "string",
      };
    });

    // Payload for Bank Guarantee Report
    const payloadTwo = selectedItems?.map((item) => {
      return {
        businessUnitId: buId,
        accountId: accId,
        businessPartnerId: item?.CustomerId,
        businessPartnerName: item?.CustomerName,
        monthId: date?.getMonth() + 1,
        yearId: date?.getFullYear(),
        bankGuaranteeAmount: item?.BG,
        actualCreditLimit: item?.ActualCL,
        bgNlimitPercentage: item?.BgVSL,
        approvedOd30percent: item?.ApprovedOD30,
        usedOd: item?.UsedOD,
        outOf30PercentOd: item?.Outof30OD,
        debit: item?.Debit,
        sales: item?.SalesBag,
        bgCommissionPerBag: item?.BGCommissionBag,
        totalBgCommission: item?.TotalCommission,
        remarks: "",
        actionBy: userId,
      };
    });

    const payload = typeId === 3 ? payloadOne : typeId === 1 ? payloadTwo : [];

    const URL =
      typeId === 3
        ? `/partner/BusinessPartnerSales/CreateBulkSalesMortgage`
        : typeId === 1
        ? `/partner/BusinessPartnerBankInfo/CreatePartnerBankGuaranteeInfo`
        : [];

    postData(URL, payload, () => cb(), true);
  };

  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `c74cc804-d70e-4d81-98d0-45eea55f6625`;

  const parameterValues = (values) => {
    return [
      { name: "Bunit", value: `${buId}` },
      { name: "ChannelID", value: `${values?.distributionChannel?.value}` },
      { name: "ViewType", value: `${2}` },
    ];
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    viewHandler(values, pageNo, pageSize);
  };

  const isLoading = loading || loader;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      {({ values, errors, touched, setFieldValue, resetForm }) => (
        <>
          {isLoading && <Loading />}
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
                    <b>{buName}</b>
                  </h4>
                </div>

                <>
                  <BankGuaranteeReportLandingForm
                    obj={{
                      buId,
                      accId,
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
                    {rowDto?.length > 0 && [1].includes(values?.type?.value) ? (
                      /* Bank Guarantee Report Table */
                      <TableOne obj={{ rowDto, setRowDto }} />
                    ) : [3].includes(values?.type?.value) ? (
                      // Bank Guarantee excel upload Table
                      <TableTwo obj={{ rowDto }} />
                    ) : null}

                    {/*  Submitted Bank Guarantee */}
                    {rowDto?.data?.length > 0 &&
                      [4].includes(values?.type?.value) && (
                        <TableThree
                          obj={{ rowDto, setRowDto, setPageNo, setPageSize }}
                        />
                      )}

                    {/* Only for Submitted Bank Guarantee */}
                    {rowDto?.data?.length > 0 &&
                      [4].includes(values?.type?.value) && (
                        <PaginationTable
                          count={rowDto?.totalCount}
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
