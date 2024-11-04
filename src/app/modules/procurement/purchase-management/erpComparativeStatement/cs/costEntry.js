/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { CardHeaderToolbar } from "../../../../../../_metronic/_partials/controls";
import { eProcurementBaseURL } from "../../../../../App";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const initData = {
  productName: "",
  finishedGood: "",
};

const validationSchema = Yup.object().shape({
  //   productName: Yup.string().required("Product Name is required"),
  //   finishedGood: Yup.string().required("Finished Good is required"),
});
const CostEntry = ({ costEntryList, dataList, CB, isView, rfqId }) => {
  console.log(dataList, "2nd dataList");
  const [, saveData, tagFGloading] = useAxiosPost();
  const [productInfo, getProductInfo, productInfoLoading] = useAxiosGet();
  const [
    costEntryListFromAPI,
    getCostEntryList,
    costEntryListLoading,
  ] = useAxiosGet();

  const [objProps, setObjprops] = useState({});
  const [
    costHeadDDL,
    getCostHeadDDL,
    costHeadDDLLoading,
    setCostHeadDDL,
  ] = useAxiosGet();
  const [
    currencyDDL,
    getCurrencyDDL,
    currencyDDLLoading,
    setCurrencyDDL,
  ] = useAxiosGet();
  const [rowData, setRowData] = useState(costEntryList || []);
  const location = useLocation();

  const history = useHistory();

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const { selectedBusinessUnit, profileData } = useSelector(
    (state) => state.authData,
    shallowEqual
  );
  useEffect(() => {
    if (isView) {
      setRowData([]);
      getCostEntryList(
        `${eProcurementBaseURL}/ComparativeStatement/GetByCostComponentPartner?RequestForQuotationId=${rfqId}`,
        (data) => {
          let modDataList = [];
          data?.map((item) => {
            console.log(item, "item");
            modDataList.push({
              supplierName: {
                value: item?.intBusinessPartnerId,
                label: item?.strBusinessPartnerName,
                info: { ...item },
              },
              costHead: {
                value: item?.intCostComponentId,
                label: item?.strCostComponentName,
              },
              currency: {
                value: item?.intCurrencyId,
                label: item?.strCurrencyCode,
              },
              amount: item?.numAmount,
            });
          });
          setRowData([...modDataList]);
        }
      );
    } else {
      getCostHeadDDL(
        `${eProcurementBaseURL}/ComparativeStatement/GetByCostComponentByUnit?BusinessUnitId=${selectedBusinessUnit?.value}`,
        (res) => {
          const modData = res?.map((item) => {
            return {
              ...item,
              value: item?.intCostComponentId,
              label: item?.strCostComponentName,
            };
          });
          setCostHeadDDL(modData);
        }
      );

      getCurrencyDDL(
        `${eProcurementBaseURL}/EProcurement/GetBaseCurrencyListDDL`
      );
    }
  }, []);

  const saveHandler = (values) => {
    CB(rowData);
  };

  const addNewFeatureHandler = (values) => {
    // Check if the combination of supplier and cost head already exists
    console.log("values", values);
    console.log("rowData", rowData);
    let foundData = rowData?.filter(
      (item) =>
        item?.supplierName?.value === values?.supplierName?.value &&
        item?.costHead?.value === values?.costHead?.value
    );

    if (foundData?.length > 0) {
      toast.warning(
        "Cost element with this supplier and cost head already exists",
        {
          toastId: "duplicateEntry",
        }
      );
    } else {
      // Create payload with all form fields
      let payload = {
        supplierName: values?.supplierName,
        costHead: values?.costHead,
        currency: values?.currency,
        amount: parseFloat(values?.amount) || 0,
        // Generate a unique ID for the row if needed
        id: Date.now(),
      };

      // Add new row to the existing data
      setRowData([...rowData, payload]);
    }
  };

  const handleDelete = (rowItem) => {
    const filterData = rowData.filter(
      (item) =>
        !(
          item.supplierName?.value === rowItem.supplierName?.value &&
          item.costHead?.value === rowItem.costHead?.value
        )
    );

    setRowData(filterData);
  };
  const getSupplier = () => {
    let data = [];
    if (dataList?.firstSelectedItem) {
      data.push({
        value: dataList?.firstSelectedItem?.businessPartnerId,
        label: dataList?.firstSelectedItem?.businessPartnerName,
        info: { ...dataList?.firstSelectedItem },
      });
    }

    if (dataList?.secondSelectedItem) {
      data.push({
        value: dataList?.secondSelectedItem?.businessPartnerId,
        label: dataList?.secondSelectedItem?.businessPartnerName,
        info: { ...dataList?.secondSelectedItem },
      });
    }

    return data;
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {(tagFGloading || productInfoLoading || costEntryListLoading) && (
              <Loading />
            )}
            {!isView && (
              <>
                <Form className="global-form form form-label-right">
                  <div className="form-group row">
                    {/* <div className="col-lg-3">
                  <InputField
                    value={values?.costElementName}
                    label="Cost Element Name"
                    name="costElementName"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("costElementName", e.target.value)
                    }
                  />
                </div> */}

                    <div className="col-lg-3">
                      <NewSelect
                        name="supplier"
                        options={getSupplier() || []}
                        value={values?.supplierName}
                        label="Supplier"
                        onChange={(valueOption) => {
                          setFieldValue("supplierName", valueOption);
                        }}
                        placeholder="supplierName"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="costHead"
                        options={costHeadDDL || []}
                        value={values?.costHead}
                        label="Cost Head"
                        onChange={(valueOption) => {
                          setFieldValue("costHead", valueOption);
                        }}
                        placeholder="Cost Head"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="currency"
                        options={currencyDDL || []}
                        value={values?.currency}
                        label="Currency"
                        onChange={(valueOption) => {
                          setFieldValue("currency", valueOption);
                        }}
                        placeholder="Currency"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.amount}
                        label="Amount"
                        name="amount"
                        type="number"
                        onChange={(e) =>
                          setFieldValue("amount", e.target.value)
                        }
                      />
                    </div>

                    <div className="col-lg-3 pt-6">
                      <button
                        type="button"
                        disabled={
                          !values?.supplierName ||
                          !values?.costHead ||
                          !values?.currency ||
                          !values?.amount
                        }
                        className="btn btn-primary"
                        onClick={() => {
                          addNewFeatureHandler(values);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{ display: "none" }}
                    ref={objProps.btnRef}
                    onSubmit={() => handleSubmit()}
                  ></button>

                  <button
                    type="reset"
                    style={{ display: "none" }}
                    ref={objProps.resetBtnRef}
                    onSubmit={() => resetForm(initData)}
                  ></button>
                </Form>
                <CardHeaderToolbar>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => saveHandler()}
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </>
            )}

            <div className="table-responsive pt-5">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                {rowData?.length > 0 && (
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Supplier</th>
                      <th>Cost Head</th>
                      <th>Currency</th>
                      <th>Amount</th>
                      {!isView && <th>Action</th>}
                    </tr>
                  </thead>
                )}
                <tbody>
                  {rowData?.length > 0 &&
                    rowData?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ width: "15px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td>
                            <span className="pl-2 text-center">
                              {item?.supplierName?.label}
                            </span>
                          </td>
                          <td>
                            <span className="pl-2 text-center">
                              {item?.costHead?.label}
                            </span>
                          </td>
                          <td>
                            <span className="pl-2 text-center">
                              {item?.currency?.label}
                            </span>
                          </td>
                          <td>
                            <span className="pl-2 text-center">
                              {item?.amount}
                            </span>
                          </td>
                          {!isView && (
                            <td>
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handleDelete(item);
                                }}
                              >
                                <IDelete />
                              </span>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Formik>
    </>
  );
};

export default CostEntry;
