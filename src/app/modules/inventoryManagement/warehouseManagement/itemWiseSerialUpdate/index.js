import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IEdit from "../../../_helper/_helperIcons/_edit";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import PaginationTable from "../../../_helper/_tablePagination";

function ItemWiseSerialUpdate() {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar] = useAxiosGet();

  useEffect(() => {
    getRowData(
      `/wms/ItemWiseSerialUpdate/GetItemWiseSerialLanding?PageNo=${pageNo}&PageSize=${pageSize}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPositionHandler = (pageNo, pageSize, searchValue = "") => {
    getRowData(
      `/wms/ItemWiseSerialUpdate/GetItemWiseSerialLanding?PageNo=${pageNo}&PageSize=${pageSize}&Search=${searchValue}`
    );
  };
  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
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
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Item Wise Serial Update"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      history.push({
                        pathname: `/inventory-management/warehouse-management/Item-Wise-Serial-Update/create`,
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
                {lodar && <Loading />}
                <PaginationSearch
                  placeholder="PO or MRR Code Search"
                  paginationSearchHandler={paginationSearchHandler}
                />
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>PO Code</th>
                            <th>MRR Code</th>
                            <th>Supplier Name</th>
                            <th style={{ width: "80px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.header?.length > 0 &&
                            rowData?.header?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {item?.purchaseOrderCode}
                                </td>
                                <td className="text-center">{item?.mrrcode}</td>
                                <td>{item?.supplierName || ""}</td>
                                <td className="text-center">
                                  <div className="d-flex align-items-center justify-content-around">
                                    <IEdit
                                      onClick={() =>
                                        history.push({
                                          pathname: `/inventory-management/warehouse-management/Item-Wise-Serial-Update/edit/${item?.mrrid}`,
                                          state: { ...item },
                                        })
                                      }
                                    />
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {rowData?.header?.length > 0 && (
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

export default ItemWiseSerialUpdate;
