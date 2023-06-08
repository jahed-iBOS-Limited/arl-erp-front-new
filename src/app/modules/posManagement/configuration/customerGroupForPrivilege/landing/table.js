import React, { useState } from "react";
import IView from "./../../../../_helper/_helperIcons/_view";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import IViewModal from "./../../../../_helper/_viewModal";
import CustomerGroupForPrivilegeView from "../view";
import { getCustomerActiveInactive } from "./../helper";
import Loading from "./../../../../_helper/_loading";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import IActiveInActiveIcon from "./../../../../_helper/_helperIcons/_activeInActiveIcon";

function GridTable({ rowDto, values, commonGridFunc, pageSize, pageNo }) {
  const [isShowModal, setisShowModal] = useState(false);
  const [rowClickData, setRowClickData] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="table-responsive">
      {loading && <Loading />}
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th>SL</th>
            <th>Customer Group Name</th>
            <th>Created Date</th>
            <th>Created By</th>
            <th style={{ width: "125px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.data?.length >= 0 &&
            rowDto?.data?.map((item) => (
              <tr key={item?.sl}>
                <td>{item?.sl}</td>
                <td>{item?.customerGroupName}</td>
                <td className="text-center">
                  {_dateFormatter(item?.createdDate)}
                </td>
                <td>{item?.actionByName}</td>
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <span
                      onClick={() => {
                        setisShowModal(true);
                        setRowClickData(item);
                      }}
                    >
                      <IView />
                    </span>

                    <span
                      className="ml-2 pointer"
                      onClick={() => {
                        IConfirmModal({
                          title: `Are you sure "${
                            values?.status?.value ? "In-Active" : "Active"
                          }"?`,
                          yesAlertFunc: async () => {
                            await getCustomerActiveInactive(
                              item?.customerGroupId,
                              item?.actionById,
                              setLoading
                            );
                            commonGridFunc(pageNo, pageSize, values);
                          },
                          noAlertFunc: function() {
                            return "";
                          },
                        });
                      }}
                    >
                      <IActiveInActiveIcon
                        iconTyee={item?.isActive ? "inActive" : "Active"}
                      />
                    </span>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <IViewModal
        show={isShowModal}
        onHide={() => setisShowModal(false)}
        title={"Customer Group For Privilege View"}
      >
        <CustomerGroupForPrivilegeView rowClickData={rowClickData} />
      </IViewModal>
    </div>
  );
}
export default GridTable;
