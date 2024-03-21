import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

export default function RespondentModal({ title, setter, onHide,respondedBuId}) {
  const [districtDDL, getDistrictDDL, loadDistrictDDL] = useAxiosGet();
  const [thanaDDL, getThanaDDL] = useAxiosGet();
  const [searchValue, setSearchValue] = useState("");
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
  
  const filteredRowData = rowDta?.filter((item)=>item?.businessPartnerName?.toLowerCase().includes(searchValue?.toLowerCase())||item?.retailerName?.toLowerCase().includes(searchValue?.toLowerCase()) || item?.retailerId?.toString().includes(searchValue) || item?.businessPartnerCode?.toString().includes(searchValue))
  useEffect(() => {
    getDistrictDDL(
      "/oms/TerritoryInfo/GetDistrictDDL?countryId=18&divisionId=0"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(()=>{
   if(title === "Retailer"){
    getPartnerDDL(
      `/oms/CustomerPoint/GetBusinessPartnerByUpazila?businessUnitId=${respondedBuId}&upazilaName=""&territoryId=0`,
      (data) => {
        const updatedData = data?.map((d) => ({
          ...data,
          value: d?.businessPartnerId,
          label: d?.businessPartnerName,
        }));
        setPartnerDDL(updatedData);
      }
    )
   }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[title,respondedBuId])
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        district: "",
        thana: "",
        territory: {value:0,label:"All"},
        partner:{value:0,label:"All"}
      }}
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
                    options={[{label:"All",value:0},...districtDDL  ]}
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
                    options={[{label:"All",value:0},...thanaDDL]}
                    value={values?.thana}
                    label="Thana"
                    onChange={(valueOption) => {
                      setFieldValue("thana", valueOption);
                      setFieldValue("territory", { label: "All", value: 0 });
                      setFieldValue("partner", { label: "All", value: 0 });
                      if (!valueOption) return;
                      getTerritoryDDL(
                        `/oms/CustomerPoint/GetBusinessPartnerTerritoryByUpazila?businessUnitId=4&upazilaName=${valueOption?.label !== "All" ? valueOption?.label : ""}`,
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
                          `/oms/CustomerPoint/GetBusinessPartnerByUpazila?businessUnitId=${respondedBuId}&upazilaName=${valueOption?.label !== "All"?valueOption?.label : ""}&territoryId=0`,
                          (data) => {
                            const updatedData = data?.map((d) => ({
                              ...data,
                              value: d?.businessPartnerId,
                              label: d?.businessPartnerName,
                            }));
                            setPartnerDDL(updatedData);
                          }
                        )
                       if(valueOption?.label !== "All"){
                        getRowData(
                          `/oms/CustomerPoint/GetRetailerByBusinessPartner?businessUnitId=${respondedBuId}&upazilaName=${valueOption?.label !== "All"?valueOption?.label : ""}&territoryId=0&businessPartnerId=0`
                        );
                       }
                      }else{
                        getRowData(
                          `/oms/CustomerPoint/GetBusinessPartnerByUpazila?businessUnitId=${respondedBuId}&upazilaName=${valueOption?.label !== "All"?valueOption?.label : ""}&territoryId=0`
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
                          `/oms/CustomerPoint/GetBusinessPartnerByUpazila?businessUnitId=${respondedBuId}&upazilaName=${values?.thana?.label !== "All" ?values?.thana?.label : ""}&territoryId=${valueOption?.value}`,
                          (data) => {
                            const updatedData = data?.map((d) => ({
                              ...data,
                              value: d?.businessPartnerId,
                              label: d?.businessPartnerName,
                            }));
                            setPartnerDDL(updatedData);
                          }
                        );
                       if(valueOption?.label !=="All"){
                        getRowData(
                          `/oms/CustomerPoint/GetRetailerByBusinessPartner?businessUnitId=${respondedBuId}&upazilaName=${values?.thana?.label !== "All" ?values?.thana?.label : ""}&territoryId=${valueOption?.value}&businessPartnerId=0`
                        );
                       }
                      } else {
                        getRowData(
                          `/oms/CustomerPoint/GetBusinessPartnerByUpazila?businessUnitId=${respondedBuId}&upazilaName=${values?.thana?.label !== "All" ?values?.thana?.label : ""}&territoryId=${valueOption?.value}`
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
                          `/oms/CustomerPoint/GetRetailerByBusinessPartner?businessUnitId=${respondedBuId}&upazilaName=${values?.thana?.label !== "All" ?values?.thana?.label : ""}&territoryId=${values?.territory?.value}&businessPartnerId=${valueOption?.value}`
                        );
                      }}
                      // isDisabled={!values?.thana}
                    />
                  </div>
                )}
              </div>
              {/* search element */}
               <div style={{width:"25%"}}>
                  <div
                    className={"input-group"}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Serach Customer Name"
                      aria-describedby="basic-addon2"
                      onChange={(e) => {
                        setSearchValue(e.target.value.trimStart())
                      }}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          setSearchValue(e.target.value.trimStart())
                        }
                      }}
                    />
                    <div className="input-group-append">
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => {
                          setSearchValue(searchValue)
                        }}
                      >
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
                
             <div className="loan-scrollable-table">
             <div className="scroll-table _table overflow-auto ">
                <table className="table table-striped one-column-sticky table-bordered global-table mt-3 ">
                  <thead>
                    <tr>
                      {title ==="Distributor " && <th style={{maxWidth:"130px"}}>{title} Code </th>}
                      <th>{title} Name </th>
                      <th>{title} Code </th>
                      <th style={{maxWidth:"100px"}}>Contact No</th>
                      <th>Address</th>
                      <th style={{maxWidth:"100px"}}>Area</th>
                      <th style={{maxWidth:"100px"}}>Region</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRowData?.length > 0 &&
                      filteredRowData?.map((item, index) => (
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
                              label: item?.label,
                              value: 0,
                              districtName : item?.districtName,
                              upazilaName:item?.upazilaName
                            });

                            onHide();
                          }}
                        >
                         {title ==="Distributor " &&  <td>{item?.businessPartnerCode || ""}</td>}
                          <td>
                            {item?.businessPartnerName || item?.retailerName}
                          </td>
                          <td className="text-center">
                            {item?.businessPartnerCode || item?.retailerId}
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
