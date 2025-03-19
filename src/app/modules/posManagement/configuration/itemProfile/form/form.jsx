/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "./../../../../_helper/_select";
import { getItemDDL } from "./../../helper";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { IInput } from "./../../../../_helper/_input";
// import PaginationSearch from './../../../../_helper/_search';
import PaginationTable from "./../../../../_helper/_tablePagination";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
// import InputField from '../../../../_helper/_inputField';

const validationSchema = Yup.object().shape({
  // whName: Yup.string()
  //   .min(2, "Minimum 2 strings")
  //   .max(100, "Maximum 100 strings")
  //   .required("Holiday group name is required"),
});

function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  accountId,
  bussinessUnitId,
  whNameDDL,
  rowDto,
  setRowDto,
  remover,
  updateMRP,
  updateBarCode,
  updateRate,
  updateExpiredDate,
  profileData,
  selectedBusinessUnit,
}) {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [totalCount, setTotalCount] = useState(0);

  const itemSearchHandler = (values) => {
    getItemDDL(
      accountId,
      bussinessUnitId,
      values?.whName?.value,
      values?.fromDate,
      values?.toDate,
      values?.salesRate,
      values?.mrp,
      values?.expiredDate,
      pageNo,
      pageSize,
      setRowDto,
      setTotalCount,
      values?.item?.label  || ""
    );
  };

  // const paginationSearchHandler = (searchValue, values) => {
  //   getItemDDL(
  //     accountId,
  //     bussinessUnitId,
  //     values?.whName?.value,
  //     values?.fromDate,
  //     values?.toDate,
  //     values?.salesRate,
  //     values?.mrp,
  //     values?.expiredDate,
  //     pageNo,
  //     pageSize,
  //     setRowDto,
  //     setTotalCount,
  //     searchValue,
  //   );
  // };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getItemDDL(
      accountId,
      bussinessUnitId,
      values?.whName?.value,
      values?.fromDate || "",
      values?.toDate || "",
      values?.salesRate || "",
      values?.mrp || "",
      values?.expiredDate || "",
      pageNo,
      pageSize,
      setRowDto,
      setTotalCount,
      values?.item?.label || ""
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values);
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
          isValid,
        }) => (
          <Form className="form form-label-right">
            <div className="global-form">
              <div className="row">
                <div className="col-lg-3">
                  <NewSelect
                    name="whName"
                    options={whNameDDL}
                    value={values?.whName}
                    onChange={(valueOption) => {
                      setFieldValue("whName", valueOption);
                    }}
                    placeholder="Outlet Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.fromDate}
                    label="From date"
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e?.target?.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.toDate}
                    label="To date"
                    name="toDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e?.target?.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="salesRate"
                    options={[
                      {
                        value: "0---10000",
                        label: "Assign",
                        min: 0,
                        max: 100000,
                      },
                      {
                        value: "-1000 - 0",
                        label: "Not Assign",
                        min: -1000,
                        max: 0,
                      },
                    ]}
                    value={values?.salesRate}
                    onChange={(valueOption) => {
                      setFieldValue("salesRate", valueOption);
                    }}
                    placeholder="Sales Rate"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="mrp"
                    options={[
                      {
                        value: "0---10000",
                        label: "Assign",
                        min: 0,
                        max: 100000,
                      },
                      {
                        value: "-1000 - 0",
                        label: "Not Assign",
                        min: -1000,
                        max: 0,
                      },
                    ]}
                    value={values?.mrp}
                    onChange={(valueOption) => {
                      setFieldValue("mrp", valueOption);
                    }}
                    placeholder="MRP"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="expiredDate"
                    options={[
                      {
                        value: true,
                        label: "Assign",
                      },
                      {
                        value: false,
                        label: "Not Assign",
                      },
                    ]}
                    value={values?.expiredDate}
                    onChange={(valueOption) => {
                      setFieldValue("expiredDate", valueOption);
                    }}
                    placeholder="Expired Date"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Search Item/Scan Item</label>
                  <SearchAsyncSelect
                    selectedValue={values?.item}
                    name="item"
                    handleChange={(valueOption) => {
                      setFieldValue("item",valueOption);
                    }}
                    placeholder="Search Item/Scan Item"
                    loadOptions={(v) => {
                      if (v.length > 3) {
                        return axios
                          .get(
                            `/item/ItemSales/GetItemSalesforPOSDDL?SearchTerm=${v}&AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}&WarehouseId=${values?.whName?.value}`
                          )
                          .then((res) => res?.data);
                      }
                    }}
                    isDisabled={!values?.whName}
                  />
                </div>

                <div className="col-lg-2 mt-6">
                  <button
                    className="btn btn-primary"
                    disabled={
                      !values?.whName || !values?.fromDate || !values?.toDate
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      itemSearchHandler(values);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              {/* <div className="col-lg-3">
                  <PaginationSearch
                    placeholder="Item Name"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                </div> */}
              <div className="col-md-12">
                {/* RowDto */}
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Item Name</th>
                      <th>Item Code</th>
                      <th>UOM</th>
                      <th>Purchase Date</th>
                      <th>Purchase Qty</th>
                      <th>Purchase Rate</th>
                      <th style={{ width: "80px" }}>Sales Rate</th>
                      <th style={{ width: "80px" }}>M.R.P</th>
                      <th style={{ width: "100px" }}>Expiry Date</th>
                      <th style={{ width: "100px" }}>Bar Code</th>
                    </tr>
                  </thead>
                  <tbody className="itemList">
                    {rowDto?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-left">{item?.itemName}</td>
                          <td className="text-left">{item?.itemCode}</td>
                          <td>{item?.uomName}</td>
                          <td>{_dateFormatter(item?.purchaseDate)}</td>
                          <td>{item?.purchaseQty}</td>
                          <td>{item?.cogs}</td>
                          <td className="text-center">
                            <input
                              style={{ width: "80px", borderRadius: "5px" }}
                              name="rate"
                              value={item?.salesRate}
                              onChange={(e) => {
                                updateRate(e.target.value, index);
                              }}
                              type="number"
                            />
                          </td>
                          <td className="text-center">
                            <input
                              style={{ width: "80px", borderRadius: "5px" }}
                              name="itemMrp"
                              value={item?.mrp}
                              onChange={(e) => {
                                updateMRP(e.target.value, index);
                              }}
                              type="number"
                            />
                          </td>
                          <td className="text-center">
                            <input
                              style={{ width: "110px", borderRadius: "5px" }}
                              type="date"
                              name="expiredDate"
                              defaultValue={_dateFormatter(item?.expiredDate)}
                              onChange={(e) => {
                                updateExpiredDate(e.target.value, index);
                              }}
                            />
                          </td>
                          <td className="text-center">
                            <input
                              style={{ width: "100px", borderRadius: "5px" }}
                              type="text"
                              name="barCode"
                              defaultValue={item?.barCode}
                              onChange={(e) => {
                                updateBarCode(e.target.value, index);
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {rowDto?.length > 0 && (
                <PaginationTable
                  count={totalCount}
                  setPositionHandler={setPositionHandler}
                  values={values}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                />
              )}
            </div>
            <button
              type="submit"
              style={{ display: "none" }}
              ref={btnRef}
              onSubmit={() => handleSubmit()}
            ></button>

            <button
              type="reset"
              style={{ display: "none" }}
              ref={resetBtnRef}
              onSubmit={() => resetForm(initData)}
            ></button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default _Form;
