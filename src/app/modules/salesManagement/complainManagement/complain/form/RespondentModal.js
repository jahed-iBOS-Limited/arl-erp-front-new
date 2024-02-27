import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

export default function RespondentModal({ title, setter, onHide,respondedBuId}) {
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
        territory: {value:0,label:"All"},
        partner:{value:0,label:"All"}
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
                      setFieldValue("thana", valueOption);
                      setFieldValue("territory", { label: "All", value: 0 });
                      setFieldValue("partner", { label: "All", value: 0 });
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
                      if(title === "Retailer"){
                        getPartnerDDL(
                          `/oms/CustomerPoint/GetBusinessPartnerByUpazila?businessUnitId=${respondedBuId}&upazilaName=${valueOption?.label}&territoryId=0`,
                          (data) => {
                            const updatedData = data?.map((d) => ({
                              ...data,
                              value: d?.businessPartnerId,
                              label: d?.businessPartnerName,
                            }));
                            setPartnerDDL(updatedData);
                          }
                        )
                        getRowData(
                          `/oms/CustomerPoint/GetRetailerByBusinessPartner?businessUnitId=${respondedBuId}&upazilaName=${valueOption?.label}&territoryId=0&businessPartnerId=0`
                        );
                      }else{
                        getRowData(
                          `/oms/CustomerPoint/GetBusinessPartnerByUpazila?businessUnitId=${respondedBuId}&upazilaName=${valueOption?.label}&territoryId=0`
                        );
                      }
                    }}
                    isDisabled={!values?.district}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="territory"
                    options={[{ label: "All", value: 0 }, ...territoryDDL]}
                    value={values?.territory}
                    label="Territory"
                    onChange={(valueOption) => {
                      setFieldValue("partner", { label: "All", value: 0 });
                      setFieldValue("territory", valueOption);
                      if (!valueOption) return;
                      if (title === "Retailer") {
                        getPartnerDDL(
                          `/oms/CustomerPoint/GetBusinessPartnerByUpazila?businessUnitId=${respondedBuId}&upazilaName=${values?.thana?.label}&territoryId=${valueOption?.value}`,
                          (data) => {
                            const updatedData = data?.map((d) => ({
                              ...data,
                              value: d?.businessPartnerId,
                              label: d?.businessPartnerName,
                            }));
                            setPartnerDDL(updatedData);
                          }
                        );
                        getRowData(
                          `/oms/CustomerPoint/GetRetailerByBusinessPartner?businessUnitId=${respondedBuId}&upazilaName=${values?.thana?.label}&territoryId=${valueOption?.value}&businessPartnerId=0`
                        );
                      } else {
                        getRowData(
                          `/oms/CustomerPoint/GetBusinessPartnerByUpazila?businessUnitId=${respondedBuId}&upazilaName=${values?.thana?.label}&territoryId=${valueOption?.value}`
                        );
                      }
                    }}
                    isDisabled={!values?.thana}
                  />
                </div>
                {title === "Retailer" && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="partner"
                      options={[{ label: "All", value: 0 }, ...partnerDDL]}
                      value={values?.partner}
                      label="Partner"
                      onChange={(valueOption) => {
                        setFieldValue("partner", valueOption);
                        if (!valueOption) return;
                        getRowData(
                          `/oms/CustomerPoint/GetRetailerByBusinessPartner?businessUnitId=${respondedBuId}&upazilaName=${values?.thana?.label}&territoryId=${values?.territory?.value}&businessPartnerId=${valueOption?.value}`
                        );
                      }}
                      isDisabled={!values?.thana}
                    />
                  </div>
                )}
              </div>
             <div className="loan-scrollable-table">
             <div className="scroll-table _table overflow-auto ">
                <table className="table table-striped table-bordered global-table mt-3 ">
                  <thead>
                    <tr>
                      <th style={{maxWidth:"130px"}}>{title} Code </th>
                      <th>{title} Name </th>
                      <th style={{maxWidth:"100px"}}>Contact No</th>
                      <th>Address</th>
                      <th style={{maxWidth:"100px"}}>Area</th>
                      <th style={{maxWidth:"100px"}}>Region</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDta?.length > 0 &&
                      rowDta?.map((item, index) => (
                        <tr
                          key={index}
                          onClick={() => {
                            setter("customer", {
                              label:
                                item?.retailerName || item?.businessPartnerName,
                              value:
                                item?.retailerId || item?.businessPartnerId,
                            });
                            setter("upazila", {
                              label: item?.upazilaName,
                              value: 0,
                            });

                            onHide();
                          }}
                        >
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
             </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
