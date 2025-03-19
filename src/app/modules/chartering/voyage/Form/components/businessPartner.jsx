import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getStakeholderNameByTypeId } from "../../../helper";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import IDelete from "../../../_chartinghelper/icons/_delete";
import ICustomTable from "../../../_chartinghelper/_customTable";

export default function BusinessPartner({
  values,
  businessPartnerTypeDDL,
  setFieldValue,
  viewType,
  errors,
  touched,
  setErrors,
  setTouched,

  businessPartnerNameDDL,
  setBusinessPartnerNameDDL,
  businessPartnerGrid,
  setBusinessPartnerGrid,
}) {
  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const addItemHandler = (values, setFieldValue) => {
    if (
      businessPartnerGrid?.find(
        (item) =>
          item?.stakeholderTypeId === values?.businessPartnerType?.value &&
          item?.stakeholderId === values?.businessPartnerName?.value
      )
    ) {
      toast.warn("Item already added");
    } else {
      const newItem = {
        stakeholderTypeId: values?.businessPartnerType?.value,
        stakeholderTypeName: values?.businessPartnerType?.label,
        stakeholderId: values?.businessPartnerName?.value,
        stakeholderName: values?.businessPartnerName?.label,
      };
      setBusinessPartnerGrid([...businessPartnerGrid, newItem]);
      setFieldValue("businessPartnerName", "");
      setFieldValue("businessPartnerType", "");
    }
  };
  const removeItem = (index) => {
    setBusinessPartnerGrid(businessPartnerGrid.filter((_, i) => i !== index));
  };

  return (
    <>
      {viewType !== "view" ? (
        <div className="marine-form-card-content">
          <div className="row">
            <div className="col-lg-3">
              <FormikSelect
                value={values?.businessPartnerType || ""}
                isSearchable={true}
                options={businessPartnerTypeDDL || []}
                styles={customStyles}
                name="businessPartnerType"
                placeholder="Service Type"
                // placeholder="Business Partner Type"
                label="Service Type"
                onChange={(valueOption) => {
                  setFieldValue("businessPartnerName", "");
                  setFieldValue("businessPartnerType", valueOption);
                  getStakeholderNameByTypeId(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    valueOption?.value,
                    setBusinessPartnerNameDDL
                  );
                }}
                isDisabled={viewType === "view"}
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-3">
              <FormikSelect
                value={values?.businessPartnerName || ""}
                isSearchable={true}
                options={businessPartnerNameDDL || []}
                styles={customStyles}
                name="businessPartnerName"
                placeholder="Vendor Name"
                // placeholder="Business Partner Name"
                label="Vendor Name"
                onChange={(valueOption) => {
                  setFieldValue("businessPartnerName", valueOption);
                }}
                isDisabled={viewType === "view"}
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-1 mt-5 px-0">
              <button
                className="btn btn-primary px-3 py-2"
                type="button"
                onClick={() => {
                  if (
                    !values?.businessPartnerName?.value ||
                    !values?.businessPartnerType?.value
                  ) {
                    setTouched({
                      businessPartnerName: true,
                      businessPartnerType: true,
                    });
                    window.setTimeout(() => {
                      setErrors({
                        businessPartnerName:
                          !values?.businessPartnerName?.value &&
                          "Business Partner Name is required",
                        businessPartnerType:
                          !values?.businessPartnerType?.value &&
                          "Business Partner Type is required",
                      });
                    }, 50);
                  } else {
                    addItemHandler(values, setFieldValue);
                  }
                }}
              >
                Add +
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* New Grid For Business Partner Type */}
      <div className="col-lg-7 px-0">
        {businessPartnerGrid?.length > 0 ? (
          <div>
            <ICustomTable
              ths={[
                { name: "SL" },
                { name: "Business Partner Type" },
                { name: "Business Partner Name" },
                { name: "Action", isHide: viewType === "view" },
              ]}
            >
              <>
                {businessPartnerGrid?.map((item, index) => (
                  <tr>
                    <td style={{ maxWidth: "30px" }} className="text-center">
                      {index + 1}
                    </td>
                    <td>{item?.stakeholderTypeName}</td>
                    <td>{item?.stakeholderName}</td>
                    {viewType !== "view" ? (
                      <td className="text-center">
                        <span onClick={() => removeItem(index)}>
                          <IDelete />
                        </span>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </>
            </ICustomTable>
          </div>
        ) : null}
      </div>
    </>
  );
}
