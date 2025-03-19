import { Form, Formik } from "formik";
import React from "react";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _formatMoney } from "../../../_helper/_formatMoney";
const initData = {
  poLc: "",
  shipment: "",
  partner: "",
};
export default function LcCostSheetPartnerWise() {
  const [shipmentDdl, getShipmentDdl, shipmentDdlLoader] = useAxiosGet();
  const [
    partnerDdl,
    getPartnerDdl,
    partnerDdlLoader,
    setPartnerDdl,
  ] = useAxiosGet();
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const loadPoLc = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/imp/ImportCommonDDL/GetPONOLcNoforLCSummeryDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
      )
      .then((res) => res?.data);
  };
  const saveHandler = (values, cb) => {};
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
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
          {(shipmentDdlLoader || partnerDdlLoader || tableDataLoader) && (
            <Loading />
          )}
          <IForm
            title="LC Cost Sheet Partner Wise"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <label>PO/LC No</label>
                  <SearchAsyncSelect
                    selectedValue={values?.poLc}
                    handleChange={(valueOption) => {
                      setFieldValue("poLc", valueOption);
                      if (valueOption) {
                        getShipmentDdl(
                          `/imp/ImportCommonDDL/GetInfoFromPoLcDDL?accId=${profileData?.accountId}&buId=${selectedBusinessUnit?.value}&searchTerm=${valueOption?.label}`
                        );
                        setTableData([]);
                      } else {
                        setFieldValue("shipment", "");
                        setFieldValue("partner", "");
                        setTableData([]);
                      }
                    }}
                    loadOptions={loadPoLc || []}
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shipment"
                    options={shipmentDdl || []}
                    value={values?.shipment}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setTableData([]);
                        setFieldValue("shipment", valueOption);
                        getPartnerDdl(
                          `/imp/ImportCommonDDL/GetPartnerDDLShipmentWise?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PurchaseOrderId=${values?.poLc?.value}&ShipmentId=${valueOption?.value}`,
                          (data) => {
                            setPartnerDdl([
                              { value: 0, label: "All" },
                              ...data,
                            ]);
                          }
                        );
                      } else {
                        setFieldValue("shipment", "");
                        setFieldValue("partner", "");
                        setTableData([]);
                      }
                    }}
                    placeholder="Shipment"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="partner"
                    options={partnerDdl || []}
                    value={values?.partner}
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("partner", valueOption);
                        setTableData([]);
                      } else {
                        setFieldValue("shipment", "");
                        setFieldValue("partner", "");
                        setTableData([]);
                      }
                    }}
                    placeholder="Partner"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    type="button"
                    style={{ marginTop: "17px" }}
                    onClick={() => {
                      getTableData(
                        `/imp/ImportCommonDDL/GetLCCostPartnerWiseReport?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PurchaseOrderId=${values?.poLc?.value}&ShipmentId=${values?.shipment?.value}&PartnerId=${values?.partner?.value}`
                      );
                    }}
                    className="btn btn-primary"
                    disabled={
                      !values?.poLc || !values?.shipment || !values?.partner
                    }
                  >
                    Show
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <div className="react-bootstrap-table table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Particulars</th>
                          <th>Estimated VAT</th>
                          <th>Estimated Amount</th>
                          <th>Actual VAT</th>
                          <th>Actual Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.costType}</td>
                            <td className="text-right">
                              {_formatMoney(item?.vatAmount)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numEstimatedTotalAmount)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.actualVATAmount)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numActualTotalAmount)}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td className="font-weight-bold" colSpan="2">
                            Total
                          </td>
                          <td className="text-right">
                            {_formatMoney(
                              tableData?.reduce((a, b) => a + b?.vatAmount, 0)
                            )}
                          </td>
                          <td className="text-right">
                            {_formatMoney(
                              tableData?.reduce(
                                (a, b) => a + b?.numEstimatedTotalAmount,
                                0
                              )
                            )}
                          </td>
                          <td className="text-right">
                            {_formatMoney(
                              tableData?.reduce(
                                (a, b) => a + b?.actualVATAmount,
                                0
                              )
                            )}
                          </td>
                          <td className="text-right">
                            {_formatMoney(
                              tableData?.reduce(
                                (a, b) => a + b?.numActualTotalAmount,
                                0
                              )
                            )}
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
