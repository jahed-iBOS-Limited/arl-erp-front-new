import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IConfirmModal from "../../../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import Loading from "../../../../../_helper/_loading";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";

const CreateBaddebt = ({ tableData }) => {
  const [, saveJournal, saveJournalLoading] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const handleSaveJournal = async (data) => {
    const { dteFromDate, dteToDate, monSaleRevenueAmount, numBaddebtAmount } =
      data || {};

    const api = `/fino/Expense/CreateMonthlyBaddebtJournal?businessUnitId=${buId}&dteFromDate=${dteFromDate}&dteToDate=${dteToDate}&RevenueAmount=${monSaleRevenueAmount}&baddebitAmount=${numBaddebtAmount}&actionById=${userId}`;

    await saveJournal(api, (res) => {
      toast.success(res?.message);
    });
  };

  return (
    <>
      {saveJournalLoading && <Loading />}
      <div className="row">
        <div className="col-12">
          <div className="table-responsive">
            <table className="table table-striped table-bordered global-table mt-0 table-font-size-sm mt-5">
              <thead className="bg-secondary">
                <tr>
                  <th>SL</th>
                  <th>Revenue</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Revenue Amount</th>
                  <th>Baddebt Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-center">{item?.Revenue}</td>
                    <td className="text-center">
                      {_dateFormatter(item?.dteFromDate)}
                    </td>
                    <td className="text-center">
                      {_dateFormatter(item?.dteToDate)}
                    </td>
                    <td className="text-right">{item?.monSaleRevenueAmount}</td>
                    <td className="text-right">{item?.numBaddebtAmount}</td>
                    <td className="text-center my-2">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          IConfirmModal({
                            title: "Create Journal",
                            message: "Are you sure about creating the journal?",
                            yesAlertFunc: () => {
                              handleSaveJournal(item);
                            },
                            noAlertFunc: () => {},
                          });
                        }}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                ))}
                {/* <tr>
            <td
              colSpan={4}
              className="text-right font-weight-bold"
            >
              Total
            </td>
            <td className="text-right font-weight-bold">
              500
            </td>
          </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateBaddebt;
