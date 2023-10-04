import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
const initData = {};
export default function SalesInvoiceLanding() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [customerList, getCustomerList] = useAxiosGet();
  const [itemDDL, getItemDDL] = useAxiosGet();

  useEffect(() => {
    getCustomerList(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    getItemDDL(
      `/oms/SalesOrder/GetgetServiceItemList?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {};
  const history = useHistory();
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
            title="Sales Invoice"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
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
              <div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="customer"
                      options={customerList || []}
                      value={values?.customer}
                      label="Customer"
                      onChange={(valueOption) => {
                        setFieldValue("customer", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="item"
                      options={itemDDL || []}
                      value={values?.item}
                      label="Item Name"
                      onChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div>
                    <button
                      className="btn btn-primary"
                      type="button"
                      style={{ marginTop: "17px" }}
                    >
                      Show
                    </button>
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
