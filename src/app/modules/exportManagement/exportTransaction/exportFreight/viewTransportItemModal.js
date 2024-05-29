// import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
// import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
// import { _dateFormatter } from "../../../_helper/_dateFormate";
import axios from "axios";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

export default function ViewJournal({ transportItem, sbuId }) {
  const saveHandler = (values, cb) => {};
  const initData = {};
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const [, exportTrasnport, exportTransportLoader] = useAxiosPost();

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        freightProviderName: {
          label: transportItem?.freightProviderName,
          value: transportItem?.freightProviderId,
        },
      }}
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
          {exportTransportLoader && <Loading />}
          <IForm
            title=""
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
                      const payload = [
                        {
                          autoId: transportItem?.autoId,
                          accountId: transportItem?.accountId,
                          accountingJournalId:
                            transportItem?.accountingJournalId,
                          accountingJournalCode:
                            transportItem?.accountingJournalCode,
                          businessUnitId: transportItem?.businessUnitId,
                          sbuid: transportItem?.sbuid,
                          businesspartnerId: transportItem?.businesspartnerId,
                          businesspartnerName:
                            transportItem?.businesspartnerName,
                          freightProviderId: values?.freightProviderName?.value,
                          freightProviderName:
                            values?.freightProviderName?.label,
                          freightProviderType:
                            transportItem?.freightProviderType || "",
                          freightAmount: transportItem?.freightAmount,
                          salesOrderId: transportItem?.salesOrderId,
                          narration: transportItem?.narration,
                        },
                      ];
                      console.log(payload);
                      exportTrasnport(
                        `/oms/SalesOrder/SaveExportTransportProviderInfo`,
                        payload,
                        "",
                        true
                      );
                    }}
                  >
                    Save
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="row">
                <div className="col-lg-12">
                <div className="table-responsive">
                <table className="table table-striped table-bordered global-table sales_order_landing_table">
                    <thead>
                      <tr>
                        <th>Journal Code</th>
                        <th>Business Partner Name</th>
                        <th>Sales Order Code</th>
                        <th>Freight Amount</th>
                        <th>Freight ProviderName</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{transportItem?.accountingJournalCode}</td>
                        <td>{transportItem?.businesspartnerName}</td>
                        <td>{transportItem?.salesOrderCode}</td>
                        <td>{transportItem?.freightAmount}</td>
                        <td>
                          <SearchAsyncSelect
                            selectedValue={values?.freightProviderName}
                            handleChange={(valueOption) => {
                              setFieldValue("freightProviderName", valueOption);
                            }}
                            loadOptions={(v) => {
                              if (v.length < 3) return [];
                              return axios
                                .get(
                                  `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${
                                    profileData?.accountId
                                  }&UnitId=${
                                    selectedBusinessUnit?.value
                                  }&SBUId=${0}`
                                )
                                .then((res) => {
                                  const updateList = res?.data.map((item) => ({
                                    ...item,
                                  }));
                                  return updateList;
                                });
                            }}
                          />
                        </td>
                      </tr>
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
