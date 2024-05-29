import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import SearchAsyncSelect from "../../../../../_helper/SearchAsyncSelect";
import IForm from "../../../../../_helper/_form";
import FormikError from "../../../../../_helper/_formikError";
import Loading from "../../../../../_helper/_loading";
import useAxiosGet from "../../../purchaseOrder/customHooks/useAxiosGet";
const initData = {
  item: "",
};
export default function CostEfficientSupplierList() {
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [rowData, getRowData, loder, setRowData] = useAxiosGet();

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          {loder && <Loading />}
          <IForm
            title="Cost Efficient Supplier List"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <label>Item</label>
                  <SearchAsyncSelect
                    selectedValue={values?.parts}
                    handleChange={(valueOption) => {
                      setFieldValue("item", valueOption || "");
                    }}
                    loadOptions={(v) => {
                      if (v?.length < 3) return [];
                      return axios
                        .get(
                          `/item/ItemBasic/GetPurchaseItemDDLByUnit?businessUnitId=${selectedBusinessUnit?.value}&search=${v}`
                        )
                        .then((res) =>
                          res?.data?.map((item) => ({
                            ...item,
                            value: item?.itemId,
                            label: item?.itemName,
                          }))
                        );
                    }}
                  />
                  <FormikError
                    errors={errors}
                    name="assetNo"
                    touched={touched}
                  />
                </div>
                <div>
                  <button
                    disabled={!values?.item}
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: "17px" }}
                    onClick={() => {
                      getRowData(
                        `/wms/InventoryTransaction/GetSupplierListWithRanks?businessUnitId=${selectedBusinessUnit?.value}&itemId=${values?.item?.value}`
                      );
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.length > 0 &&
                        rowData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.code}</td>
                            <td>{item?.name}</td>
                            <td>{item?.type}</td>
                            <td className="text-center">{item?.rank}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  </div>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
