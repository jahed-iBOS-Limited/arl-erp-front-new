import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import IButton from "../../../../_helper/iButton";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import FormikError from "../../../../_helper/_formikError";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

export default function _Form({
  type,
  accId,
  buId,
  addRow,
  removeRow,
  title,
  rowDto,
  typeList,
  vessels,
  history,
  setRowDto,
  portDDL,
  initData,
  lighters,
  saveHandler,
  shipPointDDL,
  destinationDDL,
  onChangeHandler,
}) {
  const loadOptions = async (v) => {
    await [];
    if (v.length < 3) return [];
    return axios
      .get(
        `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${0}`
      )
      .then((res) => {
        const updateList = res?.data.map((item) => ({
          ...item,
        }));
        return [...updateList];
      });
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, errors, touched, resetForm }) => (
          <ICustomCard
            title={title}
            backHandler={() => {
              history.goBack();
            }}
            resetHandler={
              type === "view"
                ? false
                : () => {
                    resetForm(initData);
                  }
            }
            saveHandler={
              type === "view"
                ? false
                : () => {
                    saveHandler(values, () => {
                      resetForm(initData);
                      setRowDto([]);
                    });
                  }
            }
          >
            <Form className="form form-label-right">
              <div className="row global-form global-form-custom">
                <div className="col-lg-3">
                  <NewSelect
                    name="destination"
                    options={destinationDDL}
                    value={values?.destination}
                    label="Lighter Destination"
                    onChange={(e) => {
                      onChangeHandler("destination", values, e, setFieldValue);
                    }}
                    placeholder="Lighter Destination"
                    isDisabled={type === "view"}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="port"
                    options={portDDL || []}
                    value={values?.port}
                    label="Port"
                    onChange={(e) => {
                      onChangeHandler("port", values, e, setFieldValue);
                    }}
                    placeholder="Port"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="motherVessel"
                    options={vessels || []}
                    value={values?.motherVessel}
                    label="Mother Vessel"
                    onChange={(e) => {
                      onChangeHandler("motherVessel", values, e, setFieldValue);
                    }}
                    placeholder="Mother Vessel"
                    errors={errors}
                    touched={touched}
                    isDisabled={
                      type === "view" || !values?.port || !values?.destination
                    }
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="lighterVessel"
                    options={lighters}
                    value={values?.lighterVessel}
                    label="Lighter Vessel"
                    onChange={(e) => {
                      onChangeHandler(
                        "lighterVessel",
                        values,
                        e,
                        setFieldValue
                      );
                    }}
                    placeholder="Lighter"
                    errors={errors}
                    touched={touched}
                    isDisabled={type === "view" || !values?.motherVessel}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Supplier Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.supplier}
                    handleChange={(valueOption) => {
                      setFieldValue("supplier", valueOption);
                    }}
                    loadOptions={loadOptions}
                  />
                  <FormikError
                    errors={errors}
                    name="supplier"
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shipPoint"
                    options={shipPointDDL}
                    value={values?.shipPoint}
                    label="ShipPoint"
                    onChange={(e) => {
                      onChangeHandler("shipPoint", values, e, setFieldValue);
                    }}
                    placeholder="ShipPoint"
                    errors={errors}
                    touched={touched}
                    isDisabled={type === "view"}
                  />
                </div>
                <YearMonthForm obj={{ values, setFieldValue }} />
              </div>

              {!type === "view" && (
                <div className="row global-form global-form-custom">
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={typeList}
                      value={values?.type}
                      label="Type"
                      onChange={(e) => {
                        onChangeHandler("type", values, e, setFieldValue);
                      }}
                      placeholder="Type"
                      errors={errors}
                      touched={touched}
                      isDisabled={type === "view"}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="soldToPartner"
                      options={[
                        { value: 73244, label: "G2G BADC" },
                        { value: 73245, label: "G2G BCIC" },
                      ]}
                      value={values?.soldToPartner}
                      label="Business Partner"
                      onChange={(e) => {
                        setFieldValue("soldToPartner", e);
                      }}
                      placeholder="Business Partner"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Item</label>
                    <SearchAsyncSelect
                      selectedValue={values?.item}
                      handleChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                      }}
                      placeholder="Search Item"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `/wms/FertilizerOperation/GetItemListDDL?AccountId=${accId}&BusinessUinitId=${buId}&CorporationType=${values?.soldToPartner?.value}&SearchTerm=${searchValue}`
                          )
                          .then((res) => res?.data);
                      }}
                      isDisabled={!values?.soldToPartner}
                    />
                    <FormikError
                      errors={errors}
                      name="item"
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      name="quantity"
                      label="Quantity"
                      type="number"
                      placeholder="Quantity"
                      value={values?.quantity}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      name="rate"
                      label="Rate"
                      type="number"
                      placeholder="Rate"
                      value={values?.rate}
                    />
                  </div>
                  <IButton
                    colSize={"col-lg-1"}
                    onClick={() => {
                      addRow(values, () => {
                        setFieldValue("item", "");
                        setFieldValue("quantity", "");
                        setFieldValue("rate", "");
                        setFieldValue("type", "");
                        setFieldValue("soldToPartner", "");
                      });
                    }}
                    disabled={
                      !values?.type || !values?.rate || !values?.quantity
                    }
                  >
                    Add
                  </IButton>
                </div>
              )}
              <>
                {rowDto?.length > 0 && (
                  <div className="scroll-table _table">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table mt-0">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Description</th>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, i) => {
                            return (
                              <tr>
                                <td>{i + 1}</td>
                                <td>{item?.typeName}</td>
                                <td>{item?.itemName}</td>
                                <td className="text-right">{item?.quantity}</td>
                                <td className="text-right">{item?.rate}</td>
                                <td className="text-right">{item?.amount}</td>
                                <td className="text-center">
                                  <IDelete id={i} remover={removeRow} />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            </Form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
