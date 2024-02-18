import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

export default function RespondentModal({ title, setter,onHide }) {
  const [districtDDL, getDistrictDDL, loadDistrictDDL] = useAxiosGet();
  const [thanaDDL, getThanaDDL] = useAxiosGet();
  const [
    territoryDDL,
    getTerritoryDDL,
    loadTerritoryDDL,
    setTerritoryDDL,
  ] = useAxiosGet();
  const [
    partnerDDL,
    getPartnerDDL,
    loadPartnerDDL,
    setPartnerDDL,
  ] = useAxiosGet();
  const [rowDta, getRowData, loadRowData] = useAxiosGet();
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);


  
  
  

  useEffect(() => {
    getDistrictDDL(
      "/oms/TerritoryInfo/GetDistrictDDL?countryId=18&divisionId=0"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        district: "",
        thana: "",
        territory: "",
      }}
      // validationSchema={{}}
      // onSubmit={(values, { setSubmitting, resetForm }) => {
      //   saveHandler(values, () => {
      //     resetForm(initData);
      //   });
      // }}
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
          {(loadDistrictDDL ||
            loadRowData ||
            loadPartnerDDL ||
            loadTerritoryDDL) && <Loading />}
          <IForm
            title={`${title} Popup`}
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="district"
                    options={districtDDL}
                    value={values?.district}
                    label="District"
                    onChange={(valueOption) => {
                      setFieldValue("thana", "");
                      setFieldValue("district", valueOption);
                      if (!valueOption) return;
                      getThanaDDL(
                        `/oms/TerritoryInfo/GetThanaDDL?countryId=18&divisionId=0&districtId=${valueOption?.value}`
                      );
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="thana"
                    options={thanaDDL}
                    value={values?.thana}
                    label="Thana"
                    onChange={(valueOption) => {
                      setFieldValue("territory", "");
                      setFieldValue("thana", valueOption);
                      if (!valueOption) return;
                      getTerritoryDDL(
                        `/oms/CustomerPoint/GetBusinessPartnerTerritoryByUpazila?businessUnitId=4&upazilaName=${valueOption?.label}`,
                        (data) => {
                          const updatedData = data?.map((d) => ({
                            ...d,
                            label: d?.territoryName,
                            value: d?.territoryId,
                          }));
                          setTerritoryDDL(updatedData);
                        }
                      );
                      title === "Retailer"
                        ? getPartnerDDL(
                            `/oms/CustomerPoint/GetBusinessPartnerByUpazila?businessUnitId=${buId}&upazilaName=${valueOption?.label}&territoryId=0`,
                            (data) => {
                              const updatedData = data?.map((d) => ({
                                ...data,
                                value: d?.businessPartnerId,
                                label: d?.businessPartnerName,
                              }));
                              setPartnerDDL(updatedData);
                            }
                          )
                        : getRowData(
                            `/oms/CustomerPoint/GetBusinessPartnerByUpazila?businessUnitId=${buId}&upazilaName=${valueOption?.label}&territoryId=0`
                          );
                    }}
                    isDisabled={!values?.district}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="territory"
                    options={territoryDDL}
                    value={values?.territory}
                    label="Territory"
                    onChange={(valueOption) => {
                      setFieldValue("territory", valueOption);
                      if (!valueOption) return;
                      title === "Retailer"
                        ? getPartnerDDL(
                            `/oms/CustomerPoint/GetBusinessPartnerByUpazila?businessUnitId=${buId}&upazilaName=${values?.thana?.label}&territoryId=${valueOption?.value}`,
                            (data) => {
                              const updatedData = data?.map((d) => ({
                                ...data,
                                value: d?.businessPartnerId,
                                label: d?.businessPartnerName,
                              }));
                              setPartnerDDL(updatedData);
                            }
                          )
                        : getRowData(
                            `/oms/CustomerPoint/GetBusinessPartnerByUpazila?businessUnitId=${buId}&upazilaName=${values?.thana?.label}&territoryId=${valueOption?.value}`
                          );
                    }}
                    isDisabled={!values?.thana}
                  />
                </div>
                {title === "Retailer" && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="partner"
                      options={partnerDDL}
                      value={values?.partner}
                      label="Partner"
                      onChange={(valueOption) => {
                        setFieldValue("partner", valueOption);
                        if (!valueOption) return;
                        getRowData(
                          `/oms/CustomerPoint/GetRetailerByBusinessPartner?businessUnitId=${buId}&businessPartnerId=${valueOption?.value}`
                        );
                      }}
                      isDisabled={!values?.thana}
                    />
                  </div>
                )}
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table mt-3">
                  <thead>
                    <tr>
                      <th>Retailer/Distributer Code </th>
                      <th>Retailer/Distributer Name </th>
                      <th>Contact No</th>
                      <th>Address</th>
                      <th>Area</th>
                      <th>Region</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDta?.length > 0 &&
                      rowDta?.map((item, index) => (
                        <tr key={index} onClick={() =>{
                            setter("respondent",  item?.retailerName || item?.businessPartnerName);
                            onHide()
                        }}>
                          <td>{item?.businessPartnerCode || ""}</td>
                          <td>
                            {item?.businessPartnerName || item?.retailerName}
                          </td>
                          <td>
                            {item?.businessPartnerContact ||
                              item?.retailerContact}
                          </td>
                          <td>
                            {item?.businessPartnerAddress ||
                              item?.retailerAddress}
                          </td>
                          <td>{item?.areaName}</td>
                          <td>{item?.regionName}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
