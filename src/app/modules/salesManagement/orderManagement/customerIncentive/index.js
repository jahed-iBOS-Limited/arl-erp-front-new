import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IConfirmModal from "../../../_helper/_confirmModal";
import { _formatMoney } from "../../../_helper/_formatMoney";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import useDebounce from "../../../_helper/customHooks/useDebounce";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";

const initData = {
  customerCategory: "",
  monthYear: "",
  incentiveType: "",
  searchText: "",
  fromDate: "",
  toDate: "",
  per1: "",
  per2: "",
  amount: "",
};

export default function CustomerIncentive() {
  const debounce = useDebounce();
  const [searchValue, setSearchValue] = useState("");
  const [percentageList, setPercentageList] = useState([]);
  // const [headingSelect, setHeadingSelect] = useState(false);
  const [, saveData, saveLoader] = useAxiosPost();
  const [isAbove, setIsAbove] = useState(false);
  const [
    tradeCommission,
    getTradeCommission,
    loadTradeCommission,
    setTradeCommission,
  ] = useAxiosGet();

  const [targetData, getTargetData, loader, setTargetData] = useAxiosPost();

  //redux store
  const { value: buId } = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const { userId } = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);
  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  // check user permission
  let permission = null;
  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 1347) {
      permission = userRole[i];
    }
  }

  // get filtered trade commission on search
  const filteredTradeCommission = useMemo(() => {
    return tradeCommission?.filter(
      (item) =>
        item?.customerName?.toLowerCase().includes(searchValue?.trim()) ||
        item?.customerCode?.toString().includes(searchValue?.trim())
    );
  }, [tradeCommission, searchValue]);

  // handle all trade commission list select
  const handleAllSelect = (value) => {
    setTradeCommission((prev) => {
      const updatedTradeCommission = prev?.map((item) => {
        return item?.isJvPosted ? item : { ...item, isSelect: value };
      });
      return updatedTradeCommission;
    });
  };

  // handle row slection on change
  const handleRowSelection = (value, currentItem, index) => {
    setTradeCommission((prev) => {
      const newTradeCommissionData = [...prev];
      newTradeCommissionData[index] = { ...currentItem, isSelect: value };
      return newTradeCommissionData;
    });
  };

  // count total value
  const countTotal = (key) => {
    return tradeCommission?.reduce((previousValue, currentValue) => {
      return previousValue + currentValue?.[key];
    }, 0);
  };

  // save handler
  const saveHandler = (values, cb) => {
    const selectedTradeCommission = [];
    // eslint-disable-next-line no-unused-expressions
    tradeCommission?.forEach((item) => {
      if (item?.isSelect) {
        const newItem = {
          incentiveType: item?.incentiveType || "",
          customerId: item?.customerId || 0,
          customerCode: item?.customerCode || "",
          deliveryQty: item?.deliveryQty || 0,
          amount: item?.incentiveAmount || 0,
          dteDate: item?.dteDate || "",
          businessUnitId: buId,
          actionBy: userId,
          fromRange: item?.fromRange,
          toRange: item?.toRange,
          inputAmount: item?.inputAmount,
        };
        // eslint-disable-next-line no-unused-expressions
        selectedTradeCommission?.push(newItem);
      }
    });
    IConfirmModal({
      title: "Are you sure?",
      message: "Are you sure want to post this JV?",
      yesAlertFunc: () => {
        saveData(
          `/oms/SalesInformation/CreateTradeCommission`,
          selectedTradeCommission,
          cb,
          true
        );
      },
      noAlertFunc: () => {},
    });
  };

  // get trade commission api handler
  const getTradeCommissionHandler = (values) => {
    const payload = ["DeliveryIncentive(WithAmount)"].includes(
      values?.incentiveType?.value
    )
      ? [
          {
            per1: 0,
            per2: 0,
            amount: +values?.amount,
            isAbove: false,
          },
        ]
      : percentageList;

    if (
      ["WithTarget", "WithoutTarget", "DeliveryIncentive(WithAmount)"].includes(
        values?.incentiveType?.value
      )
    ) {
      let url = `/oms/SalesInformation/GetTradeCommissionTarget?partName=${values?.incentiveType?.value}&businessUnitId=${buId}&customerId=0&fromDate=${values?.fromDate}&toDate=${values?.toDate}`;
      getTargetData(url, payload, (res) => {
        setTradeCommission(res);
      });
    } else if (values?.incentiveType?.value === "Performance") {
      getTradeCommission(
        `oms/SalesInformation/GetTradeCommissionForPerformance?businessUnitId=${buId}&customerId=0&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&customerCategory=${values?.customerCategory?.value}&incentiveType=${values?.incentiveType?.value}`
      );
    } else {
      getTradeCommission(
        `/oms/SalesInformation/GetTradeCommission?partName=GetForCreate&businessUnitId=${buId}&customerId=0&monthYear=${values?.monthYear}-01&customerCategory=${values?.customerCategory?.value}&incentiveType=${values?.incentiveType?.value}`
      );
    }
  };

  const modifyIncentiveTypeOptions = (values) => {
    const customerCategoryLabel = values?.customerCategory?.label;

    if (["All"].includes(customerCategoryLabel)) {
      return [
        { value: "General", label: "General" },
        { value: "Delivery", label: "Delivery" },
        { value: "Performance", label: "Performance Bonus" },
        { value: "WithTarget", label: "With Target" },
        { value: "WithoutTarget", label: " Without Target" },
        {
          value: "DeliveryIncentive(WithAmount)",
          label: "Delivery Incentive (WithAmount)",
        },
      ];
    } else if (["Cash", "Credit", "Credit (100% BG)"].includes(customerCategoryLabel)) {
      return [{ value: "Monthly", label: "Monthly" }];
    } else {
      return [];
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setFieldValue }) => {
        saveHandler(values, () => {
          setFieldValue("searchText", "");
          setSearchValue("");
          getTradeCommissionHandler(values);
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
          {(loadTradeCommission || saveLoader) && <Loading />}
          <IForm
            title="Customer Incentive"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {}}
          >
            <Form>
              <div className="global-form align-items-center">
                <div className="row">
                  <div className="col-md-3">
                    <NewSelect
                      name="customerCategory"
                      label="Customer Category"
                      options={[
                        { value: "All", label: "All" },
                        { value: "Cash", label: "Cash" },
                        { value: "Credit", label: "Credit" },
                        { value: "BG", label: "Credit (100% BG)" },
                      ]}
                      value={values?.customerCategory}
                      onChange={(valueOption) => {
                        setFieldValue("customerCategory", valueOption);
                        setFieldValue("incentiveType", "");
                        setFieldValue("per1", "");
                        setFieldValue("per2", "");
                        setFieldValue("amount", "");
                        setTradeCommission([]);
                        setPercentageList([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-md-3">
                    <NewSelect
                      name="incentiveType"
                      label="Incentive Type"
                      options={modifyIncentiveTypeOptions(values)}
                      value={values?.incentiveType}
                      onChange={(valueOption) => {
                        setFieldValue("incentiveType", valueOption);
                        setTradeCommission([]);
                        setPercentageList([]);
                        setFieldValue("per1", "");
                        setFieldValue("per2", "");
                        setFieldValue("amount", "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {["Performance"].includes(values?.incentiveType?.value) ? (
                    <>
                      <div className="col-lg-3">
                        <label>From Month-Year</label>
                        <InputField
                          name="fromMonthYear"
                          type="month"
                          placeholder="From Date"
                          value={values?.fromMonthYear}
                          onChange={(e) => {
                            setFieldValue("fromMonthYear", e?.target?.value);
                            setFieldValue("fromDate", `${e?.target?.value}-01`);
                            setTradeCommission([]);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>To Month-Year</label>
                        <InputField
                          name="toMonthYear"
                          type="month"
                          placeholder="From Date"
                          value={values?.toMonthYear}
                          onChange={(e) => {
                            setFieldValue("toMonthYear", e?.target?.value);
                            setTradeCommission([]);

                            if (e.target.value) {
                              const [year, month] = e?.target?.value
                                ?.split("-")
                                .map(Number);
                              const nextMonthFirstDay = new Date(
                                year,
                                month,
                                1
                              );
                              const lastDateOfMonth = new Date(
                                nextMonthFirstDay - 1
                              );
                              const formattedLastDate = lastDateOfMonth
                                .toISOString()
                                .split("T")[0];
                              setFieldValue("toDate", formattedLastDate || "");
                            }
                          }}
                        />
                      </div>
                    </>
                  ) : [
                      "WithTarget",
                      "WithoutTarget",
                      "DeliveryIncentive(WithAmount)",
                    ].includes(values?.incentiveType?.value) ? (
                    <>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.fromDate}
                          label="From Date"
                          name="fromDate"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("fromDate", e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.toDate}
                          label="To Date"
                          name="toDate"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("toDate", e.target.value);
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="col-lg-3">
                      <label>Month-Year</label>
                      <InputField
                        name="monthYear"
                        type="month"
                        placeholder="From Date"
                        value={values?.monthYear}
                        onChange={(e) => {
                          setFieldValue("monthYear", e?.target?.value);
                          setTradeCommission([]);
                        }}
                      />
                    </div>
                  )}
                </div>

                {["WithTarget", "WithoutTarget"].includes(
                  values?.incentiveType?.value
                ) ? (
                  <>
                    <div className="row">
                      <div className="col-lg-3">
                        <InputField
                          value={values?.per1}
                          label={
                            values?.incentiveType?.value === "WithTarget"
                              ? "From Percentage "
                              : "From Quantity"
                          }
                          name="per1"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("per1", e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-1 mt-5">
                        <input
                          className="mt-3"
                          type="checkbox"
                          checked={isAbove}
                          onChange={(e) => {
                            setIsAbove(!isAbove);
                            setFieldValue("per2", "");
                            if (e.target.checked) {
                              setFieldValue("per2", 1000);
                            }
                          }}
                        />
                        <label style={{ position: "relative", bottom: "4px" }}>
                          Is Above
                        </label>
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.per2}
                          label={
                            values?.incentiveType?.value === "WithTarget"
                              ? "To Percentage"
                              : "To Quantity"
                          }
                          name="per2"
                          type="number"
                          disabled={values?.isAbove}
                          onChange={(e) => {
                            setFieldValue("per2", e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.amount}
                          label="Amount"
                          name="amount"
                          type="number"
                          onChange={(e) => {
                            setFieldValue("amount", e.target.value);
                          }}
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          className="btn btn-primary mt-5"
                          disabled={
                            !values?.per1 || !values?.per2 || !values?.amount
                          }
                          onClick={() => {
                            if (percentageList?.find((item) => item?.isAbove)) {
                              return toast.warn(
                                "You cann't add now because you alredy add IsAbove"
                              );
                            }
                            const data = {
                              per1: +values?.per1,
                              per2: +values?.per2,
                              amount: +values?.amount,
                              isAbove: isAbove,
                            };
                            setPercentageList([...percentageList, data]);
                            setFieldValue("per1", "");
                            setFieldValue("per2", "");
                            setFieldValue("amount", "");
                            setIsAbove(false);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="row mt-4">
                      <div className="col-6">
                        <div className="table-responsive">
                          <table className="table table-striped table-bordered bj-table bj-table-landing">
                            <thead>
                              <tr>
                                <th>
                                  {values?.incentiveType?.value === "WithTarget"
                                    ? "From Percentage "
                                    : "From Quantity"}
                                </th>
                                <th>
                                  {values?.incentiveType?.value === "WithTarget"
                                    ? "To Percentage "
                                    : "To Quantity "}
                                </th>
                                <th>Amount</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {percentageList.map((item, index) => (
                                <tr key={index}>
                                  <td className="text-center">{item?.per1}</td>
                                  <td className="text-center">{item?.per2}</td>
                                  <td className="text-center">
                                    {item?.amount}
                                  </td>
                                  <td className="text-center">
                                    <span
                                      onClick={() => {
                                        const data = percentageList.filter(
                                          (item, i) => i !== index
                                        );
                                        setPercentageList(data);
                                      }}
                                    >
                                      <IDelete />
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
                <div className="row">
                  {["DeliveryIncentive(WithAmount)"].includes(
                    values?.incentiveType?.value
                  ) && (
                    <div className="col-lg-3">
                      <InputField
                        value={values?.amount}
                        label="Amount"
                        name="amount"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("amount", e.target.value);
                        }}
                      />
                    </div>
                  )}
                  <div className="col-md-3 d-flex mt-3" style={{ gap: "10px" }}>
                    <div>
                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={() => getTradeCommissionHandler(values)}
                        disabled={
                          !values?.customerCategory ||
                          !values?.incentiveType ||
                          (["WithTarget", "WithoutTarget"].includes(
                            values?.incentiveType?.value
                          ) &&
                            !percentageList?.length)
                        }
                      >
                        View
                      </button>
                    </div>
                    <div>
                      {tradeCommission?.length > 0 && (
                        <ReactHtmlTableToExcel
                          className="btn btn-primary mt-2"
                          table="table-to-xlsx"
                          filename="Customer Incentive"
                          sheet="Sheet-1"
                          buttonText="Export Excel"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-between">
                  <div className="input-group" style={{ width: "25%" }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Serach Customer Name"
                      value={values?.searchText}
                      onChange={(e) => {
                        const newValue = e?.target?.value;
                        setFieldValue("searchText", newValue);
                        debounce(() => {
                          setSearchValue(newValue);
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          setSearchValue(e?.target?.value);
                        }
                      }}
                      disabled={tradeCommission?.length === 0}
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setSearchValue(searchValue);
                        }}
                        disabled={tradeCommission?.length === 0}
                      >
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                  <div>
                    {tradeCommission?.some((item) => item?.isSelect) &&
                      permission?.isCreate && (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleSubmit}
                        >
                          JV Posting
                        </button>
                      )}
                  </div>
                </div>
                {tradeCommission?.length > 0 ? (
                  <table
                    id="table-to-xlsx"
                    className="table table-striped table-bordered global-table"
                  >
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            name="isSelect"
                            checked={tradeCommission?.every(
                              (item) => item?.isSelect
                            )}
                            onChange={(e) =>
                              handleAllSelect(e?.target?.checked)
                            }
                            disabled={!permission?.isCreate}
                          />
                        </th>
                        <th>SL</th>
                        <th>Incentive Type</th>
                        <th>Customer Code</th>
                        <th>Customer Name</th>
                        <th>Customer Category</th>
                        <th>UoM</th>
                        <th>
                          {values?.incentiveType?.value === "Performance"
                            ? "Avg Delivery Qty"
                            : "Delivery Qty"}
                        </th>
                        {[
                          "WithTarget",
                          "WithoutTarget",
                          "DeliveryIncentive(WithAmount)",
                        ].includes(values?.incentiveType?.value) && (
                          <th>Target Quantity</th>
                        )}
                        {/* <th>Total Delivery Qty</th> */}
                        {![
                          "WithTarget",
                          "WithoutTarget",
                          "DeliveryIncentive(WithAmount)",
                        ].includes(values?.incentiveType?.value) ? (
                          <>
                            {" "}
                            <th>Opening Balance</th>
                            <th>Sales Amount</th>
                            <th>Collection Amount</th>
                            <th>Balance</th>
                          </>
                        ) : null}
                        <th>Amount</th>
                        <th>Is JV Posted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTradeCommission?.length > 0 &&
                        filteredTradeCommission?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                name="isSelect"
                                checked={Boolean(item?.isSelect)}
                                onChange={(e) =>
                                  handleRowSelection(
                                    e?.target?.checked,
                                    item,
                                    index
                                  )
                                }
                                disabled={
                                  item?.isJvPosted || !permission?.isCreate
                                }
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td>{item?.incentiveType}</td>
                            <td className="text-center">
                              {item?.customerCode || ""}
                            </td>
                            <td>{item?.customerName || ""}</td>
                            <td>{item?.customerCategory || ""}</td>
                            <td className="text-center">{item?.uom || ""}</td>
                            <td className="text-right">
                              {item?.deliveryQty || 0}
                            </td>
                            {[
                              "WithTarget",
                              "WithoutTarget",
                              "DeliveryIncentive(WithAmount)",
                            ].includes(values?.incentiveType?.value) && (
                              <td className="text-right">
                                {item?.targetQuantity || 0}
                              </td>
                            )}
                            {/* <td className="text-right">
                              {item?.totalDeliveryQTY || 0}
                            </td> */}
                            {![
                              "WithTarget",
                              "WithoutTarget",
                              "DeliveryIncentive(WithAmount)",
                            ].includes(values?.incentiveType?.value) ? (
                              <>
                                {" "}
                                <td className="text-right">
                                  {_formatMoney(item?.openingBalance)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.salesAmount)}
                                </td>
                                <td className="text-right">
                                  {_formatMoney(item?.collectionAmount)}
                                </td>{" "}
                                <td className="text-right">
                                  {_formatMoney(item?.balance)}
                                </td>
                              </>
                            ) : null}
                            <td className="text-right">
                              {_formatMoney(item?.incentiveAmount)}
                            </td>
                            <td className="text-center">
                              {item?.isJvPosted ? "Yes" : "No"}
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td
                          className="font-weight-bold text-left ml-2"
                          colSpan={7}
                        >
                          Total
                        </td>
                        <td className="font-weight-bold text-right">
                          {countTotal("deliveryQty")}
                        </td>
                        {[
                          "WithTarget",
                          "WithoutTarget",
                          "DeliveryIncentive(WithAmount)",
                        ].includes(values?.incentiveType?.value) && (
                          <td className="font-weight-bold text-right">
                            {countTotal("targetQuantity")}
                          </td>
                        )}
                        {![
                          "WithTarget",
                          "WithoutTarget",
                          "DeliveryIncentive(WithAmount)",
                        ].includes(values?.incentiveType?.value) ? (
                          <>
                            <td className="font-weight-bold text-right">
                              {_formatMoney(countTotal("openingBalance"))}
                            </td>
                            <td className="font-weight-bold text-right">
                              {_formatMoney(countTotal("salesAmount"))}
                            </td>
                            <td className="font-weight-bold text-right">
                              {_formatMoney(countTotal("collectionAmount"))}
                            </td>{" "}
                            <td className="font-weight-bold text-right">
                              {countTotal("balance")}
                            </td>
                          </>
                        ) : null}
                        <td className="font-weight-bold text-right">
                          {_formatMoney(countTotal("incentiveAmount"))}
                        </td>
                        <td className="text-center">-</td>
                      </tr>
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
