import { Formik } from "formik";
import React from "react";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import BrandItemRequisitionEntryTable from "./table";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import TextArea from "../../../../_helper/TextArea";
import IButton from "../../../../_helper/iButton";

export default function _Form({
  initData,
  rowData,
  saveHandler,
  itemCategoryDDL,
  getItemsByCategory,
  itemDDL,
  UOMDDL,
  addRow,
  removeRow,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values) => {
          saveHandler(values);
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <ICustomCard title="Brand Item Requisition Entry">
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
                  />
                </div>
                <RATForm obj={{ values, setFieldValue }} />
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
                    value={values?.date}
                    label="Date"
                    placeholder="Date"
                    type="date"
                    name="date"
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
                  <label>Description</label>
                  <TextArea
                    name="description"
                    placeholder="Description"
                    value={values?.description}
                    rows="4"
                  />
                </div>
                <IButton>Add</IButton>
              </div>
              <BrandItemRequisitionEntryTable obj={{ rowData, removeRow }} />
            </form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
