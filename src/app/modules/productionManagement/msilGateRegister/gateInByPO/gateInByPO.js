import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import Loading from "../../../_helper/_loading";
import PaginationTable from "../../../_helper/_tablePagination";
import IViewModal from "../../../_helper/_viewModal";
import GateInListViewModal from "./GateInListViewModal";

function GateInByPO({ item, date }) {
  const [isShowModel, setIsShowModel] = useState(false);
  const [data, setData] = useState(null);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      `/mes/MSIL/GetAllGateInByPOLanding?PageNo=${pageNo}&PageSize=${pageSize}&Date=${_dateFormatter(
        item?.dtePurchaseOrderDate
      ) || date}&BusinessunitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      `/mes/MSIL/GetAllGateInByPOLanding?PageNo=${pageNo}&PageSize=${pageSize}&Date=${_dateFormatter(
        item?.dtePurchaseOrderDate
      ) || date}&BusinessunitId=${selectedBusinessUnit?.value}`
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <>
            {lodar && <Loading />}
            <div className="row">
              <div className="col-lg-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Date</th>
                        <th>PO Code</th>
                        <th>Supplier Name</th>
                        <th>Vehicle No</th>
                        <th>Driver Name</th>
                        <th>Driver Mobile No</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.gateInByPO?.length > 0 &&
                        rowData?.gateInByPO?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.dteDate)}
                            </td>
                            <td>{item?.strPocode}</td>
                            <td>{item?.strSupplierName}</td>
                            <td className="text-center">
                              {item?.strVehicleNo}
                            </td>
                            <td>{item?.strDriverName}</td>
                            <td>{item?.strDriverMobileNo}</td>
                            <td className="text-center">
                              <span
                                onClick={() => {
                                  setData(item);
                                  setIsShowModel(true);
                                }}
                              >
                                <IView />
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {rowData?.gateInByPO?.length > 0 && (
                  <PaginationTable
                    count={rowData?.totalCount}
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
              </div>
            </div>
          </>
        )}
      </Formik>
      <IViewModal
        show={isShowModel}
        onHide={() => {
          setIsShowModel(false);
        }}
      >
        <GateInListViewModal data={data} />
      </IViewModal>
    </>
  );
}

export default GateInByPO;
