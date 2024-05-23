import { Form, Formik } from "formik";
import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IEdit from "../../../_helper/_helperIcons/_edit";
import PaginationSearch from "../../../_helper/_search";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
const initData = {};
export default function LogisticEquipment() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loading, setGridData] = useAxiosGet();

  const saveHandler = (values, cb) => {};
  const history = useHistory();

  const getLandingData = (values, pageNo, pageSize, searchValue = "") => {
    const searchTearm = searchValue ? `&search=${searchValue}` : "";
    getGridData(
      `/procurement/PurchaseOrder/GetAllItemsListForRateConfigure?businessUnitId=${
        selectedBusinessUnit?.value
      }&plantId=${values?.plant?.value || 0}&warehouseId=${values?.warehouse
        ?.value || 0}&itemTypeId=${values?.itemType?.value ||
        0}&itemCategoryId=${values?.itemCategory?.value ||
        0}&itemSubCategoryId=${values?.itemSubCategory?.value ||
        0}&pageNo=${pageNo}&pageSize=${pageSize}${searchTearm}`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getLandingData(values, pageNo, pageSize, searchValue);
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loading && <Loading />}
          <IForm
            title="Logistic Equipment Availability"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push("/inventory-management/warehouse-management/logisticequipmentavailability/entry");
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    {/* <button
                      onClick={() => {
                        getLandingData(values, pageNo, pageSize, "");
                      }}
                      type="button"
                      className="btn btn-primary mt-5"
                    >
                      View
                    </button> */}
                  </div>
                </div>
                {gridData?.itemList?.length > 0 && (
                  <div className="my-3">
                    <PaginationSearch
                      placeholder="Search Enroll & Name"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                )}
                {gridData?.itemList?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Uom</th>
                          <th>Effective Date</th>
                          <th>Rate (Dhaka)</th>
                          <th>Rate (Chittagong)</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.itemList?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.itemCode}</td>
                            <td>{item?.itemName}</td>
                            <td className="text-center">{item?.uomName}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.effectiveDate)}
                            </td>
                            <td className="text-center">{item?.itemRate}</td>
                            <td className="text-center">
                              {item?.itemOthersRate}
                            </td>
                            <td className="text-center">
                              <div className="">
                                <span className="" onClick={() => {}}>
                                  <IEdit />
                                </span>
                                <span className="px-5" onClick={() => {}}>
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip id="cs-icon">History</Tooltip>
                                    }
                                  >
                                    <i
                                      style={{ fontSize: "16px" }}
                                      class="fa fa-history cursor-pointer"
                                      aria-hidden="true"
                                    ></i>
                                  </OverlayTrigger>
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {gridData?.itemList?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
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
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
