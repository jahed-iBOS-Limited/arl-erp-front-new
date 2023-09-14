import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import useDebounce from "../../../_helper/customHooks/useDebounce";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _formatMoney } from "../../../_helper/_formatMoney";

const initData = {
  customerCategory: "",
  monthYear: "",
  incentiveType: "",
  searchText: "",
};

export default function CustomerIncentive() {
  const debounce = useDebounce();
  const [searchValue, setSearchValue] = useState("");
  const [headingSelect, setHeadingSelect] = useState(false);
  const [, saveData, saveLoader] = useAxiosPost();
  const [
    tradeCommission,
    getTradeCommission,
    loadTradeCommission,
    setTradeCommission,
  ] = useAxiosGet();

  //selected business unit from redux store
  const { value: buId } = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const { userId } = useSelector((state) => {
    return state?.authData?.profileData;
  }, shallowEqual);

  // get filtered trade commission on search
  const filteredTradeCommission = useMemo(() => {
    return tradeCommission?.filter(
      (item) =>
        item?.customerName?.toLowerCase().includes(searchValue?.trim()) ||
        item?.customerCode?.toString().includes(searchValue?.trim())
    );
  }, [tradeCommission, searchValue]);

  // handle row slection on change
  const handleRowSelection = (key, value, currentItem) => {
    const newTradeCommissionData = [...tradeCommission];
    currentItem[key] = value;
    setTradeCommission(newTradeCommissionData);
    setHeadingSelect(newTradeCommissionData?.every((item) => item?.isSelect));
  };

  // save handler
  const saveHandler = (values, cb) => {
    const selectedTradeCommission = [];
    // eslint-disable-next-line no-unused-expressions
    tradeCommission?.forEach((item) => {
      if (item?.isSelect) {
        const newItem = {
          incentiveType: values?.incentiveType?.value,
          customerId: item?.customerId,
          customerCode: item?.customerCode,
          amount: item?.incentiveAmount,
          dteDate: `${values?.monthYear}-01`,
          businessUnitId: buId,
          actionBy: userId,
        };
        // eslint-disable-next-line no-unused-expressions
        selectedTradeCommission?.push(newItem);
      }
    });

    if (selectedTradeCommission?.length > 0) {
      saveData(`/oms/SalesInformation/CreateTradeCommission`, selectedTradeCommission, cb, true);
    } else {
      toast.warn("No item selected!");
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm();
          setSearchValue("");
          setTradeCommission([]);
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
                      onClick={() => {
                        getTradeCommission(
                          `/oms/SalesInformation/GetTradeCommission?partName=GetForCreate&businessUnitId=${buId}&customerId=0&monthYear=${values?.monthYear}-01&customerCategory=${values?.customerCategory?.value}&incentiveType=${values?.incentiveType?.value}`
                        );
                      }}
                      disabled={
                        !values?.customerCategory || !values?.incentiveType || !values?.monthYear
                      }
                    >
                      View
                    </button>
                  </div>
                  <div>
                    <button type="button" className="btn btn-primary" onClick={() => {}} disabled>
                      Excel
                    </button>
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
                    {tradeCommission?.some((item) => item?.isSelect) && (
                      <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                        JV Posting
                      </button>
                    )}
                  </div>
                </div>
                {tradeCommission?.length > 0 ? (
                  <table
                    style={{ maxHeight: "400px", overflow: "scroll" }}
                    className="table table-striped table-bordered global-table"
                  >
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            name="isSelect"
                            checked={headingSelect}
                            onChange={(e) => {
                              setHeadingSelect(e?.target?.checked);
                              const updatedTradeCommission = tradeCommission?.map((item) => {
                                if (item?.isJvPosted) {
                                  return item;
                                } else {
                                  return {
                                    ...item,
                                    isSelect: e?.target?.checked,
                                  };
                                }
                              });
                              setTradeCommission(updatedTradeCommission);
                            }}
                          />
                        </th>
                        <th>SL</th>
                        <th>Customer Code</th>
                        <th>Customer Name</th>
                        <th>Customer Category</th>
                        <th>Delivery Qty</th>
                        <th>
                          {values?.incentiveType?.value === "General"
                            ? "General Incentive"
                            : "Monthly Incentive"}
                        </th>
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
                                  handleRowSelection("isSelect", e?.target?.checked, item)
                                }
                                disabled={item?.isJvPosted}
                              />
                            </td>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.customerCode}</td>
                            <td>{item?.customerName}</td>
                            <td>{item?.customerCategory}</td>
                            <td className="text-right">{item?.deliveryQty}</td>
                            <td className="text-right">{_formatMoney(item?.incentiveAmount)}</td>
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
