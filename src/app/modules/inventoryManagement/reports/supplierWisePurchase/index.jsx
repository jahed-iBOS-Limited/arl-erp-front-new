import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "./../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  supplier: "",
};
export default function SupplierWisePurchase() {
  const [rowData, getRowDto, loading, setRowDto] = useAxiosGet();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = (values, cb) => {};
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
          <Form className="form form-label-right">
            {loading && <Loading />}
            <IForm
              title="Supplier Wise Purchase"
              isHiddenReset
              isHiddenBack
              isHiddenSave
            >
              <div className="global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    label="From Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e?.target?.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    label="To Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e?.target?.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Supplier Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.supplier}
                    handleChange={(valueOption) => {
                      setFieldValue("supplier", valueOption);
                    }}
                    placeholder="Search..."
                    loadOptions={(v) => {
                      const searchValue = v.trim();
                      if (searchValue?.length < 3) return [];
                      return axios
                        .get(
                          `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=0`
                        )
                        .then((res) => [
                          { value: 0, label: "All" },
                          ...res?.data,
                        ]);
                    }}
                  />
                </div>
                <div>
                  <button
                    style={{ marginTop: "18px" }}
                    type="button"
                    class="btn btn-primary"
                    disabled={!values?.fromDate || !values?.toDate}
                    onClick={() => {
                      getRowDto(
                        `/wms/GrnStatement/SupplierWisePurchaseReport?&BusinessUnitId=${
                          selectedBusinessUnit?.value
                        }&SupplierId=${values?.supplier?.value || 0}&FromDate=${
                          values?.fromDate
                        }&ToDate=${values?.toDate}`,
                        (data) => {
                          let sl = 0;
                          let arr = [];
                          data.forEach((item) => {
                            let obj = {
                              ...item,
                              isShow: sl === item?.sectionSL ? false : true,
                            };
                            if (sl !== item?.sectionSL) {
                              sl = item?.sectionSL;
                            }
                            arr.push(obj);
                          });
                          setRowDto(arr);
                        }
                      );
                    }}
                  >
                    Show
                  </button>
                </div>
              </div>
              <div className="row mt-5">
                <div className="col-lg-12 cost-of-production">
                <div className="table-responsive">
                  <table
                    id="table-to-xlsx"
                    className="table table-striped table-bordered bj-table bj-table-landing"
                  >
                    <thead>
                      <tr>
                        <th>Supplier Name</th>
                        <th>Item Code</th>
                        <th>Item Name</th>
                        <th>UoM</th>
                        <th>Qty</th>
                        <th>Rate</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.length > 0 &&
                        rowData.map((item, index) => (
                          <tr key={index}>
                            {item?.isShow ? (
                              <>
                                <td
                                  className="text-center"
                                  rowSpan={item?.sectionCount}
                                >
                                  {item?.supplierName}
                                </td>
                              </>
                            ) : null}
                            <td className="text-center">{item?.itemCode}</td>
                            <td className="text-left">{item?.itemName}</td>
                            <td className="text-left">{item?.uoMName}</td>
                            <td className="text-center">{item?.quantity}</td>
                            <td className="text-center">
                              {_formatMoney(item?.rate)}
                            </td>
                            <td className="text-center">
                              {_formatMoney(item?.value)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                </div>
              </div>
            </IForm>
          </Form>
        </>
      )}
    </Formik>
  );
}
