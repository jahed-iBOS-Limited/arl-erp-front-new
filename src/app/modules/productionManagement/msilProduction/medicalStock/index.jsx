import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
  Card,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../_helper/_loading";
import PaginationTable from "../../../_helper/_tablePagination";

export default function MedicalStock() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, loading] = useAxiosGet({});
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getRowData(
      `/mes/MSIL/GetMedicalStockLanding?BuId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
  };

  useEffect(() => {
    getRowData(
      `/mes/MSIL/GetMedicalStockLanding?BuId=${selectedBusinessUnit?.value}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit]);

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
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Medicine Stock"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/production-management/msil-Production/medicinestock/add`,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}
                <div className="row">
                  <div className="col-md-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Uom</th>
                            <th>Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.data?.length > 0 &&
                            rowData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{item?.sl}</td>
                                <td className="text-center">
                                  {item?.strMedicineItemCode}
                                </td>
                                <td className="text-center">
                                  {item?.strMedicineItemName}
                                </td>
                                <td className="text-center">
                                  {item?.strUoMname}
                                </td>
                                <td className="text-center">
                                  {item?.numStockQty}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {rowData?.data?.length > 0 && (
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
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
