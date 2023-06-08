/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import {
  getRouteDDL,
  getBeatDDL,
  getMonthDDL,
  getCategoryDDL,
  getSubCategoryDDL,
  getItemDDL,
  getLandingData,
  editBillProcess,
} from "../helper";
import Loading from "./../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../_helper/_select";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { toast } from "react-toastify";
import { _formatMoney } from "./../../../../_helper/_formatMoney";

const initData = {
  route: "",
  beat: "",
  month: "",
  category: "",
  subCategory: "",
  item: "",
};

const OutletBillProcessLanding = () => {
  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);
  const [allSelect, setAllSelect] = useState(false);

  // All DDL
  const [routeDDL, setRouteDDL] = useState([]);
  const [beatDDL, setBeatDDL] = useState([]);
  const [monthDDL, setMonthDDL] = useState([]);
  const [categoryDDL, setCategoryDDL] = useState([]);
  const [subCategoryDDL, setSubCategoryDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  // Get Landing Data
  useEffect(() => {
    getRouteDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRouteDDL
    );
    getMonthDDL(setMonthDDL);
    getRouteDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setRouteDDL
    );
    getCategoryDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setCategoryDDL
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.item?.value,
      values?.month?.value,
      pageNo,
      pageSize,
      setIsLoading,
      setGridData
    );
  };

  // All Select Change
  useEffect(() => {
    if (allSelect) {
      let data = gridData?.data?.map((item) => {
        return {
          ...item,
          isSelect: true,
        };
      });
      setGridData({
        currentPage: gridData?.currentPage,
        data: data,
        pageSize: gridData?.pageSize,
        totalCount: gridData?.totalCount,
      });
    } else {
      let data = gridData?.data?.map((item) => {
        return {
          ...item,
          isSelect: false,
        };
      });
      setGridData({
        currentPage: gridData?.currentPage,
        data: data,
        pageSize: gridData?.pageSize,
        totalCount: gridData?.totalCount,
      });
    }
  }, [allSelect]);

  // Select Individual Item
  const selectIndividualItem = (index) => {
    let newRowdata = [...gridData?.data];
    newRowdata[index].isSelect = !newRowdata[index].isSelect;
    setGridData({
      currentPage: gridData?.currentPage,
      data: newRowdata,
      pageSize: gridData?.pageSize,
      totalCount: gridData?.totalCount,
    });
  };

  const processHandler = (values) => {
    let filterData = gridData?.data?.filter(
      (item) => item?.isSelect && !item?.isBillProcess
    );

    if (filterData?.length > 0) {
      const payload = filterData?.map((item) => {
        return {
          outletBillId: item?.outletBillId,
          isBillProcess: true,
        };
      });
      console.log("Payload => ", payload);
      editBillProcess(payload);
    } else {
      toast.warning("Please select atleast one item");
    }
    setAllSelect(false);
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={{ ...initData }}>
        {({
          errors,
          touched,
          setFieldValue,
          isValid,
          values,
          handleSubmit,
        }) => (
          <Card>
            <CardHeader title="Outlet Bill Process">
              <CardHeaderToolbar>
                {gridData?.data?.length > 0 && (
                  <button
                    onClick={() => processHandler(values)}
                    className="btn btn-primary"
                  >
                    Process
                  </button>
                )}
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              {console.log("Values => ", values)}
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="route"
                      options={routeDDL}
                      value={values?.route}
                      label="Route"
                      onChange={(valueOption) => {
                        setFieldValue("route", valueOption);
                        getBeatDDL(valueOption?.value, setBeatDDL);
                      }}
                      placeholder="Route"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="beat"
                      options={beatDDL}
                      value={values?.beat}
                      label="Market"
                      onChange={(valueOption) => {
                        setFieldValue("beat", valueOption);
                      }}
                      placeholder="Market"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="month"
                      options={monthDDL}
                      value={values?.month}
                      label="Month"
                      onChange={(valueOption) => {
                        setFieldValue("month", valueOption);
                      }}
                      placeholder="Month"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="category"
                      options={categoryDDL}
                      value={values?.category}
                      label="Category"
                      onChange={(valueOption) => {
                        setFieldValue("category", valueOption);
                        getSubCategoryDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setSubCategoryDDL
                        );
                      }}
                      placeholder="Category"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="subCategory"
                      options={subCategoryDDL}
                      value={values?.subCategory}
                      label="Sub Category"
                      onChange={(valueOption) => {
                        setFieldValue("subCategory", valueOption);
                        getItemDDL(
                          values?.category?.value,
                          valueOption?.value,
                          profileData?.accountId,
                          setItemDDL
                        );
                      }}
                      placeholder="Sub Category"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="item"
                      options={itemDDL}
                      value={values?.item}
                      label="Item Name"
                      onChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                      }}
                      placeholder="Item Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <button
                      type="button"
                      class="btn btn-primary"
                      style={{ marginTop: "16px" }}
                      onClick={() => {
                        getLandingData(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.item?.value,
                          values?.month?.value,
                          pageNo,
                          pageSize,
                          setIsLoading,
                          setGridData
                        );
                        setAllSelect(false);
                      }}
                      disabled={
                        !values?.month ||
                        !values?.route ||
                        !values?.beat ||
                        !values?.category ||
                        !values?.subCategory ||
                        !values?.item
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
              </Form>
              {isloading && <Loading />}
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>
                      <input
                        style={{ width: "15px", height: "15px" }}
                        name="isSelect"
                        checked={allSelect}
                        className="form-control ml-8"
                        type="checkbox"
                        onChange={(e) => setAllSelect(!allSelect)}
                      />
                    </th>
                    <th>SL</th>
                    <th>Outlet Name</th>
                    <th>Bill Request Date</th>
                    <th>Item Name</th>
                    <th>Item Received Quantity</th>
                    <th>Bill Request Amount</th>
                    <th>Bill Approve Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.length > 0 &&
                    gridData?.data?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="ml-3">
                            <span>
                              <input
                                style={{ width: "15px", height: "15px" }}
                                name="isSelect"
                                checked={item?.isSelect}
                                className="form-control ml-8"
                                type="checkbox"
                                onChange={(e) => selectIndividualItem(index)}
                              />
                            </span>
                          </td>
                          <td style={{ width: "30px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td>
                            <span className="pl-2">{item?.outletName}</span>
                          </td>
                          <td className="text-center">
                            {_dateFormatter(item?.dteOutletBillDate)}
                          </td>
                          <td>
                            <div className="pl-2">{item?.itemtName}</div>
                          </td>
                          <td className="text-right">
                            <span className="pr-2">
                              {item?.receiveQuantity}
                            </span>
                          </td>
                          <td className="text-right">
                            <span className="pr-2">
                              {_formatMoney(item?.outletBillAmount)}
                            </span>
                          </td>
                          <td className="text-right">
                            <span className="pr-2">
                              {_formatMoney(item?.outletBillApproveAmount)}
                            </span>
                          </td>
                          <td className="text-center">
                            {item?.billProcessStatus}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {/* Pagination Code */}
              {gridData?.data?.length > 0 && (
                <PaginationTable
                  count={gridData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
};

export default OutletBillProcessLanding;
