import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import NewSelect from "../../../../../../_helper/_select";
import useAxiosGet from "../../../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../../../_helper/_loading";
import { IInput } from "../../../../../../_helper/_input";

const DataValiadtionSchema = Yup.object().shape({});

export default function _Form({
  initData,
  saveBtnRef,
  saveData,
  resetBtnRef,
  disableHandler,
  selectedBusinessUnit,
  accountId,
  basicItemInfo,
  id = null,
}) {
  const [orgList, setOrgList] = useState("");
  useEffect(() => {
    if (selectedBusinessUnit && accountId) {
      getInfoData(selectedBusinessUnit.value, accountId);
    }
  }, [selectedBusinessUnit, accountId]);

  const getInfoData = async (buId, accId) => {
    try {
      const res = await Axios.get(
        `/item/ItemPurchaseInfo/GetPurchaseOrganizationDDL?AccountId=${accId}&BusinessUnitId=${buId}`
      );
      const { data: resData, status } = res;
      if (status === 200 && resData.length) {
        let orgs = [];
        resData.forEach((item) => {
          let items = {
            value: item?.value,
            label: item?.label,
          };
          orgs.push(items);
        });
        setOrgList(orgs);
        orgs = null;
      }
    } catch (error) {}
  };

  const [
    profitCenterDDL,
    getProfitCenterDDL,
    loaderOnProfitCenterDDL,
    setProfitCenterDDL,
  ] = useAxiosGet();

  const [
    itemSalesInformation,
    getItemSalesInformation,
    loaderOnGetItemSalesInformation,
  ] = useAxiosGet();

  useEffect(() => {
    getItemSalesInformation(
      `/item/ItemSales/GetItemSalesById?ItemSalesId=${id}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (basicItemInfo?.length > 0) {
      const api = itemSalesInformation?.length
        ? `/item/ItemPurchaseInfo/GetProfitCenterOfItemSales?itemId=${basicItemInfo[0]?.itemId}&businessUnitId=${selectedBusinessUnit?.value}`
        : `/costmgmt/ProfitCenter/GetProfitCenterInformation?AccountId=${accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`;
      getProfitCenterDDL(api, (data) => {
        if (data && data.length > 0) {
          if (itemSalesInformation?.length) {
            const firstElement = data[0];
            setProfitCenterDDL([firstElement]);
          } else {
            let modifiedProfitCenterDDL =
              data?.length &&
              data?.map((item) => {
                return {
                  value: item?.profitCenterId,
                  label: item?.profitCenterName,
                  code: item?.profitCenterCode,
                };
              });
            setProfitCenterDDL(modifiedProfitCenterDDL);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicItemInfo?.length]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          purchaseDescription: basicItemInfo
            ? basicItemInfo[0]?.itemName
            : initData?.purchaseDescription,
        }}
        validationSchema={DataValiadtionSchema}
        onSubmit={(values, { resetForm }) => {
          saveData(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {(loaderOnProfitCenterDDL || loaderOnGetItemSalesInformation) && (
              <Loading />
            )}
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <Field
                    value={values.purchaseDescription || ""}
                    name="purchaseDescription"
                    component={Input}
                    placeholder="Purchase Description"
                    label="Purchase Description"
                    disabled={!orgList}
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values.hscode || ""}
                    name="hscode"
                    component={Input}
                    placeholder="HS Code"
                    label="HS Code"
                    disabled={!orgList}
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values.maxLeadDays || ""}
                    name="maxLeadDays"
                    component={Input}
                    placeholder="Maximum Lead Days"
                    label="Maximum Lead Days"
                    type="number"
                    disabled={!orgList}
                    min="0"
                  />
                </div>

                <div className="col-lg-3">
                  <Field
                    value={values.minOrderQuantity || ""}
                    name="minOrderQuantity"
                    component={Input}
                    placeholder="Minimum Order Quantity"
                    label="Minimum Order Quantity"
                    type="number"
                    disabled={!orgList}
                    min="0"
                  />
                </div>

                <div className="col-lg-3">
                  {/* <Field
                    value={values.lotSize || ""}
                    name="lotSize"
                    component={Input}
                    placeholder="Lot Size "
                    label="Lot Size "
                    type="number"
                    onChange={(e) => {
                      if (+e.target.value > 0 || e.target.value === 0) {
                        setFieldValue("lotSize", e.target.value);
                      } else {
                        setFieldValue("lotSize", "");
                      }
                    }}
                    disabled={!orgList}
                  /> */}
                  <IInput
                    label="Lot Size"
                    value={values?.lotSize || ""}
                    name="lotSize"
                    type="number"
                    onChange={(e) => {
                      if (+e.target.value > 0 || +e.target.value === 0) {
                        setFieldValue("lotSize", e.target.value);
                      } else {
                        setFieldValue("lotSize", "");
                      }
                    }}
                    disabled={!orgList}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="profitCenter"
                    options={profitCenterDDL || []}
                    value={values?.profitCenter}
                    label="Profit Center"
                    onChange={(valueOption) => {
                      setFieldValue("profitCenter", valueOption);
                    }}
                    placeholder="Profit Center"
                  />
                </div>
                <div
                  style={{
                    marginTop: "18px",
                  }}
                  className="col-lg-3"
                >
                  <Field
                    name="isMrp"
                    component={() => (
                      <input
                        style={{
                          position: "absolute",
                          top: "7px",
                        }}
                        id="isMrp"
                        type="checkbox"
                        value={values?.isMrp || false}
                        checked={values?.isMrp || false}
                        name="isMrp"
                        disabled={!orgList}
                        onChange={(e) => {
                          setFieldValue("isMrp", e.target.checked);
                        }}
                      />
                    )}
                  />
                  <label htmlFor="isMrp" className="ml-5">
                    Include in MRP Planning?
                  </label>
                </div>
                <p className="text-danger my-2">
                  {!orgList && "Not found any purchase organization"}
                </p>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={saveBtnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
