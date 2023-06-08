import React from "react";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";

export const OthersInfo = ({ values, setFieldValue, errors, touched,attributes }) => {
  const renderFields = (item, values, setFieldValue, errors, touched) => {
    if (item?.objAttribute?.uicontrolType === "DDL") {
      return (
        <div className="col-lg-3">
          {/* <label>{item.objAttribute.outletAttributeName}{item?.objAttribute.isMandatory && "*" }</label> */}
          <NewSelect
            label={item.objAttribute.outletAttributeName + ( item?.objAttribute.isMandatory && "*")}
            name={item.objAttribute.outletAttributeName}
            options={item.objAttributeValue}
            value={values[item.objAttribute.outletAttributeName] || {}}
            onChange={(valueOption) => {
              setFieldValue(item.objAttribute.outletAttributeName, valueOption);
            }}
           // placeholder={item.objAttribute.outletAttributeName}
            errors={errors}
            touched={touched}
          />
        </div>
      );
    }

    if (item?.objAttribute?.uicontrolType === "Date") {
      return (
        <div className="col-lg-3">
          <label>{item.objAttribute.outletAttributeName}{item?.objAttribute.isMandatory && "*" }</label>
          <InputField
            value={values[item.objAttribute.outletAttributeName]}
            name={item.objAttribute.outletAttributeName}
            placeholder={item.objAttribute.outletAttributeName}
            type="date"
            errors={errors}
            touched={touched}
          />
        </div>
      );
    }

    if (item?.objAttribute?.uicontrolType === "Number") {
      return (
        <div className="col-lg-3">
          <label>{item.objAttribute.outletAttributeName}{item?.objAttribute.isMandatory && "*" }</label>
          <InputField
            value={values[item.objAttribute.outletAttributeName]}
            name={item.objAttribute.outletAttributeName}
            placeholder={item.objAttribute.outletAttributeName}
            type="number"
            errors={errors}
            touched={touched}
            min="0"
          />
        </div>
      );
    }

    if (item?.objAttribute?.uicontrolType === "TextBox") {
      return (
        <div className="col-lg-3">
          <label>{item.objAttribute.outletAttributeName}{item?.objAttribute.isMandatory && "*" }</label>
          <InputField
            value={values[item.objAttribute.outletAttributeName] || ""}
            name={item.objAttribute.outletAttributeName}
            placeholder={item.objAttribute.outletAttributeName}
            type="text"
            errors={errors}
            touched={touched}
          />
        </div>
      );
    }
  };

  return (
    <div className="row">
     {attributes.map((item) =>
                  renderFields(item, values, setFieldValue, errors, touched)
                )}
    </div>
  );
};
