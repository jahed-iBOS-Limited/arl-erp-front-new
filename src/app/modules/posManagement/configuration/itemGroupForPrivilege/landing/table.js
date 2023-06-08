import React, { useState } from "react";
import IView from "./../../../../_helper/_helperIcons/_view";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import IViewModal from "./../../../../_helper/_viewModal";
import ItemGroupForPrivilegeView from "./../view/index";
import IActiveInActiveIcon from './../../../../_helper/_helperIcons/_activeInActiveIcon';

function GridTable({ rowDto, values, acitveOnclickFunc }) {
  const [isShowModal, setisShowModal] = useState(false);
  const [rowClickData, setRowClickData] = useState("");
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th>SL</th>
            <th>Item Group</th>
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
                <td>{item?.itemGroupName}</td>
                <td>{_dateFormatter(item?.createUserDate)}</td>
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
                        acitveOnclickFunc({...values, ...item});
                      }}
                    >
                      <IActiveInActiveIcon
                        iconTyee=  {values?.status?.value ? "inActive" : "Active"}
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
        title={"Item Group For Privilege View"}
      >
        <ItemGroupForPrivilegeView rowClickData={rowClickData} />
      </IViewModal>
    </div>
  );
}
export default GridTable;
