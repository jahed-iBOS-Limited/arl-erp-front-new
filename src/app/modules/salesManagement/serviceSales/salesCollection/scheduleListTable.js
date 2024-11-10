import React, { useEffect } from "react";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../_helper/_todayDate";
import Loading from "../../../_helper/_loading";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";

export default function ScheduleListTable({ item, setShowModal }) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [
    scheduleList,
    getScheduleList,
    loader,
    setScheduleList,
  ] = useAxiosGet();
  const [, saveHandler] = useAxiosPost();
  useEffect(() => {
    getScheduleList(
      `/oms/ServiceSales/GetServiceScheduleList?accountId=${
        profileData?.accountId
      }&businessUnitId=${selectedBusinessUnit?.value}&ServiceSalesOrderId=${
        item?.header?.intServiceSalesOrderId
      }&dteTodate=${_todayDate()}`,
      (data) => {
        const result = data?.map((item) => ({ ...item, isChecked: false }));
        setScheduleList(result);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, item]);
  return (
    <div>
      {loader && <Loading />}
      <div className="">
        <div className="mt-2 mb-2 text-right">
          <button
            type="button"
            disabled={!scheduleList?.length}
            onClick={() => {
              const data = scheduleList?.filter(
                (schedule) => schedule?.isChecked
              );

              if (!data.length) {
                return toast.warn("Please Select at least one Schedule");
              }

              saveHandler(
                `/oms/ServiceSales/CreateServiceSalesInvocie`,
                {
                  header: {
                    //   intServiceSalesInvoiceId: 0,
                    //   strServiceSalesInvoiceCode: "",
                    intServiceSalesOrderId:
                      item?.header?.intServiceSalesOrderId,
                    dteInvoiceDateTime: _todayDate(),
                    intAccountId: profileData?.accountId,
                    intBusinessUnitId: selectedBusinessUnit?.value,
                    intSalesTypeId: item?.header?.intSalesTypeId,
                    strSalesTypeName: item?.header?.strSalesTypeName,
                    intCustomerId: item?.header?.intCustomerId,
                    strCustomerName: item?.header?.strCustomerName,
                    strCustomerAddress: item?.header?.strCustomerAddress,
                    strCustomerAddress2: "",
                    intScheduleTypeId: item?.header?.intScheduleTypeId,
                    strScheduleTypeName: item?.header?.strScheduleTypeName,
                    intActionBy: profileData?.userId,
                  },
                  row: data.map((item) => ({
                    //   intServiceSalesInvoiceRowId: 0,
                    //   intServiceSalesInvoiceId: 0,
                    intServiceSalesScheduleId: item?.intServiceSalesScheduleId,
                    dteScheduleCreateDateTime: item?.dteScheduleCreateDateTime,
                    dteDueDateTime: item?.dteDueDateTime,
                    numScheduleAmount: item?.numScheduleAmount,
                    //   numCollectionAmount: 0,
                    //   numPendingAmount: 0,
                    //   numAdjustPreviousAmount: 0,
                    isActive: true,
                  })),
                },
                () => {
                  setShowModal(false);
                },
                true
              );
            }}
            className="btn btn-primary"
          >
            Save
          </button>
        </div>
        <div>
          <div className="table-responsive">
            <table className="table table-striped table-bordered bj-table bj-table-landing">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        scheduleList?.length > 0 &&
                        scheduleList?.every((item) => item?.isChecked)
                      }
                      onChange={(e) => {
                        setScheduleList(
                          scheduleList?.map((item) => {
                            return {
                              ...item,
                              isChecked: e?.target?.checked,
                            };
                          })
                        );
                      }}
                    />
                  </th>
                  <th>Customer</th>
                  <th>Schedule Type</th>
                  <th>Item Name</th>
                  <th>Due Date</th>
                  <th>Payment Percent</th>
                  <th>Schedule Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {scheduleList?.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        value={item?.isChecked}
                        checked={item?.isChecked}
                        onChange={(e) => {
                          const data = [...scheduleList];
                          data[index]["isChecked"] = e.target.checked;
                          setScheduleList(data);
                        }}
                      />
                    </td>
                    <td>{item?.strCustomerName}</td>
                    <td>{item?.strScheduleTypeName}</td>
                    <td>{item?.strItemName}</td>
                    <td>{_dateFormatter(item?.dteDueDateTime)}</td>
                    <td>{item?.intPaymentByPercent}</td>
                    <td>{item?.numScheduleAmount}</td>
                    <td>{item?.isInvoiceComplete}</td>
                    <td>{item?.isInvoiceComplete}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
