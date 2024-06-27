/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router";
import ICustomCard from "../../../../_helper/_customCard";
import NewSelect from "../../../../_helper/_select";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import IButton from "../../../../_helper/iButton";
import SubsidyRateTable from "./subsidyRateTable";
import ManpowerSalesTargetFormTable from "./table";
import { _formatMoney } from "../../../../_helper/_formatMoney";

const types = [
  { value: 1, label: "Sales Target" },
  { value: 2, label: "Customer Open Target" },
  { value: 3, label: "Retailer Open Target" },
  { value: 4, label: "ShipPoint Target" },
  { value: 5, label: "Government Subsidy Rate" },
];

export default function _Form({
  buId,
  accId,
  rowData,
  getItems,
  viewType,
  initData,
  TSOList,
  itemList,
  salesOrgs,
  allSelect,
  getTSOList,
  rowDataSet,
  setRowData,
  selectedAll,
  saveHandler,
  rowDataChange,
}) {
  const history = useHistory();

  const isDisabled = (values) => {
    return (
      ([1, 2, 3].includes(values?.type?.value) && !values?.channel) ||
      (values?.type?.value !== 5 && !values?.month) ||
      !values?.year ||
      ([1, 3]?.includes(values?.type?.value) &&
        !values?.zone &&
        buId !== 144) ||
      //   ||
      // [4].includes(values?.type?.value)
      ([1]?.includes(values?.type?.value) && buId === 144 && !values?.area)
    );
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowData([]);
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
        }) => (
          <>
            <ICustomCard
              title={`Enter Manpower Sales Target`}
              backHandler={() => history.goBack()}
              resetHandler={
                viewType !== "view"
                  ? () => {
                      setRowData([]);
                      resetForm(initData);
                    }
                  : ""
              }
              saveHandler={() => {
                handleSubmit();
              }}
              saveDisabled={!rowData?.length}
            >
              <Form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="type"
                        options={types}
                        value={values?.type}
                        label="Type"
                        onChange={(valueOption) => {
                          setFieldValue("type", valueOption);
                        }}
                        placeholder="Select Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={viewType}
                      />
                    </div>

                    <YearMonthForm
                      obj={{
                        values,
                        setFieldValue,
                        month: values?.type?.value !== 5,
                      }}
                    />

                    <RATForm
                      obj={{
                        values,
                        setFieldValue,
                        region: [1, 2, 3].includes(values?.type?.value),
                        area: [1, 2, 3].includes(values?.type?.value),
                        territory:
                          [3]?.includes(values?.type?.value) ||
                          ([1]?.includes(values?.type?.value) && buId !== 144),
                        // territory: [1, 3]?.includes(values?.type?.value),
                        zone:
                          [3]?.includes(values?.type?.value) ||
                          ([1]?.includes(values?.type?.value) && buId !== 144),
                        onChange: (allValues, fieldName) => {
                          if (fieldName === "area") {
                            getTSOList(
                              `/oms/Complains/GetTerritoryOfficerDDL?accountId=${accId}&businessUnitId=${buId}&distributionChannelId=${
                                allValues?.channel?.value
                              }&territoryId=${0}&regionId=${allValues?.region
                                ?.value || 0}&areaId=${allValues?.area?.value ||
                                0}`
                            );
                          }
                        },
                      }}
                    />

                    {/* {[1]?.includes(values?.type?.value) && buId === 144 && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="tso"
                          options={TSOList || []}
                          value={values?.tso}
                          label="Territory Sales Officer"
                          onChange={(valueOption) => {
                            setFieldValue("tso", valueOption);
                          }}
                          placeholder="Territory Sales Officer"
                          errors={errors}
                          touched={touched}
                          isDisabled={viewType || !values?.territory}
                        />
                      </div>
                    )} */}

                    {values?.type?.value === 4 && (
                      <>
                        <div className="col-lg-3">
                          <NewSelect
                            name="salesOrg"
                            options={salesOrgs || []}
                            value={values?.salesOrg}
                            label="Sales Organization"
                            onChange={(valueOption) => {
                              setFieldValue("salesOrg", valueOption);
                              getItems({
                                ...values,
                                salesOrg: valueOption,
                              });
                            }}
                            placeholder="Select Sales Organization"
                            errors={errors}
                            touched={touched}
                            isDisabled={viewType || !values?.channel}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="item"
                            options={itemList || []}
                            value={values?.item}
                            label="Item"
                            onChange={(valueOption) => {
                              setFieldValue("item", valueOption);
                            }}
                            placeholder="Select Item"
                            errors={errors}
                            touched={touched}
                            isDisabled={viewType || !values?.salesOrg}
                          />
                        </div>
                      </>
                    )}

                    <IButton
                      disabled={isDisabled(values)}
                      onClick={() => {
                        rowDataSet(values);
                      }}
                    >
                      View
                    </IButton>
                  </div>
                </div>
              </Form>
              {rowData?.filter((item) => item?.isSelected)?.length > 0 ? (
                <p className="text-right" style={{ marginLeft: "-20px" }}>
                  <b>
                    Total Qnt:{" "}
                    {_formatMoney(
                      rowData
                        ?.filter((item) => item?.isSelected)
                        ?.reduce((acc, i) => acc + +i?.targetQty || 0, 0)
                    )}
                  </b>{" "}
                </p>
              ) : null}
              <ManpowerSalesTargetFormTable
                obj={{
                  buId,
                  values,
                  rowData,
                  allSelect,
                  selectedAll,
                  rowDataChange,
                }}
              />
              {[5].includes(values?.type?.value) && (
                <SubsidyRateTable
                  obj={{
                    allSelect,
                    selectedAll,
                    rowDataChange,
                    rowData,
                  }}
                />
              )}
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}
