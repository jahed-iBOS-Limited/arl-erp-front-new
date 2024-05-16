/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _monthFirstDate } from "../../../../_helper/_monthFirstDate";
import { toast } from "react-toastify";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  shipPoint: "",
  transactionType: "",
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};
const headers = ["SL", "Date", "Item Name", "Warehouse", "Quantity", "Action"];

const TransferInfoLanding = () => {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, isLoading] = useAxiosGet();
  const [, postData, loading] = useAxiosPost();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const setLandingData = (_pageNo, _pageSize, values) => {
    const transferTypeId = values?.transferType?.value;

    const url =
      transferTypeId === 1
        ? `/wms/FertilizerOperation/GetG2GInventoryTransferPagination?AccountId=${accId}&BusinessUnitId=${buId}&TransactionType=${values?.transactionType?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PageNo=${_pageNo}&PageSize=${_pageSize}`
        : transferTypeId === 2
        ? `/tms/LigterLoadUnload/GetMotherVesselTransferInfoPagination?accountId=${accId}&businessUnitId=${buId}&transactionType=${values?.transactionType?.value}&pageNo=${_pageNo}&pageSize=${_pageSize}`
        : "";

    getGridData(url);
  };

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    setLandingData(pageNo, pageSize, values);
  };

  const transferIn = (item, values) => {
    const payload = [
      {
        inventoryTransactionId: item?.inventoryTransactionId,
        vesselTransferId: item?.vesselTransferId,
        fromMotherVesselId: item?.fromMotherVesselId,
        fromMotherVesselName: item?.fromMotherVesselName,
        toMotherVesselId: item?.toMotherVesselId,
        toMotherVesselName: item?.toMotherVesselName,
        itemId: item?.itemId,
        transferQuantity: item?.transferQuantity,
        transactionTypeId: 5,
        transactionTypeName: "Transfer In",
        actionBy: userId,
        accountId: accId,
        businessUnitId: buId,
        reasons: item?.reasons,
        fromMvprogramId: item?.fromMvprogramId,
        toMvprogramId: item?.toMvprogramId,
        businessPartnerId: item?.businessPartnerId,
      },
    ];

    postData(
      `/tms/LigterLoadUnload/CreateMotherVesselTransfer`,
      payload,
      () => {
        setLandingData(pageNo, pageSize, values);
      },
      true
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICustomCard
              title="Transfer Info"
              createHandler={() => {
                if (!values?.transferType) {
                  toast.warn("Please select a transfer type");
                } else {
                  history.push({
                    pathname: `/vessel-management/allotment/transferInfo/create`,
                    state: values,
                  });
                }
              }}
            >
              {(isLoading || loading) && <Loading />}
              <form className="form form-label-right">
                <div className="global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="transferType"
                      options={[
                        { value: 1, label: "Warehouse to Warehouse transfer" },
                        {
                          value: 2,
                          label: "Mother vessel to Mother vessel transfer",
                        },
                      ]}
                      value={values?.transferType}
                      label="Transfer Type"
                      onChange={(valueOption) => {
                        setFieldValue("transferType", valueOption);
                      }}
                      placeholder="Transfer Type"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="transactionType"
                      options={[
                        { value: 5, label: "Transfer In" },
                        { value: 19, label: "Transfer Out" },
                      ]}
                      value={values?.transactionType}
                      label="Transaction Type"
                      onChange={(valueOption) => {
                        setFieldValue("transactionType", valueOption);
                      }}
                      placeholder="Transaction Type"
                    />
                  </div>
                  {values?.transferType?.value === 1 && (
                    <FromDateToDateForm obj={{ values, setFieldValue }} />
                  )}
                  <IButton
                    onClick={() => {
                      setLandingData(pageNo, pageSize, values);
                    }}
                    disabled={
                      !values?.transactionType ||
                      !values?.fromDate ||
                      !values?.toDate
                    }
                  />
                </div>
                {values?.transferType?.value === 1 &&
                  gridData?.data?.length > 0 && (
                    <div className="table-responsive">
                      <table
                        id="table-to-xlsx"
                        className={
                          "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                        }
                      >
                        <thead>
                          <tr className="cursor-pointer">
                            {headers?.map((th, index) => {
                              return <th key={index}> {th} </th>;
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {gridData?.data?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td> {item?.sl}</td>
                                <td>{_dateFormatter(item?.transactionDate)}</td>
                                <td>{item?.itemName}</td>
                                <td>{item?.warehouseName}</td>
                                <td className="text-right">
                                  {_fixedPoint(item?.transactionQuantity, true)}
                                </td>
                                <td>
                                  <div className="d-flex justify-content-around">
                                    <span className="text-center">
                                      <IView clickHandler={() => {}} />
                                    </span>
                                    <span className="edit" onClick={() => {}}>
                                      <IEdit title={"Rate Entry"} />
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                {values?.transferType?.value === 2 && (
                  <MotherVesselTransferTable
                    obj={{ gridData, transferIn, values }}
                  />
                )}

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
              </form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default TransferInfoLanding;

function MotherVesselTransferTable({ obj }) {
  const { gridData, transferIn, values } = obj;

  const tHeads = [
    "SL",
    "Business Partner",
    "From Mother Vessel",
    "To Mother Vessel",
    "Item",
    "Reason",
    "Quantity",
  ];

  return (
    <>
      <div className="table-responsive">
        <table
          id="table-to-xlsx"
          className={
            "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
          }
        >
          <thead>
            <tr className="cursor-pointer">
              {tHeads?.map((th, index) => {
                return <th key={index}> {th} </th>;
              })}
              {values?.transactionType?.value === 19 && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {gridData?.data?.map((item, index) => {
              return (
                <tr key={index}>
                  <td> {index + 1}</td>

                  <td>{item?.businessPartnerName}</td>
                  <td>{item?.fromMotherVesselName}</td>
                  <td>{item?.toMotherVesselName}</td>
                  <td>{item?.itemName}</td>
                  <td>{item?.reasons}</td>

                  <td className="text-right">
                    {_fixedPoint(item?.transferQuantity, true)}
                  </td>
                  {values?.transactionType?.value === 19 && (
                    <td>
                      <div className="d-flex justify-content-around">
                        <span className="edit">
                          <IApproval
                            title={"Transfer In"}
                            onClick={() => {
                              transferIn(item, values);
                            }}
                          />
                        </span>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
