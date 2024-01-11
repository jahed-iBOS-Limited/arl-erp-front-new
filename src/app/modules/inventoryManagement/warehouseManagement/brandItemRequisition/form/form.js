import { Formik } from "formik";
import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import BrandItemRequisitionEntryTable from "./table";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import TextArea from "../../../../_helper/TextArea";
import IButton from "../../../../_helper/iButton";
import { useHistory } from "react-router-dom";

export default function _Form({
  type,
  title,
  addRow,
  UOMDDL,
  itemDDL,
  rowData,
  initData,
  removeRow,
  saveHandler,
  itemCategoryDDL,
  getItemsByCategory,
}) {
  const history = useHistory();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue, resetForm }) => (
          <ICustomCard
            title={title}
            backHandler={() => history.goBack()}
            resetHandler={
              type === "view"
                ? ""
                : () => {
                    resetForm();
                  }
            }
            saveHandler={
              type === "view"
                ? ""
                : () => {
                    saveHandler(values, () => {
                      resetForm();
                    });
                  }
            }
          >
            <form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="programType"
                    options={[
                      { value: 1, label: "Masson Program" },
                      { value: 2, label: "Cash Program" },
                      { value: 3, label: "Market Development" },
                    ]}
                    value={values?.programType}
                    label="Program Type"
                    onChange={(valueOption) => {
                      setFieldValue("programType", valueOption);
                    }}
                    placeholder="Program Type"
                    errors={errors}
                    touched={touched}
                    isDisabled={rowData?.length || type === "view"}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.purpose}
                    label="Purpose"
                    placeholder="Purpose"
                    type="text"
                    name="purpose"
                    disabled={type === "view"}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.requiredDate}
                    label="Required Date"
                    placeholder="Date"
                    type="date"
                    name="requiredDate"
                    disabled={type === "view"}
                  />
                </div>
                {type !== "view" && (
                  <>
                    <div className="col-lg-12">
                      <hr />
                    </div>
                    <RATForm
                      obj={{
                        values,
                        setFieldValue,
                        channelDisable: rowData?.length,
                        regionDisable: rowData?.length,
                        areaDisable: rowData?.length,
                      }}
                    />
                    <div className="col-lg-3">
                      <NewSelect
                        name="itemCategory"
                        options={itemCategoryDDL || []}
                        value={values?.itemCategory}
                        label="Item Category"
                        onChange={(valueOption) => {
                          setFieldValue("itemCategory", valueOption);
                          getItemsByCategory({
                            ...values,
                            itemCategory: valueOption,
                          });
                        }}
                        placeholder="Item Category"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="item"
                        options={itemDDL || []}
                        value={values?.item}
                        label="Item"
                        onChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                        }}
                        placeholder="Item"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.itemCategory}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="uom"
                        options={UOMDDL || []}
                        value={values?.uom}
                        label="UOM"
                        onChange={(valueOption) => {
                          setFieldValue("uom", valueOption);
                        }}
                        placeholder="UOM"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.quantity}
                        label="Quantity"
                        placeholder="Quantity"
                        type="text"
                        name="quantity"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Remarks</label>
                      <TextArea
                        name="description"
                        placeholder="Description"
                        value={values?.description}
                        rows="3"
                      />
                    </div>
                    <IButton
                      disabled={
                        !values?.territory ||
                        !values?.item ||
                        !values?.uom ||
                        !values?.quantity
                      }
                      onClick={() => {
                        addRow(values);
                      }}
                    >
                      Add
                    </IButton>
                  </>
                )}
              </div>
              <BrandItemRequisitionEntryTable
                obj={{ rowData, removeRow, type }}
              />
            </form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
