import { Formik, Form } from "formik";
import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import {
  CardBody,
  CardHeaderToolbar,
  Card,
  CardHeader,
  CardHeaderTitle,
} from "../../../../_metronic/_partials/controls";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import FormikError from "../../_helper/_formikError";
import InputField from "../../_helper/_inputField";
import Loading from "../../_helper/_loading";
// import NewSelect from "../../_helper/_select";
import * as yup from "yup";
import useAxiosPost from "../../_helper/customHooks/useAxiosPost";
import { completeProjectWithInventory } from "./projectAccounting/projectApi";
const initialValues = {
  completeDate: null,
  remarks: null,
  wareHouseForAllItem: false,
  selectedWareHouseForAllItem: null,
};

const validationSchema = yup.object().shape({
  completeDate: yup
    .date()
    .required("Complete date is required")
    .typeError("Complete date is required"),
  remarks: yup
    .string()
    .required("Remarks is required")
    .typeError("Remarks is required"),
});

const ProjectAccountingComplete = () => {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );
  const location = useLocation();
  const history = useHistory();
  const [
    projectInformation,
    getProjectInformation,
    loadingOnGetProjectInformation,
  ] = useAxiosGet();
  const [inventoryItemList, setInventoryItemList] = useState([]);
  const [, completeProject, loadingOnCompleteProject] = useAxiosPost();
  useEffect(() => {
    location?.state?.projectId &&
      getProjectInformation(
        `/fino/ProjectAccounting/GetProjectById?accId=${profileData?.accountId}&buId=${selectedBusinessUnit?.value}&id=${location?.state?.projectId}`,
        (data) => {
          const modifiedInventoryItemList = data?.projectCostingInventory?.map(
            (item) => ({
              ...item,
              closingInventory: "",
              warehouse: null,
              noWareHouseError: null,
            })
          );
          setInventoryItemList(modifiedInventoryItemList);
        }
      );
    // eslint-disable-next-line
  }, [location?.state?.projectId]);

  return (
    <>
      {(loadingOnGetProjectInformation ||
        // loadingOnGetWarehouseDDL ||
        loadingOnCompleteProject) && <Loading />}
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          completeProjectWithInventory(
            profileData,
            selectedBusinessUnit,
            projectInformation,
            values,
            inventoryItemList,
            setInventoryItemList,
            completeProject,
            history
          );
        }}
      >
        {({ handleSubmit, setFieldValue, values, errors, touched }) => (
          <Card>
            <CardHeader title="Complete Project">
              <CardHeaderToolbar>
                <button
                  className="btn btn-light ml-2"
                  type="button"
                  onClick={() => {
                    history.goBack();
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary ml-2"
                  type="button"
                  onClick={handleSubmit}
                >
                  Save
                </button>
              </CardHeaderToolbar>
            </CardHeader>

            <CardBody>
              <Form
                className="form form-label-right mb-4"
                onSubmit={handleSubmit}
              >
                <div className="row global-form">
                  <div className="col-md-3">
                    <InputField
                      type="date"
                      value={values?.completeDate}
                      label="Complete Date"
                      onChange={(e) => {
                        setFieldValue("completeDate", e.target.value);
                      }}
                    />
                    <FormikError
                      name="completeDate"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-3">
                    <InputField
                      type="text"
                      value={values?.remarks}
                      label="Remarks"
                      onChange={(e) => {
                        setFieldValue("remarks", e.target.value);
                      }}
                    />
                    <FormikError
                      name="remarks"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </Form>
              {projectInformation?.projectCostingExpense?.length > 0 && (
                <>
                  <div className="row mt-3" id="pdf-section">
                    <div className="col-12 d-flex align-items-center justify-content-between mt-4 pt-3 border-top">
                      <CardHeaderTitle>
                        <p style={{ fontSize: "16px", marginBottom: 0 }}>
                          Expense Details
                        </p>
                      </CardHeaderTitle>
                    </div>
                    <div className="col-12">
                      <div className="print_wrapper">
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 global-table table-font-size-sm">
                            <thead>
                              <tr>
                                <th style={{ width: "50px" }}>SL</th>
                                <th style={{ width: "100px" }}>
                                  <div className="text-left ml-1">
                                    Profit Center
                                  </div>
                                </th>
                                <th style={{ width: "100px" }}>
                                  <div className="text-left ml-1">
                                    Cost Center
                                  </div>
                                </th>
                                <th style={{ width: "100px" }}>
                                  <div className="text-left ml-1">
                                    Cost Element
                                  </div>
                                </th>
                                <th style={{ width: "100px" }}>
                                  <div className="text-left ml-1">
                                    Responsible
                                  </div>
                                </th>
                                <th style={{ width: "100px" }}>
                                  <div className="text-right mr-1">
                                    Budget Amount
                                  </div>
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {projectInformation?.projectCostingExpense?.map(
                                (item, index) => (
                                  <tr key={index}>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="text-left">
                                      {item?.strProfitCenter || "N/A"}
                                    </td>
                                    <td className="text-left">
                                      {item?.strCostCenter || "N/A"}
                                    </td>
                                    <td className="text-left">
                                      {item?.strCostElement || "N/A"}
                                    </td>
                                    <td className="text-left">
                                      {item?.strResponsible || "N/A"}
                                    </td>
                                    <td className="text-right">
                                      {item?.numBudgetAmount || "N/A"}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div></div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {projectInformation?.actualProjectCostingExpense?.length > 0 && (
                <>
                  <div className="row mt-3" id="pdf-section">
                    <div className="col-12 d-flex align-items-center justify-content-between mt-4 pt-3 border-top">
                      <CardHeaderTitle>
                        <p style={{ fontSize: "16px", marginBottom: 0 }}>
                          Actual Expense Details
                        </p>
                      </CardHeaderTitle>
                    </div>
                    <div className="col-12">
                      <div className="print_wrapper">
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 global-table table-font-size-sm">
                            <thead>
                              <tr>
                                <th style={{ width: "50px" }}>SL</th>
                                <th style={{ width: "100px" }}>
                                  <div className="text-left ml-1">
                                    Profit Center
                                  </div>
                                </th>
                                <th style={{ width: "100px" }}>
                                  <div className="text-left ml-1">
                                    Cost Center
                                  </div>
                                </th>
                                <th style={{ width: "100px" }}>
                                  <div className="text-left ml-1">
                                    Cost Element
                                  </div>
                                </th>
                                {/* <th style={{ width: "100px" }}>
                                <div className="text-left ml-1">
                                  Responsible
                                </div>
                              </th> */}
                                <th style={{ width: "100px" }}>
                                  <div className="text-right mr-1">
                                    Total Amount
                                  </div>
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {projectInformation?.actualProjectCostingExpense?.map(
                                (item, index) => (
                                  <tr key={index}>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="text-left">
                                      {item?.strProfitCenterName || "N/A"}
                                    </td>
                                    <td className="text-left">
                                      {item?.strCostCenterName || "N/A"}
                                    </td>
                                    <td className="text-left">
                                      {item?.strCostElementName || "N/A"}
                                    </td>
                                    {/* <td className="text-left">
                                    {item?.strResponsible || "N/A"}
                                  </td> */}
                                    <td className="text-right">
                                      {item?.numAmount || "N/A"}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>

                        <div></div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {inventoryItemList?.length > 0 && (
                <>
                  <div className="d-flex align-items-center justify-content-between mt-4 pt-3 border-top">
                    <CardHeaderTitle>
                      <p style={{ fontSize: "16px", marginBottom: 0 }}>
                        Inventory Items
                      </p>
                    </CardHeaderTitle>
                  </div>
                  <div className="row" id="pdf-section">
                    <div className="col-lg-12">
                      <div className="print_wrapper">
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 global-table table-font-size-sm">
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th>Item Code</th>
                                <th>
                                  <div className="text-left ml-1">
                                    Item Name
                                  </div>
                                </th>
                                <th>
                                  <div className="text-left ml-1">UOM</div>
                                </th>
                                <th>
                                  <div className="text-right">
                                    Total Quantity
                                  </div>
                                </th>
                                <th>
                                  <div className="text-right">Total Amount</div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {inventoryItemList?.map((item, index) => (
                                <tr key={item?.intProjectInvId}>
                                  <td>{index + 1}</td>
                                  <td className="text-center">
                                    {item?.strItemCode || "N/A"}
                                  </td>
                                  <td className="text-left">
                                    {item?.strItem || "N/A"}
                                  </td>
                                  <td className="text-left">
                                    {item?.strUom || "N/A"}
                                  </td>
                                  <td className="text-right">
                                    {item?.numQty || 0}
                                  </td>
                                  <td className="text-right">
                                    {item?.numTotal || 0}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {projectInformation?.actualProjectCostingInventory?.length >
                0 && (
                <>
                  <div className="d-flex align-items-center justify-content-between mt-4 pt-3 border-top">
                    <CardHeaderTitle>
                      <p style={{ fontSize: "16px", marginBottom: 0 }}>
                        Actual Inventory Items
                      </p>
                    </CardHeaderTitle>
                  </div>
                  <div className="row" id="pdf-section">
                    <div className="col-lg-12">
                      <div className="print_wrapper">
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered mt-3 global-table table-font-size-sm">
                            <thead>
                              <tr>
                                <th>SL</th>
                                <th>Item Code</th>
                                <th>
                                  <div className="text-left ml-1">
                                    Item Name
                                  </div>
                                </th>
                                <th>
                                  <div className="text-left ml-1">UOM</div>
                                </th>
                                <th>
                                  <div className="text-right">
                                    Total Quantity
                                  </div>
                                </th>
                                <th>
                                  <div className="text-right">Total Amount</div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {projectInformation?.actualProjectCostingInventory?.map(
                                (item, index) => (
                                  <tr key={item?.intRowId}>
                                    <td>{index + 1}</td>
                                    <td className="text-center">
                                      {item?.strItemCode || "N/A"}
                                    </td>
                                    <td className="text-left">
                                      {item?.strItemName || "N/A"}
                                    </td>
                                    <td className="text-left">
                                      {item?.strUoMname || "N/A"}
                                    </td>
                                    <td className="text-right">
                                      {item?.numTransactionQuantity || 0}
                                    </td>
                                    <td className="text-right">
                                      {item?.numTransactionQuantity *
                                        item?.numItemPrice || 0}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardBody>
          </Card>
        )}
      </Formik>
    </>
  );
};

export default ProjectAccountingComplete;

// please dont remove these functionalities..because this may be use

// const [
//   warehouseDDL,
//   getWarehouseDDL,
//   loadingOnGetWarehouseDDL,
// ] = useAxiosGet();
// useEffect(() => {
//   getWarehouseDDL(
//     `/wms/ItemPlantWarehouse/GetPlantItemPlantWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
//   );
//   // eslint-disable-next-line
// }, [selectedBusinessUnit?.value, profileData?.accountId]);
// console.log(inventoryItemList);
/* <div className="d-flex align-items-center justify-content-center">
                  <div style={{ width: "300px" }}>
                    <NewSelect
                      name="selectedWareHouseForAllItem"
                      options={warehouseDDL || []}
                      value={values.selectedWareHouseForAllItem}
                      isHiddenLabel
                      onChange={(valueOption) => {
                        setFieldValue(
                          "selectedWareHouseForAllItem",
                          valueOption
                        );
                        setFieldValue("wareHouseForAllItem", false);
                      }}
                      placeholder="Ware House"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="ml-3 d-flex align-items-center justify-content-center">
                    <div className="mx-2">
                      <input
                        type="checkbox"
                        id="wareHouseForAllItem"
                        value={values?.wareHouseForAllItem}
                        onChange={() => {
                          if (!values?.wareHouseForAllItem === true) {
                            const modifiedInventoryItemList = inventoryItemList?.map(
                              (item) => ({
                                ...item,
                                warehouse: values?.selectedWareHouseForAllItem,
                              })
                            );
                            setInventoryItemList(modifiedInventoryItemList);
                          }
                          setFieldValue(
                            "forProject",
                            !values?.wareHouseForAllItem
                          );
                        }}
                        disabled={!values?.selectedWareHouseForAllItem}
                      />
                    </div>
                    <label>All</label>
                  </div>
                </div> */

/* <th>Closing Inventory</th>
                            <th>Warehouse</th> */

/* <td style={{ width: "300px" }}>
                                <InputField
                                  style={{
                                    marginTop: item?.noWareHouseError
                                      ? "-1.1em"
                                      : "",
                                  }}
                                  isHiddenLabel
                                  placeholder="Closing Inventory"
                                  type="number"
                                  value={item?.closingInventory}
                                  onChange={(e) => {
                                    if (
                                      +e.target.value < 0 ||
                                      +e.target.value > +item?.numQty
                                    )
                                      return null;
                                    const modifiedInventoryItemList = inventoryItemList?.map(
                                      (nestedItem) =>
                                        nestedItem?.intProjectInvId ===
                                        item?.intProjectInvId
                                          ? {
                                              ...nestedItem,
                                              closingInventory: e.target.value,
                                            }
                                          : nestedItem
                                    );
                                    setInventoryItemList(
                                      modifiedInventoryItemList
                                    );
                                  }}
                                />
                              </td>
                              <td>
                                <NewSelect
                                  options={warehouseDDL || []}
                                  value={item?.warehouse}
                                  isHiddenLabel
                                  onChange={(valueOption) => {
                                    const modifiedInventoryItemList = inventoryItemList?.map(
                                      (nestedItem) =>
                                        nestedItem?.intProjectInvId ===
                                        item?.intProjectInvId
                                          ? {
                                              ...nestedItem,
                                              warehouse: valueOption,
                                              noWareHouseError: "",
                                            }
                                          : nestedItem
                                    );
                                    setInventoryItemList(
                                      modifiedInventoryItemList
                                    );
                                  }}
                                  placeholder="Ware House"
                                />
                                {item?.noWareHouseError && (
                                  <p
                                    style={{
                                      fontSize: "0.9rem",
                                      fontWeight: 400,
                                      width: "100%",
                                      marginTop: "0",
                                      marginBottom: "0",
                                    }}
                                    className="text-danger"
                                  >
                                    {item?.noWareHouseError}
                                  </p>
                                )}
                              </td> */
