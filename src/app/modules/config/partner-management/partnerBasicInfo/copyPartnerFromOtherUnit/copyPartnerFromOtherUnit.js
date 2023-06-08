/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { Formik, Form } from "formik";
import InputField from "./../../../../_helper/_inputField";
import { getPartnerData, savepartnerInformation, getAssetSBUDDL } from "../helper";
import IViewModal from "./../../../../_helper/_viewModal";
import IConfirmModal from "../../../../_helper/_confirmModal";
import NewSelect from "../../../../_helper/_select";
import { toast } from "react-toastify";

const initData = {
  sbu: "",
  search: ""
};

export default function CopyPartnerFromOtherUnit({ show, onHide, landingValues }) {
  const history = useHistory();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [gridData, setGridData] = React.useState([]);
  const [sbuName, setSbuName] = React.useState({});
  const [sbu, setSbu] = React.useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() =>{
    getAssetSBUDDL(profileData?.accountId, selectedBusinessUnit?.value, setSbu);
  }, [])

  let partnerTypeId = landingValues?.partnerType?.value

  //setPositionHandler
  const setPositionHandler = (values) => {
    if(values?.search){
      getPartnerData(partnerTypeId, values?.search, setGridData, );
    }
  };

  const savePartnerInfo = (partnerId) => {
    if(sbuName?.value){
      let confirmObject = {
        title: "Are you sure?",
        message: `Do you want to Save?`,
        yesAlertFunc: async () => {
          await savepartnerInformation(sbuName?.value, partnerId, selectedBusinessUnit?.value, partnerTypeId)
          setGridData([])
        },
        noAlertFunc: () => {
          history.push("/config/partner-management/partner-basic-info");
        },
      };
      IConfirmModal(confirmObject);
    }else{
      toast.warning("Please Select SBU")
    }
  };

  return (
    <IViewModal
      show={show}
      onHide={()=>{
        onHide()
        setGridData([])
      }}
      isShow={false}
      title="Business Partner List"
      style={{ fontSize: "1.2rem !important" }}
    >
      {/* Table Start */}
      <Formik
        initialValues={initData}
        onSubmit={(values, { setSubmitting }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          setValues,
        }) => (
          <>
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                      name="plant"
                      options={sbu || []}
                      value={values?.plant}
                      label="Select SBU"
                      onChange={(valueOption) => {
                        setSbuName(valueOption);
                      }}
                      placeholder="Select SBU"
                      errors={errors}
                      touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Supplier</label>
                  <InputField
                    value={values?.search}
                    name="search"
                    placeholder="Search...."
                    type="text"
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    className="btn btn-primary mt-5"
                    type="button"
                    onClick={() => {
                      setPositionHandler(values);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 table-responsive">
                  {gridData?.length ? (
                    <table className="table table-striped table-bordered global-table sales_order_landing_table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Contact</th>
                          <th>Address</th>
                          <th style={{ width: "60px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((td, index) => (
                          <tr key={index}>
                            <td className="text-center"> {index+1} </td>
                            <td>
                              <div className="pl-2">{td?.businessPartnerName} </div>
                            </td>
                            <td className="text-center">
                              {td?.email}
                            </td>
                            <td className="text-center">
                              {td?.contactNumber}
                            </td>
                            <td> {td?.adress} </td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <span
                                  className="btn btn-outline-dark pointer"
                                  style={{padding:"3px 10px 3px 10px"}}
                                  onClick={() => {
                                    savePartnerInfo(td?.businessPartnerId)
                                  }}
                                >
                                  Add
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : null}
                </div>
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </div>
              {/* <Invoice 
                title="Invoice Recept"
                show={showInvoceModal} 
                onHide={()=> setShowInvoiceModal(false)} 
                salesId={salesId}
              /> */}
            </Form>
          </>
        )}
      </Formik>
    </IViewModal>
  );
}
