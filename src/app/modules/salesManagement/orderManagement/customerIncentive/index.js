import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import useDebounce from "../../../_helper/customHooks/useDebounce";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _formatMoney } from "../../../_helper/_formatMoney";
import IConfirmModal from "../../../_helper/_confirmModal";

const initData = {
  customerCategory: "",
  monthYear: "",
  incentiveType: "",
  searchText: "",
};

export default function CustomerIncentive() {
  const debounce = useDebounce();
  const [searchValue, setSearchValue] = useState("");
  // const [headingSelect, setHeadingSelect] = useState(false);
  const [, saveData, saveLoader] = useAxiosPost();
  const [
    tradeCommission,
    getTradeCommission,
    loadTradeCommission,
    setTradeCommission,
  ] = useAxiosGet();

  //redux store
  const { value: buId } = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const { userId } = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);
  const userRole = useSelector((state) => state?.authData?.userRole, shallowEqual);

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
        };
        // eslint-disable-next-line no-unused-expressions
        selectedTradeCommission?.push(newItem);
      }
    });
    IConfirmModal({
      title: "Are you sure?",
      message: "Are you sure want to post this JV?",
      yesAlertFunc: () => {
        saveData(`/oms/SalesInformation/CreateTradeCommission`, selectedTradeCommission, cb, true);
      },
      noAlertFunc: () => {},
    });
  };

  // get trade commission api handler
  const getTradeCommissionHandler = (values) => {
    getTradeCommission(
      `/oms/SalesInformation/GetTradeCommission?partName=GetForCreate&businessUnitId=${buId}&customerId=0&monthYear=${values?.monthYear}-01&customerCategory=${values?.customerCategory?.value}&incentiveType=${values?.incentiveType?.value}`
    );
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
      {({ handleSubmit, resetForm, values, setFieldValue, isValid, errors, touched }) => (
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
              <div className="row global-form align-items-center">
                <div className="col-md-3">
                  <NewSelect
                    name="customerCategory"
                    label="Customer Category"
                    options={[
                      { value: "All", label: "All" },
                      { value: "Platinum", label: "Platinum" },
                      { value: "Gold", label: "Gold" },
                    ]}
                    value={values?.customerCategory}
                    onChange={(valueOption) => {
                      setFieldValue("customerCategory", valueOption);
                      setTradeCommission([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-md-3">
                  <NewSelect
                    name="incentiveType"
                    label="Incentive Type"
                    options={[
                      { value: "General", label: "General" },
                      { value: "Monthly", label: "Monthly" },
                      { value: "Delivery", label: "Delivery" },
                    ]}
                    value={values?.incentiveType}
                    onChange={(valueOption) => {
                      setFieldValue("incentiveType", valueOption);
                      setTradeCommission([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
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
                <div className="col-md-3 d-flex" style={{ gap: "10px" }}>
                  <div>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => getTradeCommissionHandler(values)}
                      disabled={
                        !values?.customerCategory || !values?.incentiveType || !values?.monthYear
                      }
                    >
                      View
                    </button>
                  </div>
                  <div>
                    {tradeCommission?.length > 0 && (
                      <ReactHtmlTableToExcel
                        className="btn btn-primary"
                        table="table-to-xlsx"
                        filename="Customer Incentive"
                        sheet="Sheet-1"
                        buttonText="Export Excel"
                      />
                    )}
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
                    {tradeCommission?.some((item) => item?.isSelect) && permission?.isCreate && (
                      <button type="button" className="btn btn-primary" onClick={handleSubmit}>
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
                            checked={tradeCommission?.every((item) => item?.isSelect)}
                            onChange={(e) => handleAllSelect(e?.target?.checked)}
                            disabled={!permission?.isCreate}
                          />
                        </th>
                        <th>SL</th>
                        <th>Customer Code</th>
                        <th>Customer Name</th>
                        <th>Customer Category</th>
                        <th>UoM</th>
                        <th>Delivery Qty</th>
                        <th>
                          {values?.incentiveType?.value === "General"
                            ? "General Incentive"
                            : "Monthly Incentive"}
                        </th>
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
                                  handleRowSelection(e?.target?.checked, item, index)
                                }
                                disabled={item?.isJvPosted || !permission?.isCreate}
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.customerCode || ""}</td>
                            <td>{item?.customerName || ""}</td>
                            <td>{item?.customerCategory || ""}</td>
                            <td className="text-center">{item?.uom || ""}</td>
                            <td className="text-right">{item?.deliveryQty || 0}</td>
                            <td className="text-right">{_formatMoney(item?.incentiveAmount)}</td>
                            <td className="text-center">{item?.isJvPosted ? "Yes" : "No"}</td>
                          </tr>
                        ))}
                      <tr>
                        <td className="font-weight-bold text-left ml-2" colSpan={6}>
                          Total
                        </td>
                        <td className="font-weight-bold text-right">{countTotal("deliveryQty")}</td>
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
