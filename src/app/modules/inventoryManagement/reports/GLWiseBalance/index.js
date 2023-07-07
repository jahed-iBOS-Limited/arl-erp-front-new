import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
const initData = {
  date: _todayDate(),
  reportType: "",
  businessUnit: "",
};
export default function GLWiseBalance() {
  const [buDDL, getBuDDL] = useAxiosGet();
  const [rowDto, getRowDto, loading] = useAxiosGet();

  useEffect(() => {
    getBuDDL(`/hcm/HCMDDL/GetBusinessunitDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {loading && <Loading />}
          <IForm
            title="GL Wise Balance"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={buDDL || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    options={[
                      { value: 0, label: "Summary" },
                      { value: 1, label: "Details" },
                    ]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setFieldValue("reportType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label="Date"
                    type="date"
                    name="date"
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                    }}
                  />
                </div>
                <div className="mt-5 ml-5">
                  <button
                    type="button"
                    disabled={
                      !values?.date ||
                      !values?.businessUnit ||
                      !values?.reportType
                    }
                    onClick={() => {
                      getRowDto(
                        `/fino/Report/GetGlWiseInventoryReport?intBusinessUnitId=${values?.businessUnit?.value}&dteToDate=${values?.date}&reportType=${values?.reportType?.value}`
                      );
                    }}
                    className="btn btn-primary"
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Business Unit</th>
                      <th>Warehouse</th>
                      <th>General Ledger</th>
                      <th>Item</th>
                      <th>Value</th>
                      <th>Closing Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.length > 0 &&
                      rowDto.map((item, index) => (
                        <tr className="bg-light">
                          <td>{index + 1}</td>
                          <td>{item?.strBusinessUnitName}</td>
                          <td>{item?.strWarehouseName}</td>
                          <td>{item?.strGeneralLedgerName}</td>
                          <td>{item?.strItemName}</td>
                          <td className="text-center">{item?.totalValue}</td>
                          <td className="text-center">{item?.numCloseQty}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
