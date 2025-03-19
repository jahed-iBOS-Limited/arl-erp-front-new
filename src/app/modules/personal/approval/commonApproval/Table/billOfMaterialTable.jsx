import React, { useState } from "react";
import Loading from "./../../../../_helper/_loading";
import IView from "./../../../../_helper/_helperIcons/_view";
import CostView from "./_costView";
import IViewModal from "../../../../_helper/_viewModal";
import BillofMaretialViewApproval from "./View/addForm";
import CostViewTable from "./CostView/CostView";
import PaginationTable from './../../../../_helper/_tablePagination';

function BillOfMaterialTable({ obj }) {
  const [isShowModal, setisShowModal] = useState(false);
  const [isShowModalForCostView, setisShowModalForCostView] = useState(false);
  const [id, setId] = useState("");
  const [item, setItem] = useState("");
  const { loading, tableData, setTableData, setBillSubmitBtn, setPositionHandler, setPageSize, pageSize, setPageNo,  pageNo } = obj;
  // All item select
  const allTableDataCheck = (value) => {
    if (tableData?.data?.length > 0) {
      const modifyTableData = tableData?.data?.map((itm) => ({
        ...itm,
        isSelected: value,
      }));
      setTableData({
        ...tableData,
        data: modifyTableData,
      });
      // btn hide conditon
      const bllSubmitBtn = modifyTableData?.some(
        (itm) => itm.isSelected === true
      );
      if (bllSubmitBtn) {
        setBillSubmitBtn(false);
      } else {
        setBillSubmitBtn(true);
      }
    }
  };

  // one item select
  const itemSelectedHandler = (value, index) => {
    if (tableData?.data?.length > 0) {
      let newTableData = tableData?.data;
      newTableData[index].isSelected = value;
      setTableData({
        ...tableData,
        data: newTableData,
      });
      // btn hide conditon
      const bllSubmitBtn = newTableData?.some((itm) => itm.isSelected === true);
      if (bllSubmitBtn) {
        setBillSubmitBtn(false);
      } else {
        setBillSubmitBtn(true);
      }
    }
  };

  return (
    <>
     <div className="table-responsive">
     <table className="table table-striped table-bordered global-table">
        {loading && <Loading />}
        <thead>
          <th style={{ width: "20px" }}>
            <input
              type="checkbox"
              id="parent"
              onChange={(event) => {
                allTableDataCheck(event.target.checked);
              }}
            />
          </th>
          <th>SL</th>
          <th>BOM Name</th>
          <th>BOM Version Name</th>
          <th>UoM Name</th>
          <th>Lot Size</th>
          <th className="text-right pr-3">Actions</th>
        </thead>
        <tbody>
          {tableData?.data?.map((item, index) => (
            <tr key={index}>
              <td>
                <input
                  id="isSelected"
                  name="isSelected"
                  type="checkbox"
                  value={item?.isSelected}
                  checked={item?.isSelected}
                  onChange={(e) => {
                    itemSelectedHandler(e.target.checked, index);
                  }}
                />
              </td>
              <td>{index + 1}</td>
              <td>{item?.billOfMaterialName}</td>
              <td>{item?.boMItemVersionName}</td>
              <td>{item?.uoMName}</td>
              <td className="text-center">{item?.lotSize}</td>
              <td>
                <div className="d-flex justify-content-center">
                  <span className="view mr-3">
                    <IView
                      title={"BOM View"}
                      clickHandler={() => {
                        setisShowModal(true);
                        setId(item?.billOfMaterialId);
                        // history.push(
                        //   `/production-management/mes/bill-of-material/view/${item?.billOfMaterialId}`
                        // );
                      }}
                    />
                  </span>
                  <span className="view">
                    <CostView
                      title={"Cost View"}
                      clickHandler={() => {
                        setisShowModalForCostView(true);
                        setItem(item);
                      }}
                    />
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
     </div>
      {tableData?.data?.length > 0 && (
        <PaginationTable
          count={tableData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}


      {/* modal 1 */}
      <IViewModal show={isShowModal} onHide={() => setisShowModal(false)}>
        <BillofMaretialViewApproval id={id} />
      </IViewModal>

      {/* modal 2 */}
      <IViewModal
        show={isShowModalForCostView}
        onHide={() => setisShowModalForCostView(false)}
      >
        <CostViewTable item={item} />
      </IViewModal>
    </>
  );
}

export default BillOfMaterialTable;
