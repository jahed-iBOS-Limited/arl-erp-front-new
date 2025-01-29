import React, { useEffect, useMemo, useState } from "react";
import PaginationSearch from "./../../../../_helper/_search";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";
import {
  getSBUList,
  getPlantList,
  //getPurchaseOrgList,
  getWhList,
  getIssueStatementLanding,
  getItemCategoryDDLByTypeId_api,
  ItemSubCategory_api,
  getItemTypeListDDL_api,
} from "../helper";
import ILoader from "../../../../_helper/loader/_loader";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";
import { _todayDate } from "../../../../_helper/_todayDate";
import PaginationTable from "../../../../_helper/_tablePagination";
// import { downloadFile } from '../../../../_helper/downloadFile';
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { generateJsonToExcel } from "../../../../_helper/excel/jsonToExcel";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const validationSchema = Yup.object().shape({
  toDate: Yup.string().when("fromDate", (fromDate, Schema) => {
    if (fromDate) return Schema.required("To date is required");
  }),
});

let initData = {
  wh: "",
  plant: "",
  sbu: "",
  status: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  issueId: "",
  costCente: "",
};

const IssueReportTable = () => {
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(100);

  // ddl state
  const [sbuList, setSbuList] = useState("");
  const [plantList, setPlantList] = useState("");
  const [whList, setWhList] = useState("");
  const [itemTypeOption, setItemTypeOption] = useState([]);
  const [itemCategoryDDL, setItemCategoryDDL] = useState([]);
  const [itemSUBCategoryDDL, setItemSubCategoryDDL] = useState([]);
  const [costCenterDDL, getCostCenterDDL, , setCostCenterDDL] = useAxiosGet();
  // landing
  const [landing, setLanding] = useState([]);

  // loading
  const [loading, setLoading] = useState(false);

  // redux data
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });

  // get ddl
  useEffect(() => {
    getSBUList(profileData?.accountId, selectedBusinessUnit?.value, setSbuList);
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getPlantList(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantList
      );
    }
    getItemTypeListDDL_api(setItemTypeOption);
  }, [profileData, selectedBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getIssueStatementLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      values?.itemType?.value || "",
      values?.itemCategory?.value || "",
      values?.itemSubCategory?.value || "",
      values?.costCenter?.value || "",
      pageNo,
      pageSize
    );
  };

  const viewPurchaseOrderData = (values) => {
    getIssueStatementLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      values?.itemType?.value || "",
      values?.itemCategory?.value || "",
      values?.itemSubCategory?.value || "",
      values?.costCenter?.value || "",
      pageNo,
      pageSize
    );
  };

  const paginationSearchHandler = (value, values) => {
    getIssueStatementLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      values?.itemType?.value || "",
      values?.itemCategory?.value || "",
      values?.itemSubCategory?.value || "",
      values?.costCenter?.value || "",
      pageNo,
      pageSize,
      value
    );
  };

  // const downloadExcelFile = (values) => {
  //   const itemTypeId = values?.itemType?.value ? `&itemTypeId=${values?.itemType.value}`:""
  //   const itemCategoryId = values?.itemCategory?.value ? `&itemCategoryId=${values?.itemCategory?.value}`:""
  //   const itemSubCategoryId = values?.itemSubCategory?.value ? `&itemSubCategoryId=${values?.itemSubCategory?.value}`:""
  //   let api = `/wms/InventoryTransaction/GetIssueStatementDownload?BusinessUnitId=${selectedBusinessUnit?.value}&SbuId=${values?.sbu?.value}&WhId=${values?.wh?.value}&PlantId=${values?.plant?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PageNo=${pageNo}&PageSize=${10000}${itemTypeId}${itemCategoryId}${itemSubCategoryId}`

  //   downloadFile(
  //     api,
  //     "Issue Statement",
  //     "xlsx",
  //     setLoading
  //   )
  // }

  const generateExcel = (values, pageSize) => {
    getIssueStatementLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      (data) => {
        const header = [
          {
            text: "SL",
            textFormat: "number",
            alignment: "center:middle",
            key: "sl",
          },
          {
            text: "Cost Center",
            textFormat: "text",
            alignment: "center:middle",
            key: "strCostCenterName",
          },
          {
            text: "Issue Code",
            textFormat: "text",
            alignment: "center:middle",
            key: "strInventoryTransactionCode",
          },
          {
            text: "Issue Date",
            textFormat: "date",
            alignment: "center:middle",
            key: "dteTransactionDate",
          },
          {
            text: "Item Req Code",
            textFormat: "text",
            alignment: "center:middle",
            key: "strItemRequestCode",
          },
          {
            text: "Item Req Date",
            textFormat: "date",
            alignment: "center:middle",
            key: "dteRequestDate",
          },
          {
            text: "Item Code",
            textFormat: "text",
            alignment: "center:middle",
            key: "strItemCode",
          },
          {
            text: "Item Name",
            textFormat: "text",
            alignment: "center:middle",
            key: "strItemName",
          },
          {
            text: "Uom",
            textFormat: "text",
            alignment: "center:middle",
            key: "strUoMName",
          },
          {
            text: "Request Quantity",
            textFormat: "number",
            alignment: "center:middle",
            key: "RequestQty",
          },
          {
            text: "Issue Quantity",
            textFormat: "number",
            alignment: "center:middle",
            key: "IssueQuantity",
          },
          {
            text: "Value",
            textFormat: "money",
            alignment: "center:middle",
            key: "numTotalAmount",
          },
          {
            text: "Remarks",
            textFormat: "text",
            alignment: "center:middle",
            key: "strRemarks",
          },
        ];
        const _data = data.map((item, index) => {
          return {
            ...item,
            sl: index + 1,
            dteTransactionDate: _dateFormatter(item?.dteTransactionDate),
            dteRequestDate: _dateFormatter(item?.dteRequestDate),
          };
        });
        generateJsonToExcel(header, _data);
      },
      values?.sbu?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      values?.itemType?.value || "",
      values?.itemCategory?.value || "",
      values?.itemSubCategory?.value || "",
      values?.costCenter?.value || "",
      1,
      pageSize
    );
  };

  const calculateTotal = useMemo(() => {
    const total = landing?.reduce(
      (previousValue, item) => previousValue + (item?.numTotalAmount || 0),
      0
    );
    return total;
  }, [landing]);

  return (
    <ICustomCard title="Issue Statement">
      <>
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
          initialValues={initData}
          //validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <>
              <Form className="form form-label-left">
                <div
                  className="row global-form"
                  style={{ background: " #d6dadd" }}
                >
                  <div className="cgetIssueStatementLandingol-lg-3 col-xl-2">
                    <NewSelect
                      name="sbu"
                      options={sbuList || []}
                      value={values?.sbu}
                      label="SBU"
                      onChange={(v) => {
                        if (v) {
                          setFieldValue("sbu", v);
                          setFieldValue("costCenter", "");
                          getCostCenterDDL(
                            `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${v?.value}`
                          );
                        } else {
                          setFieldValue("sbu", "");
                          setFieldValue("costCenter", "");
                          setCostCenterDDL([]);
                        }
                      }}
                      placeholder="SBU"
                      errors={errors}
                      touched={touched}
                    />{" "}
                  </div>

                  <div className="col-lg-3 col-xl-2">
                    <NewSelect
                      name="plant"
                      options={plantList || []}
                      value={values?.plant}
                      label="Plant"
                      onChange={(v) => {
                        getWhList(
                          profileData?.userId,
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          v?.value,
                          setWhList
                        );
                        setFieldValue("plant", v);
                        setFieldValue("wh", "");
                      }}
                      placeholder="Plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 col-xl-2">
                    <NewSelect
                      name="wh"
                      options={whList || []}
                      value={values?.wh}
                      label="Warehouse"
                      onChange={(v) => {
                        setFieldValue("wh", v);
                      }}
                      placeholder="Warehouse"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 col-xl-2">
                    <NewSelect
                      name="costCenter"
                      options={
                        [{ value: 0, label: "All" }, ...costCenterDDL] || []
                      }
                      value={values?.costCenter}
                      label="Cost Center"
                      onChange={(v) => {
                        setFieldValue("costCenter", v);
                      }}
                      placeholder="Cost Center"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3 col-xl-2">
                    <NewSelect
                      name="itemType"
                      options={itemTypeOption || []}
                      value={values?.itemType}
                      label="Item Type"
                      onChange={(valueOption) => {
                        setFieldValue("itemType", valueOption);
                        valueOption?.value !== 0 &&
                          setFieldValue("itemCategory", "");

                        getItemCategoryDDLByTypeId_api(
                          profileData.accountId,
                          selectedBusinessUnit.value,
                          valueOption?.value,
                          setItemCategoryDDL
                        );
                      }}
                      placeholder="Item Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 col-xl-2">
                    <NewSelect
                      name="itemCategory"
                      options={itemCategoryDDL || []}
                      value={values?.itemCategory}
                      label="Item Category"
                      onChange={(valueOption) => {
                        setFieldValue("itemCategory", valueOption);
                        setFieldValue("itemSubCategory", "");
                        ItemSubCategory_api(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setItemSubCategoryDDL
                        );
                      }}
                      placeholder="Item Category"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 col-xl-2">
                    <NewSelect
                      name="itemSubCategory"
                      options={itemSUBCategoryDDL || []}
                      value={values?.itemSubCategory}
                      label="Item Sub Category"
                      onChange={(valueOption) => {
                        setFieldValue("itemSubCategory", valueOption);
                      }}
                      placeholder="Sub Category"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3 col-xl-2">
                    <label>From Date</label>
                    <div className="flex-fill">
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From date"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="col-lg-3 col-xl-2">
                    <label>To Date</label>
                    <div className="flex-fill">
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                      />
                    </div>
                  </div>
                  <div className="col-auto mt-5">
                    <button
                      type="submit"
                      className="btn btn-primary mr-1"
                      disabled={
                        !values?.plant ||
                        !values?.wh ||
                        !values?.sbu ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                      onClick={() => {
                        viewPurchaseOrderData(values);
                      }}
                    >
                      View
                    </button>
                    {/*

                      temporary hide this button

                    */}
                    {landing?.length > 0 && (
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled={
                          !values?.plant ||
                          !values?.wh ||
                          !values?.sbu ||
                          !values?.fromDate ||
                          !values?.toDate
                        }
                        onClick={(e) =>
                          // downloadExcelFile(values)
                          generateExcel(values, landing[0]?.TotalRows)
                        }
                      >
                        Export Excel
                      </button>
                    )}
                  </div>
                </div>
              </Form>
              <div className="row">
                {/* {loading && <Loading />} */}

                <div className="col-lg-12">
                  <PaginationSearch
                    placeholder="Transaction Code Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table table-font-size-sm">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Cost Center</th>
                          <th>Issue Code</th>
                          <th>Issue Date</th>
                          <th>Item Req Code</th>
                          <th>Item Req Date</th>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Uom</th>
                          <th>Request Quantity</th>
                          <th>Issue Quantity</th>
                          <th>Value</th>
                          <th>Remarks</th>
                          {/* <th>Action</th> */}
                        </tr>
                      </thead>
                      {loading ? (
                        <ILoader />
                      ) : (
                        <tbody>
                          {landing?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.strCostCenterName}</td>
                              <td style={{ width: "120px" }}>
                                {item?.strInventoryTransactionCode}
                              </td>
                              <td style={{ width: "70px" }}>
                                {_dateFormatter(item?.dteTransactionDate)}
                              </td>
                              <td style={{ width: "120px" }}>
                                {item?.strItemRequestCode}
                              </td>
                              <td style={{ width: "70px" }}>
                                {_dateFormatter(item?.dteRequestDate)}
                              </td>
                              <td>{item?.strItemCode}</td>
                              <td>{item?.strItemName}</td>
                              <td style={{ width: "70px" }}>
                                {item?.strUoMName}
                              </td>
                              <td style={{ width: "70px" }}>
                                {item?.RequestQty}
                              </td>
                              <td style={{ width: "70px" }}>
                                {item?.IssueQuantity}
                              </td>
                              <td style={{ width: "100px" }}>
                                {_formatMoney(item?.numTotalAmount)}
                              </td>
                              <td>{item?.strRemarks}</td>
                              {/* <td className="text-center align-middle">
                                <span>
                                  <IView
                                    clickHandler={() =>
                                      history.push({
                                        pathname: `/inventory-management/warehouse-management/inventorytransaction/reportview/${item?.inventoryTransactionId}/${2}`,
                                        item,
                                      })
                                    }
                                  />
                                </span>
                            </td> */}
                            </tr>
                          ))}
                          <tr>
                            <td className="font-weight-bold">Total</td>
                            <td colSpan={10}></td>
                            <td>{_formatMoney(calculateTotal)}</td>
                            <td></td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
              {landing?.length > 0 && (
                <PaginationTable
                  count={landing[0]?.TotalRows}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                  rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 300, 400, 500]}
                />
              )}
            </>
          )}
        </Formik>
      </>
    </ICustomCard>
  );
};

export default IssueReportTable;
