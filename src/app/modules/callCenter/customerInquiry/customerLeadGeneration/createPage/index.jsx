import { Form, Formik } from "formik";
import React from "react";
// import { useParams } from "react-router";
import { Button } from "@material-ui/core";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import ICustomCard from "../../../../_helper/_customCard";
import FormikError from "../../../../_helper/_formikError";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import TextArea from "../../../../_helper/TextArea";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.number().required("Phone is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Email is invalid"),
  storied: Yup.object().shape({
    value: Yup.number().required("This fields is required"),
    label: Yup.string().required("This fields is required"),
  }),
  projectStatus: Yup.object().shape({
    value: Yup.number().required("Project Status is required"),
    label: Yup.string().required("Project Status is required"),
  }),
  division: Yup.object().shape({
    value: Yup.number().required("Division is required"),
    label: Yup.string().required("Division is required"),
  }),
  district: Yup.object().shape({
    value: Yup.number().required("District is required"),
    label: Yup.string().required("District is required"),
  }),
  // thana: Yup.object().shape({
  //   value: Yup.number().required("Thana is required"),
  //   label: Yup.string().required("Thana is required"),
  // }),
  shop: Yup.string().required("Shop is required"),
  retailShopAddress: Yup.string().required("Retail Shop Address is required"),
  //   businessPartner: Yup.string().required("Business Partner is required"),
  //   deliveryAddress: Yup.string().required("Delivery Address is required"),
  //   sourceOrAdvertise: Yup.object().shape({
  //     value: Yup.number().required("Source/Advertise is required"),
  //     label: Yup.string().required("Source/Advertise is required"),
  //   }),
  //   reference: Yup.object().shape({
  //     value: Yup.number().required("Reference is required"),
  //     label: Yup.string().required("Reference is required"),
  //   }),

  //   item: Yup.object().shape({
  //     value: Yup.number().required("Item is required"),
  //     label: Yup.string().required("Item is required"),
  //   }),
  //   uom: Yup.string().required("UOM is required"),
  //   quantity: Yup.number().required("Quantity is required"),
});
function CreateCustomerLeadGeneration() {
  const history = useHistory();
  const [divisionDDL, getDivisionDDL] = useAxiosGet();
  const [districtDDL, getDistrictDDL] = useAxiosGet();
  const [storiedDDL, getStoriedDDL] = useAxiosGet();
  const [projectStatusDDL, getProjectStatusDDL] = useAxiosGet();
  const [sourceOrAdvertiseDDL, getSourceOrAdvertiseDDL] = useAxiosGet();
  const [brandDDL, getBrandDDL] = useAxiosGet();
  const [shipPointDDL, getShipPointDDL] = useAxiosGet();
  const [regionDDL, getRegionDDL, , setRegionDDL] = useAxiosGet();
  const [areaDDL, getAreaDDL, , setAreaDDL] = useAxiosGet();
  const [territoryDDL, getTerritoryDDL, , setTerritoryDDL] = useAxiosGet();
  const [, SaveCustomerLeadGeneration, isLoading] = useAxiosPost();

  //   const { id } = useParams();
  const formikRef = React.useRef(null);

  const {
    profileData: { userId },
    selectedBusinessUnit,
  } = useSelector((state) => state?.authData || {}, shallowEqual);
  const saveHandler = (values, cb) => {
    const payload = {
      partName: "Suspect",
      header: {
        businessUnitId: selectedBusinessUnit?.value,
        customerAcquisitionId: 0,
        customerName: values?.name || "",
        customerEmail: values?.email || "",
        customerPhone: values?.phone || "",
        storied: values?.storied?.label || "",
        projectStatusId: values?.projectStatus?.value || 0,
        projectStatusName: values?.projectStatus?.label || "",
        divisionId: values?.division?.value || 0,
        districtId: values?.district?.value || 0,
        transportZoneId: values?.thana?.value || 0,
        // shipToPartnerId: values?.shipPoint?.value || 0,
        shipToPartnerName: values?.shop || "",
        businessPartnerId: 0,
        referenceId: values?.reference?.value || 0,
        referenceName: values?.reference?.label || "",
        deliveryAddress: values?.deliveryAddress || "",
        referralSource: values?.sourceOrAdvertise?.label || "",
        territoryId: values?.territory?.value || 0,
        areaId: values?.area?.value || 0,
        regionId: values?.region?.value || 0,
        currentStage: "Suspect",
        lastActionBy: userId || 0,
        updatedDateTime: new Date(),
        isRejected: false,
        shipPointId: values?.shipPoint?.value || 0,
        currentBrandId: values?.brand?.value || 0,
      },
      row: values?.row?.map((item) => {
        return {
          rowId: 0,
          customerAcquisitionId: 0,
          itemId: item?.item?.value || 0,
          uomId: item?.item?.uomId || 0,
          uomName: item?.item?.uomName || "",
          quantity: item?.quantity || 0,
        };
      }),
    };

    SaveCustomerLeadGeneration(
      `/oms/SalesQuotation/CreateCustomerAcquisition`,
      payload,
      () => {
        if (cb) {
          cb();
        }
      },
      "save"
    );
  };

  React.useEffect(() => {
    getDivisionDDL("/oms/TerritoryInfo/GetDivisionDDL?countryId=18");
    getStoriedDDL(
      `/oms/SalesQuotation/GetReferraSourceDDL?businessUnitId=${selectedBusinessUnit?.value}&typeId=5&referenceId=5`
    );
    getProjectStatusDDL(
      `/oms/SalesQuotation/GetReferraSourceDDL?businessUnitId=${
        selectedBusinessUnit?.value === 4 ? 4 : 0
      }&typeId=2&referenceId=2`
    );
    getSourceOrAdvertiseDDL(
      `/oms/SalesQuotation/GetReferraSourceDDL?businessUnitId=${selectedBusinessUnit?.value}&typeId=4&referenceId=4`
    );
    getBrandDDL(
      `/oms/SalesQuotation/GetReferraSourceDDL?businessUnitId=${selectedBusinessUnit?.value}&typeId=3&referenceId=3`
    );
    getShipPointDDL(
      `/wms/ShipPoint/GetShipPointDDL?accountId=1&businessUnitId=${selectedBusinessUnit?.value}`
    );
    // /oms/SalesInformation/GetUserWiseRegionAreaTerritoryDDL?businessUnitId=4&userId=204856&typeName=Region&distributionChannelId=46

    getRegionDDL(
      `/oms/SalesInformation/GetUserWiseRegionAreaTerritoryDDL?businessUnitId=${selectedBusinessUnit?.value}&userId=${userId}&typeName=Region&distributionChannelId=0`,
      (data) => {
        const modifyData = data?.map((item) => {
          return {
            ...item,
            value: item?.regionId,
            label: item?.regionName,
          };
        });
        setRegionDDL(modifyData);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDistrict = (divisionId) => {
    getDistrictDDL(
      `/oms/TerritoryInfo/GetDistrictDDL?countryId=18&divisionId=${divisionId}`
    );
  };

  const loadRef = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=1&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };
  const loadThana = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/oms/SalesQuotation/GetUserWiseShipToPartnerAndZoneDDL?partName=TransportZoneDDL&userId=${userId}&businessUnitId=${selectedBusinessUnit?.value}&districtId=${formikRef.current.values?.district?.value}&search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };
  const getArea = (regionId) => {
    getAreaDDL(
      `/oms/SalesInformation/GetUserWiseRegionAreaTerritoryDDL?businessUnitId=${selectedBusinessUnit?.value}&userId=${userId}&typeName=Area&regionId=${regionId}&distributionChannelId=0`,
      (data) => {
        const modifyData = data?.map((item) => {
          return {
            ...item,
            value: item?.areaId,
            label: item?.areaName,
          };
        });
        setAreaDDL(modifyData);
      }
    );
  };
  const getTerritory = (areaId) => {
    getTerritoryDDL(
      `/oms/SalesInformation/GetUserWiseRegionAreaTerritoryDDL?businessUnitId=${selectedBusinessUnit?.value}&userId=${userId}&typeName=Territory&regionId=${formikRef.current.values?.region?.value}&areaId=${areaId}&distributionChannelId=0`,
      (data) => {
        const modifyData = data?.map((item) => {
          return {
            ...item,
            value: item?.territoryId,
            label: item?.territoryName,
          };
        });
        setTerritoryDDL(modifyData);
      }
    );
  };
  const loadItem = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/oms/SalesQuotation/GetItemSalesByItemTypeIdDDL?businessUnitId=${selectedBusinessUnit?.value}&itemTypeId=4&search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };
  return (
    <ICustomCard
      title={"Create Customer Lead Generation"}
      backHandler={() => {
        history.goBack();
      }}
      saveHandler={(values) => {
        formikRef.current.submitForm();
      }}
      resetHandler={() => {
        formikRef.current.resetForm();
      }}
    >
      {isLoading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          name: "",
          phone: "",
          email: "",
          storied: "",
          projectStatus: "",
          division: "",
          district: "",
          thana: "",
          shop: "",
          retailShopAddress: "",
          businessPartner: "",
          deliveryAddress: "",
          sourceOrAdvertise: "",
          reference: "",
          brand: "",
          shipPoint: "",
          region: "",
          area: "",
          territory: "",
          row: [],
          item: "",
          uom: "",
          uomId: 0,
          quantity: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            {/* <h1>{JSON.stringify(errors)}</h1> */}
            <Form className="form form-label-right">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "10px",
                }}
              >
                <div className="form-group row global-form">
                  {/* name */}
                  <div className="col-lg-3">
                    <InputField
                      label="Name"
                      type="text"
                      name="name"
                      value={values?.name}
                      onChange={(e) => {
                        setFieldValue("name", e.target.value);
                      }}
                    />
                  </div>
                  {/* phone */}
                  <div className="col-lg-3">
                    <InputField
                      label="Phone"
                      type="number"
                      name="phone"
                      value={values?.phone}
                      onChange={(e) => {
                        setFieldValue("phone", e.target.value);
                      }}
                    />
                  </div>
                  {/* email */}
                  <div className="col-lg-3">
                    <InputField
                      label="Email"
                      type="email"
                      name="email"
                      value={values?.email}
                      onChange={(e) => {
                        setFieldValue("email", e.target.value);
                      }}
                    />
                  </div>
                  {/* storied */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={
                        selectedBusinessUnit?.value === 4 ? "Storied" : "Type"
                      }
                      options={storiedDDL || []}
                      value={values?.storied}
                      name="storied"
                      onChange={(valueOption) => {
                        setFieldValue("storied", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* projectStatus */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Project Status"}
                      options={projectStatusDDL || []}
                      value={values?.projectStatus}
                      name="projectStatus"
                      onChange={(valueOption) => {
                        setFieldValue("projectStatus", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* division */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Division"}
                      options={divisionDDL || []}
                      value={values?.division}
                      name="division"
                      onChange={(valueOption) => {
                        setFieldValue("division", valueOption || "");
                        setFieldValue("district", "");
                        setFieldValue("thana", "");
                        valueOption?.value && getDistrict(valueOption?.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* district */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"District"}
                      options={districtDDL || []}
                      value={values?.district}
                      name="district"
                      onChange={(valueOption) => {
                        setFieldValue("district", valueOption || "");
                        setFieldValue("thana", "");
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={values?.division?.value ? false : true}
                    />
                  </div>
                  {/* thana */}
                  <div className="col-lg-3">
                    <label>Thana</label>
                    <SearchAsyncSelect
                      selectedValue={values?.thana}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("thana", valueOption);
                      }}
                      loadOptions={loadThana}
                      isDisabled={
                        values?.division?.value && values?.district?.value
                          ? false
                          : true
                      }
                    />
                    <FormikError
                      errors={errors}
                      name={"thana"}
                      touched={touched}
                    />
                  </div>
                  {/* shop */}
                  <div className="col-lg-3">
                    <InputField
                      label="Shop"
                      type="text"
                      name="shop"
                      value={values?.shop}
                      onChange={(e) => {
                        setFieldValue("shop", e.target.value);
                      }}
                    />
                  </div>
                  {/* retailShopAddress */}
                  <div className="col-lg-6">
                    {/* <InputField
                      label="Retail Shop Address"
                      type="text"
                      name="retailShopAddress"
                      value={values?.retailShopAddress}
                      onChange={(e) => {
                        setFieldValue("retailShopAddress", e.target.value);
                      }}
                    /> */}
                    <label htmlFor="retailShopAddress">
                      Retail Shop Address
                    </label>

                    <TextArea
                      label="Retail Shop Address"
                      value={values?.retailShopAddress}
                      name="retailShopAddress"
                      placeholder="Retail Shop Address"
                      type="text"
                    />
                  </div>
                  {/* businessPartner */}
                  <div className="col-lg-3">
                    <InputField
                      label="Business Partner"
                      type="text"
                      name="businessPartner"
                      value={values?.businessPartner}
                      onChange={(e) => {
                        setFieldValue("businessPartner", e.target.value);
                      }}
                    />
                  </div>
                  {/* deliveryAddress */}
                  <div className="col-lg-3">
                    <InputField
                      label="Delivery Address"
                      type="text"
                      name="deliveryAddress"
                      value={values?.deliveryAddress}
                      onChange={(e) => {
                        setFieldValue("deliveryAddress", e.target.value);
                      }}
                    />
                  </div>
                  {/* sourceOrAdvertise */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Source/Advertise"}
                      options={sourceOrAdvertiseDDL || []}
                      value={values?.sourceOrAdvertise}
                      name="sourceOrAdvertise"
                      onChange={(valueOption) => {
                        setFieldValue("sourceOrAdvertise", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* reference */}
                  <div className="col-lg-3">
                    <label>Reference</label>
                    <SearchAsyncSelect
                      selectedValue={values?.reference}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("reference", valueOption);
                      }}
                      loadOptions={loadRef}
                    />
                  </div>
                  {/* brand */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Brand"}
                      options={brandDDL || []}
                      value={values?.brand}
                      name="brand"
                      onChange={(valueOption) => {
                        setFieldValue("brand", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* shipPoint */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Ship Point"}
                      options={shipPointDDL || []}
                      value={values?.shipPoint}
                      name="shipPoint"
                      onChange={(valueOption) => {
                        setFieldValue("shipPoint", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* region */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Region"}
                      options={regionDDL || []}
                      value={values?.region}
                      name="region"
                      onChange={(valueOption) => {
                        setFieldValue("region", valueOption || "");
                        setFieldValue("area", "");
                        setFieldValue("territory", "");
                        valueOption?.value && getArea(valueOption?.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* area */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Area"}
                      options={areaDDL || []}
                      value={values?.area}
                      name="area"
                      onChange={(valueOption) => {
                        setFieldValue("area", valueOption || "");
                        setFieldValue("territory", "");
                        valueOption?.value && getTerritory(valueOption?.value);
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={values?.region?.value ? false : true}
                    />
                  </div>
                  {/* territory */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Territory"}
                      options={territoryDDL || []}
                      value={values?.territory}
                      name="territory"
                      onChange={(valueOption) => {
                        setFieldValue("territory", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={
                        values?.area?.value && values?.region?.value
                          ? false
                          : true
                      }
                    />
                  </div>

                  <div className="col-lg-12">
                    <hr />
                    <h3>Item Information</h3>
                  </div>
                  {/* item */}

                  <div className="col-lg-3">
                    <label>Item</label>
                    <SearchAsyncSelect
                      selectedValue={values?.item}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                        valueOption &&
                          setFieldValue("uom", valueOption?.uomName);
                        setFieldValue("uomId", valueOption?.uomId || 0);
                      }}
                      loadOptions={loadItem}
                    />
                  </div>
                  {/* uom */}
                  <div className="col-lg-3">
                    <InputField
                      label="UOM"
                      type="text"
                      name="uom"
                      value={values?.uom}
                      onChange={(e) => {
                        setFieldValue("uom", e.target.value);
                      }}
                      disabled
                    />
                  </div>
                  {/* quantity */}
                  <div className="col-lg-3">
                    <InputField
                      label="Quantity"
                      type="number"
                      name="quantity"
                      value={values?.quantity}
                      onChange={(e) => {
                        setFieldValue("quantity", e.target.value);
                      }}
                    />
                  </div>
                  {/* add button */}
                  <div className="col-lg-3">
                    <button
                      type="button"
                      className="btn btn-primary  mt-5"
                      onClick={() => {
                        if (values.item === "") {
                          toast.warn("Item is required");
                          return;
                        }
                        if (values.uom === "") {
                          toast.warn("UOM is required");
                          return;
                        }
                        if (values.quantity === "") {
                          toast.warn("Quantity is required");
                          return;
                        }
                        // item is exist
                        const isExist =
                          Array.isArray(values?.row) &&
                          values.row.some(
                            (item) => item?.item?.value === values?.item?.value
                          );

                        if (isExist) {
                          toast.warn("Duplicate item not allowed");
                          return;
                        }

                        setFieldValue("row", [
                          ...values?.row,
                          {
                            item: values.item,
                            uom: values.uom,
                            uomId: values.item?.uomId,
                            quantity: values.quantity,
                          },
                        ]);
                        setFieldValue("item", "");
                        setFieldValue("uom", "");
                        setFieldValue("uomId", 0);
                        setFieldValue("quantity", "");
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
                {values?.row?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item</th>
                          <th>UOM</th>
                          <th>Quantity</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.row?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.item?.label}</td>
                            <td>{item?.uom}</td>
                            <td>{item?.quantity}</td>
                            <td>
                              <div className="d-flex justify-content-center">
                                <Button
                                  onClick={() => {
                                    const filterData = values.row.filter(
                                      (itm, indx) => indx !== index
                                    );
                                    setFieldValue("row", filterData);
                                  }}
                                  color="error"
                                  size="small"
                                  title="Remove"
                                >
                                  <IDelete />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}

export default CreateCustomerLeadGeneration;
