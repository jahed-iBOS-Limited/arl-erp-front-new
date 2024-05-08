/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import ICustomCard from "../../../../_helper/_customCard";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getSBUDDL } from "../../../../transportManagement/report/productWiseShipmentReport/helper";
import {
  editSalesReturn,
  salesReturnApprove_api,
  salesReturnCancel,
} from "../helper";
import EditAndApprove from "./editAndApprove";
import DamageEntryLandingForm from "./form";
import DamageEntryLandingTable from "./table";

const initData = {
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  status: { value: 0, label: "All" },
  viewAs: { value: 1, label: "Supervisor" },
  narration: "",
  returnType: "",
  sbu: "",
};

const RecevingChallanAttachmentEntryLanding = () => {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const history = useHistory();
  const [, landingActions, loader] = useAxiosGet();
  const [sbuDDL, setSbuDDL] = useState([]);
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);

  // get user data from store
  const {
    profileData: { accountId: accId, userId, employeeId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getSBUDDL(accId, buId, setSbuDDL);
  }, [accId, buId]);

  const salesReturnLandingActions = (values, _pageNo = 0, _pageSize = 15) => {
    const url = `/oms/SalesReturnAndCancelProcess/GetDamageReturnPagination?Type=${
      values?.viewAs?.value
    }&accId=${accId}&status=${
      values?.status?.value
    }&BusuinessUnitId=${buId}&FromDate=${values?.fromDate}&ToDate=${
      values?.toDate
    }&pageNo=${_pageNo}&pageSize=${_pageSize}&SalesReturnType=${2}&viewOrder=desc&CustomerId=${values
      ?.customer?.value || 0}&ChannelId=${values?.channel?.value || 0}`;

    landingActions(url, (resData) => {
      setGridData({
        ...resData?.data,
        data: resData?.data?.data?.map((item) => ({
          ...item,
          tempQty: item?.quantity,
        })),
      });
    });
  };

  const getRows = (item) => {
    landingActions(
      `/oms/SalesReturnAndCancelProcess/GetSalesReturnDetails?SalesReturnId=${item?.salesReturnId}&AccountId=${accId}&BusinessUnitId=${buId}`,
      (resData) => {
        setRows(resData);
        setOpen(true);
      }
    );
  };

  const dataChangeHandler = (index, key, value) => {
    let _data = [...gridData?.data];
    _data[index][key] = value;
    setGridData({ ...gridData, data: _data });
  };

  const cancelHandler = (item, values) => {
    const payload = {
      head: {
        intSalesReturnId: item?.salesReturnId,
        intActionBy: userId,
      },
      row: [
        {
          intRowId: item?.rowId,
          intSalesReturnId: item?.salesReturnId,
        },
      ],
    };
    salesReturnCancel(payload, setLoading, () => {
      salesReturnLandingActions(values, pageNo, pageSize);
      // viewHandler(values);
    });
  };

  const salesReturnApprove = (values, item) => {
    let url = "";
    let payload = {};
    if ([2].includes(values?.viewAs?.value)) {
      if (!values?.narration) {
        return toast.warning("Narration is required");
      }
      url = `/oms/SalesInformation/SalesChallanReturnApprove?Challan=${item?.deliveryChallan}&unitid=${buId}&intpartid=3&strNarration=${values?.narration}&intInactiveBy=${userId}&intCustomerid=${item?.businessPartnerId}`;
    }

    salesReturnApprove_api(
      url,
      payload,
      () => {
        salesReturnLandingActions(values, pageNo, pageSize);
      },
      setLoading
    );
  };

  const setPaginationHandler = (pageNo, pageSize, values) => {
    salesReturnLandingActions(values, pageNo, pageSize);
  };

  const allSelect = (value) => {
    let _data = [...gridData?.data];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: item?.isApprovedBySupervisor ? false : value,
      };
    });
    setGridData({ ...gridData, data: modify });
  };

  const selectedAll = () => {
    return gridData?.data?.filter((item) => item.isSelected)?.length ===
      gridData?.data?.length && gridData?.data?.length > 0
      ? true
      : false;
  };

  const editHandler = (values) => {
    const selectedItems = gridData?.data?.filter((item) => item?.isSelected);
    if (selectedItems?.length < 1) {
      return toast.warn("Please select at least one row!");
    }
    // const payload = {
    //   head: {
    //     intSalesReturnId: selectedItems[0]?.salesReturnId,
    //   },
    //   row: selectedItems?.map((item) => {
    //     return {
    //       intRowId: item?.rowId,
    //       numReturnQty: +item?.totalReturnQty,
    //     };
    //   }),
    // };
    const payloadForEdit = selectedItems?.map((item) => {
      return {
        head: {
          intSalesReturnId: item?.salesReturnId,
        },
        row: [
          {
            intRowId: item?.rowId,
            intSalesReturnId: item?.salesReturnId,
            numBasePrice: item?.basePrice,
            numReturnQty: item?.totalReturnQty,
            numReturnAmount: item?.totalReturnAmount,
          },
        ],
      };
    });
    const cb = () => {
      // const payloadForApprove = {
      //   header: {
      //     salesReturnId: selectedItems[0]?.salesReturnId,
      //     intApproveBySupervisor: employeeId,
      //   },
      //   row: selectedItems?.map((element) => ({
      //     rowId: element?.rowId,
      //     supervisorAprvQnt: element?.totalReturnQty,
      //   })),
      // };

      const payloadForApprove = selectedItems?.map((item) => {
        return {
          header: {
            salesReturnId: item?.salesReturnId,
            intApproveBySupervisor: employeeId,
          },
          row: [
            {
              rowId: item?.rowId,
              salesReturnId: item?.salesReturnId,
              supervisorAprvQnt: item?.totalReturnQty,
            },
          ],
        };
      });
      salesReturnApprove_api(
        `/oms/SalesReturnAndCancelProcess/SalesReturnApprovalBySupervisor`,
        payloadForApprove,
        () => {
          salesReturnLandingActions(values);
          //  setOpen(false);
        },
        setLoading
      );
    };
    editSalesReturn(payloadForEdit, cb, setLoading);
  };

  return (
    <>
      {(loading || loader) && <Loading />}
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <>
            <ICustomCard
              title="Receving Challan Attachment"
              createHandler={() => {
                history.push(
                  `/sales-management/ordermanagement/recevingchallanattachment/entry`
                );
              }}
            >
              <DamageEntryLandingForm
                obj={{
                  buId,
                  accId,
                  values,
                  pageNo,
                  sbuDDL,
                  pageSize,
                  gridData,
                  editHandler,
                  setGridData,
                  setFieldValue,
                  salesReturnLandingActions,
                }}
              />
              <DamageEntryLandingTable
                obj={{
                  values,
                  getRows,
                  gridData,
                  allSelect,
                  selectedAll,
                  setGridData,
                  cancelHandler,
                  dataChangeHandler,
                  salesReturnApprove,
                }}
              />
              <IViewModal
                show={open}
                onHide={() => {
                  setOpen(false);
                }}
              >
                <EditAndApprove
                  rows={rows}
                  setRows={setRows}
                  setOpen={setOpen}
                  getLanding={salesReturnLandingActions}
                  preValues={values}
                />
              </IViewModal>
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPaginationHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default RecevingChallanAttachmentEntryLanding;
