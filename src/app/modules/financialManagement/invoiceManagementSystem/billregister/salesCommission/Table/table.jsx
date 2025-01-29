import { Formik } from "formik";
import React, { useState } from "react";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import IView from "../../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../../_helper/_viewModal";
import { GetSalesCommissionById } from "../helper";
import ViewModal from "../view/viewModal";

const GridView = ({ gridData, setGridData }) => {
  const initData = {
    allSelect: false,
  };

  const [show, setShow] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  const allSelect = (check) => {
    const newData = gridData?.map((item, index) => {
      return {
        ...item,
        isSelect: check,
      };
    });
    setGridData(newData);
  };

  const modifyRowData = (fieldName, index, value) => {
    let rowData = [...gridData];
    let _sl = rowData[index];
    _sl[fieldName] = value;
    setGridData(rowData);
  };

  const allCheck = (values) => {
    const singleCheck = gridData?.filter((item) => item?.isSelect === false);
    const result =
      singleCheck?.length > 0
        ? false
        : singleCheck?.length === 0
        ? true
        : values?.allSelect?.checked;
    return result;
  };

  return (
    <Formik enableReinitialize={true} initialValues={initData}>
      {({ values }) => (
        <>
          <div className="table-responsive">
            {gridData?.length ? (
                <div className="table-responsive">
              <table className="table table-striped table-bordered bj-table bj-table-landing table-font-size-sm">
                <thead>
                  <tr>
                    <th
                      onClick={() => {
                        allSelect(!allCheck(values));
                      }}
                      className="text-center"
                      style={{ width: "40px" }}
                    >
                      <input
                        type="checkbox"
                        name="allSelect"
                        id="allSelect"
                        checked={allCheck(values)}
                      />
                    </th>
                    <th>SL</th>
                    <th>Ship Point</th>
                    <th>Challan Code</th>
                    <th>Delivery Date</th>
                    <th>Partner Name</th>
                    <th>Account Of Name</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Commission (per qty)</th>
                    <th>Commission Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {gridData?.map((item, index) => (
                    <tr key={index}>
                      <td
                        onClick={() => {
                          modifyRowData("isSelect", index, !item?.isSelect);
                          allCheck(values);
                        }}
                        className="text-center"
                      >
                        <input
                          id="isSelect"
                          type="checkbox"
                          value={item?.isSelect}
                          checked={item?.isSelect}
                        />
                      </td>
                      <td className="text-center">{index + 1}</td>
                      <td>{item?.shipPointName}</td>
                      <td>{item?.challanCode}</td>
                      <td className="text-center">
                        {_dateFormatter(item?.deliveryDate)}
                      </td>
                      <td>{item?.customerName}</td>
                      <td>{item?.accOfPartnerName}</td>
                      <td className="text-right">{item?.quantity}</td>
                      <td className="text-right">{item?.rate}</td>
                      <td className="text-right">{item?.commission}</td>
                      <td className="text-right">{item?.amount}</td>
                      <td
                        className="text-center view"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          GetSalesCommissionById(
                            item?.secondaryDeliveryId,
                            setRowDto
                          );
                          setShow(true);
                        }}
                      >
                        <IView></IView>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            ) : null}
          </div>
          <IViewModal show={show} onHide={() => setShow(false)}>
            <ViewModal initData={rowDto}></ViewModal>
          </IViewModal>
        </>
      )}
    </Formik>
  );
};

export default GridView;
