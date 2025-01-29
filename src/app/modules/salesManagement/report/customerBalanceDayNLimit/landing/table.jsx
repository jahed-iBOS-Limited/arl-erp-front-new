import { Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../_helper/_card";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getUserLoginInfo } from "../helper";
import Form from "./from";
import { dayThs, getReportId, groupId, parameterValues } from "./helper";

const initData = {
  date: _todayDate(),
  fromDate: _todayDate(),
  toDate: _todayDate(),
  channel: "",
  region: "",
  area: "",
  territory: "",
  partyStatus: "",
  partyGroup: "",
  reportType: { value: 1, label: "Days And Amount Base Balance" },
  viewType: "",
  businessUnit: { value: 0, label: "All" },
  itemPrice:"",
  businessPeriod:""
};

export default function CustomerBalanceDaysNLimit() {
  const printRef = useRef();

  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [channelId, setChannelId] = useState(0);
  const [data, setData] = useState([]);
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [buDDL, getBuDDL] = useAxiosGet();
  const [isShow, setIsShow] = useState(false);

  // get user data from store
  const {
    profileData: { accountId: accId, employeeId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getUserLoginInfo(accId, buId, employeeId, setLoading, (resData) => {
      setData(resData);
    });
    getBuDDL(`/hcm/HCMDDL/GetBusinessunitDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  useEffect(() => {
    if (rowData?.length > 0) {
      setRowDto(rowData);
    }
  }, [rowData]);

  const viewHandler = async (values) => {
    setRowDto([]);
    const channelId = values?.channel?.value;

    const customerId = values?.customer?.value || 0;
    const empId = employeeId;
    const RATId =
      data?.empLevelId === 7
        ? +data?.empTerritoryId
        : +data?.levelId === 6
        ? +data?.areaId
        : +data?.levelId === 5
        ? +data?.regionId
        : +data?.empTerritoryId;
    const intLevelId = data?.empLevelId;
    const url = `/oms/SalesInformation/PartnerBalnceByDaysNLimitAmount?intunit=${buId}&TransactionDate=${values?.date}&customerId=${customerId}&intchannelid=${channelId}&intEmployeeid=${empId}&RATId=${RATId}&intLevelId=${intLevelId}`;
    getRowData(url);
  };

  const getRowStyle = (value) => {
    return value < 0
      ? {
          color: "Green",
          fontWeight: 900,
        }
      : value > 0
      ? {
          color: "Red",
          fontWeight: 900,
        }
      : { fontWeight: 900 };
  };

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="CUSTOMER BALANCE DAYS & LIMIT"
          isExcelBtn={true}
          componentRef={printRef}
          pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
        >
          <div ref={printRef}>
            <div className="mx-auto">
              <Formik
                enableReinitialize={true}
                initialValues={initData}
                onSubmit={() => {}}
              >
                {({ values, setFieldValue }) => (
                  <>
                    <Form
                      obj={{
                        buId,
                        accId,
                        buDDL,
                        values,
                        setRowDto,
                        setIsShow,
                        channelId,
                        viewHandler,
                        setChannelId,
                        setFieldValue,
                      }}
                    />

                    {(isLoading || loading) && <Loading />}
                    {values?.reportType?.value === 1 && (
                      <div>
                        <ICustomTable
                          ths={dayThs}
                          id="table-to-xlsx"
                          className="creditLimitReport"
                        >
                          {rowDto?.map((data, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td>{data?.strPartnerCode}</td>
                                <td>{data?.strPartnerName}</td>
                                <td className="text-right">
                                  {data?.numLedgerBalance}
                                </td>
                                <td className="text-right">
                                  {data?.INTLIMITDAYS}
                                </td>
                                <td className="text-right">
                                  {data?.numPermanentCreditLimit}
                                </td>
                                <td className="text-right">
                                  {data?.numShortTimeCreditLimit}
                                </td>
                                <td className="text-right">
                                  {data?.numTotalCreditLimit}
                                </td>
                                <td className="text-right">
                                  {data?.totalSalesAmount}
                                </td>
                                <td className="text-right">
                                  {(data?.totalDepositAmount || 0).toFixed(0)}
                                </td>
                                <td
                                  className="text-right"
                                  style={getRowStyle(data?.AmountBaseBalance)}
                                >
                                  {data?.AmountBaseBalance < 0
                                    ? `(${(
                                        data?.AmountBaseBalance || 0
                                      ).toFixed(0)})`
                                    : (data?.AmountBaseBalance || 0).toFixed(0)}
                                </td>
                                <td
                                  className="text-right"
                                  style={getRowStyle(data?.DayBaseBalance)}
                                >
                                  {data?.DayBaseBalance < 0
                                    ? `(${(data?.DayBaseBalance || 0).toFixed(
                                        0
                                      )})`
                                    : (data?.DayBaseBalance || 0).toFixed(0)}
                                </td>
                                <td>{data?.strRegion}</td>
                                <td>{data?.strArea}</td>
                                <td>{data?.strTerritory}</td>
                                <td>
                                  {_dateFormatter(data?.LastDeliveryDate)}
                                </td>
                                <td>
                                  {_dateFormatter(data?.LastCollectiondate)}
                                </td>
                                <td>{data?.DeliveryDateDiffrance}</td>
                                <td>{data?.CollectionDateDiffrance}</td>
                              </tr>
                            );
                          })}
                        </ICustomTable>
                      </div>
                    )}

                    {isShow &&
                      [2, 3, 4, 5, 6, 7,8,9].includes(
                        values?.reportType?.value
                      ) && (
                        <PowerBIReport
                          reportId={getReportId(values)}
                          groupId={groupId}
                          parameterValues={parameterValues(
                            values,
                            buId,
                            employeeId
                          )}
                          parameterPanel={false}
                        />
                      )}
                  </>
                )}
              </Formik>
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
