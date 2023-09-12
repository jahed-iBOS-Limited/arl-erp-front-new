import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
const initData = {};
export default function CustomerIncentive() {
  const [searchValue, setSearchValue] = useState("");
  const [headingSelect,setHeadingSelect] = useState(false)
  const [
    tradeCommission,
    getTradeCommission,
    loadTradeCommission,
    setTradeCommission,
  ] = useAxiosGet();
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const handleRowSelection = (key, value, index) => {
    const newTradeCommissionData = [...tradeCommission];
    newTradeCommissionData[index][key] = value;
    setTradeCommission(newTradeCommissionData);
    setHeadingSelect(newTradeCommissionData?.every(item=>item?.isSelect))
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
          {false && <Loading />}
          <IForm
            title="Customer Incentive"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    hidden
                    className="btn btn-primary"
                    onClick={() => {
                      history.push("route here");
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="row global-form">
                <div className="col-md-3">
                  <NewSelect
                    name="customerCategory"
                    options={[
                      { value: "All", label: "All" },
                      { value: "Platinum", label: "Platinum" },
                      { value: "Gold", label: "Gold" },
                    ]}
                    value={values?.customerCategory || ""}
                    label="Customer Category"
                    // placeholder="Select Customer Category"
                    onChange={(valueOption) => {
                      setFieldValue("customerCategory", valueOption);
                    }}
                    //   onChange={(valueOption) => {
                    //     setFieldValue("item", "");
                    //     setFieldValue("shopFloor", "");
                    //     setFieldValue("rawItem", "");
                    //     setGridData([]);
                    //     setFieldValue("plant", valueOption);
                    //     if (valueOption?.value) {
                    //       getShopfloorDDL(
                    //         profileData?.accountId,
                    //         selectedBusinessUnit?.value,
                    //         valueOption?.value,
                    //         setShopFloorDDL
                    //       );
                    //     }
                    //     setBomReportBasedOnBackCalculationId([]);
                    //     setShow(false);
                    //   }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* <div className="col-md-3">
                  <NewSelect
                    name="customerName"
                      options={plantDDL}
                    
                    value={"All"}
                    label="Customer Name"
                      onChange={(valueOption) => {
                        setFieldValue("item", "");
                        setFieldValue("shopFloor", "");
                        setFieldValue("rawItem", "");
                        setGridData([]);
                        setFieldValue("plant", valueOption);
                        if (valueOption?.value) {
                          getShopfloorDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            setShopFloorDDL
                          );
                        }
                        setBomReportBasedOnBackCalculationId([]);
                        setShow(false);
                      }}
                    placeholder="Select Customer Name"
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                <div className="col-lg-3">
                  {/* <InputField
                    value={values?.toDate}
                    label="Date-Month-Year"
                    type="date"
                    name="monthYear"
                    onChange={(e) => {
                      setFieldValue("monthYear", e?.target?.value);
                    }}
                  /> */}
                  <label>Month-Year</label>
                  <InputField
                    value={values?.monthYear}
                    name="monthYear"
                    placeholder="From Date"
                    type="month"
                    onChange={(e) => {
                      setFieldValue("monthYear", e?.target?.value);
                    }}
                  />
                </div>
                <div
                  style={{ marginTop: "15px", display: "flex", gap: "10px" }}
                  className="col-md-3"
                >
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      //   onClick={() => {
                      //     if (backCalculationId?.backcalculationId === 2) {
                      //       getBomReportBasedOnBackCalculationId(
                      //         `/mes/MESReport/BomReportDependOnBackCalculation?plantId=${
                      //           values?.plant?.value
                      //         }&ShopFloorId=${values?.shopFloor?.value}${
                      //           values?.item
                      //             ? `&itemId=${values?.item?.value}`
                      //             : values?.rawItem
                      //             ? `&itemRawMaterialId=${values?.rawItem?.value}`
                      //             : ""
                      //         }`
                      //       );
                      //     } else {
                      //       getBOMReport(
                      //         values?.item?.value,
                      //         values?.shopFloor?.value,
                      //         setGridData,
                      //         setLoading
                      //       );
                      //     }
                      //     setShow(true);
                      //   }}
                      // disabled={!values?.item?.value && !values?.rawItem?.value}
                      disabled
                    >
                      Excel
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getTradeCommission(
                          `/oms/SalesInformation/GetTradeCommission?businessUnitId=${
                            selectedBusinessUnit?.value
                          }&customerId=${0}&monthYear=${
                            values?.monthYear
                          }&customerCategory=${values?.customerCategory?.value}`
                        );
                      }}
                      //   onClick={() => {
                      //     if (backCalculationId?.backcalculationId === 2) {
                      //       getBomReportBasedOnBackCalculationId(
                      //         `/mes/MESReport/BomReportDependOnBackCalculation?plantId=${
                      //           values?.plant?.value
                      //         }&ShopFloorId=${values?.shopFloor?.value}${
                      //           values?.item
                      //             ? `&itemId=${values?.item?.value}`
                      //             : values?.rawItem
                      //             ? `&itemRawMaterialId=${values?.rawItem?.value}`
                      //             : ""
                      //         }`
                      //       );
                      //     } else {
                      //       getBOMReport(
                      //         values?.item?.value,
                      //         values?.shopFloor?.value,
                      //         setGridData,
                      //         setLoading
                      //       );
                      //     }
                      //     setShow(true);
                      //   }}
                      disabled={
                        !values?.customerCategory?.value || !values?.monthYear
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
              <div>
                {/* search div hidden  */}
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div className={"input-group"} style={{ width: "25%" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Serach Customer Name"
                      aria-describedby="basic-addon2"
                      disabled={tradeCommission?.length < 1}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          setSearchValue(e.target.value);
                        }
                      }}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        disabled={tradeCommission?.length < 1}
                        onClick={() => {
                          setSearchValue(searchValue);
                        }}
                      >
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                  <div>
                   {
                    tradeCommission?.some(item=>item?.isSelect) &&  
                    <button
                    type="button"
                    className="btn btn-primary"
                  >
                    Action 
                  </button>
                   }
                  </div>
                </div>
                {loadTradeCommission && <Loading />}
                {tradeCommission?.length > 0 ? (
                  <table
                    style={{ maxHeight: "400px", overflow: "scroll" }}
                    className="table table-striped table-bordered mt-3 bj-table bj-table-landing"
                  >
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            name="isSelect"
                            checked={headingSelect}
                            onChange={(e) => {
                              setHeadingSelect(e.target.checked)
                              const updatedTradeCommission = tradeCommission?.map(
                                (item) => ({
                                  ...item,
                                  isSelect: e.target.checked,
                                })
                              );
                              setTradeCommission(updatedTradeCommission);
                            }}
                          />
                        </th>
                        <th>SL</th>
                        <th>Customer Code</th>
                        <th>Customer Name</th>
                        <th>Customer Category</th>
                        <th>General Incentive</th>
                        <th>Monthly Incentive</th>
                        <th style={{ width: "120px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tradeCommission?.length > 0 &&
                        tradeCommission
                          ?.filter(
                            (item) =>
                              item?.customerName
                                ?.toLowerCase()
                                .includes(searchValue) ||
                              item?.customerCode
                                ?.toString()
                                .includes(searchValue)
                          )
                          ?.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <input
                                  type="checkbox"
                                  name="isSelect"
                                  value={item?.isSelect}
                                  checked={item?.isSelect}
                                  onChange={(e) =>
                                    handleRowSelection(
                                      "isSelect",
                                      e.target.checked,
                                      index
                                    )
                                  }
                                />
                              </td>
                              <td>{index + 1}</td>
                              <td>{item?.customerCode}</td>
                              <td>{item?.customerName}</td>
                              <td>{item?.customerCategory}</td>
                              <td>{item?.generalIncentive}</td>
                              <td>{item?.monthlyIncentive}</td>
                              <td className="text-center">
                                <IView
                                  title="View"
                                  clickHandler={() => {
                                    // setRow(item);
                                    // history.push({
                                    //     pathname: `/production-management/ACCLFactory/mill-production/view/${item?.intMillProductionId}`,
                                    //     state: item,
                                    // });
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                    </tbody>
                  </table>
                ) : null}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
