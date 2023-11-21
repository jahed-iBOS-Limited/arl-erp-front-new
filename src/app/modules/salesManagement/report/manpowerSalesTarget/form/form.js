/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import IButton from "../../../../_helper/iButton";
import SubsidyRateTable from "./subsidyRateTable";

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
      ([1, 3]?.includes(values?.type?.value) && !values?.zone) ||
      (([4].includes(values?.type?.value) ||
        ([1]?.includes(values?.type?.value) && buId === 144)) &&
        !values?.item)
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
                        territory: [1, 3]?.includes(values?.type?.value),
                        zone:
                          [3]?.includes(values?.type?.value) ||
                          ([1]?.includes(values?.type?.value) && buId !== 144),
                        onChange: (allValues, fieldName) => {
                          if (fieldName === "territory") {
                            getTSOList(
                              `/oms/Complains/GetTerritoryOfficerDDL?accountId=${accId}&businessUnitId=${buId}&distributionChannelId=${allValues?.channel?.value}&territoryId=${allValues?.territory?.value}`
                            );
                          }
                        },
                      }}
                    />

                    {[1]?.includes(values?.type?.value) && buId === 144 && (
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
                    )}

                    {values?.type?.value === 4 ||
                      ([1]?.includes(values?.type?.value) && buId === 144 && (
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
                      ))}

                    <IButton
                      disabled={isDisabled(values)}
                      onClick={() => {
                        rowDataSet(values);
                      }}
                    >
                      {buId === 144 ? "Add" : "View"}
                    </IButton>
                  </div>
                </div>
              </Form>
              {rowData?.length > 0 &&
                [1, 2, 3, 4].includes(values?.type?.value) && (
                  <table
                    className={
                      "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                    }
                  >
                    <thead>
                      <tr className="cursor-pointer">
                        <th
                          className="text-center cursor-pointer"
                          style={{ width: "40px" }}
                          onClick={() => allSelect(!selectedAll())}
                        >
                          <input
                            type="checkbox"
                            value={selectedAll()}
                            checked={selectedAll()}
                            onChange={() => {}}
                          />
                        </th>
                        <th>SL</th>
                        {[1, 2, 3].includes(values?.type?.value) ? (
                          <>
                            <th>Employee Name</th>
                            <th>Employee ID</th>
                          </>
                        ) : (
                          <th>ShipPoint</th>
                        )}
                        {[1, 3]?.includes(values?.type?.value) && (
                          <th>Zone Name</th>
                        )}
                        <th>Target Qty</th>
                      </tr>
                    </thead>
                    {rowData?.map((row, index) => (
                      <tr key={index}>
                        <td
                          onClick={() => {
                            rowDataChange(index, "isSelected", !row.isSelected);
                          }}
                          className="text-center"
                        >
                          <input
                            type="checkbox"
                            value={row?.isSelected}
                            checked={row?.isSelected}
                            // onChange={() => {}}
                          />
                        </td>
                        <td className="text-center" style={{ width: "40px" }}>
                          {index + 1}
                        </td>
                        {[1, 2, 3].includes(values?.type?.value) ? (
                          <>
                            <td>{row?.employeeName}</td>
                            <td>{row?.employeeId}</td>
                          </>
                        ) : (
                          <td>{row?.label}</td>
                        )}
                        {[1, 3]?.includes(values?.type?.value) && (
                          <td>{row?.zoneName}</td>
                        )}
                        <td className="text-right" style={{ width: "150px" }}>
                          <InputField
                            value={row?.targetQty}
                            name="targetQty"
                            type="number"
                            errors={errors}
                            touched={touched}
                            onChange={(e) => {
                              rowDataChange(
                                index,
                                "targetQty",
                                e?.target?.value
                              );
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </table>
                )}
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
