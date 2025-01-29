import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IForm from "../../../_helper/_form";
import IEdit from "../../../_helper/_helperIcons/_edit";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import CommonTable from "../../../_helper/commonTable";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
const initData = {
  plant: {value:0,label:"All"},
  itemType: {value:0,label:"All"},
  itemCategory: {value:0,label:"All"},
  itemSubCategory: {value:0,label:"All"},
  status: {value:0,label:"All"},
};
export default function QcItemConfigLanding() {
    //state
    const history = useHistory();
    const[pageNo,setPageNo] = useState(0)
    const[pageSize,setPageSize] = useState(15)
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  //DDL
  const [itemTypeDDL, getItemTypeDDL,loadItemTypeDDL,setGetItemTypeDDL] = useAxiosGet();
  const [itemCategoryDDL, getItemCategoryDDL,,settItemCategoryDDL] = useAxiosGet();
  const [itemSubCategoryDDL, getItemSubCategoryDDL,,setItemSubCategoryDDL] = useAxiosGet();
  const [plantDDL, getPlantDDL] = useAxiosGet();

  //landing data
  const [landingData,getLandingData,loadLandingData] = useAxiosGet()

//   handler
  const saveHandler = (values, cb) => {};
  const getLandingDataHandler=(pageNo,pageSize,values,searchTerm)=>{
    getLandingData(`/mes/QCTest/GetQCItemInformation?businessUnitId=${buId}&plantId=${values?.plant?.value}&itemTypeId=${values?.itemType?.value}&itemCategoryId=${values?.itemCategory?.value}&itemSubCategoryId=${values?.itemSubCategory?.value}&status=${values?.status?.label}&pageNo=${pageNo}&pageSize=${pageSize}&search=${searchTerm ?searchTerm :""}`)
  }

  const paginationSearchHandler = (search,values)=>{
    getLandingDataHandler(pageNo,pageSize,values,search)
  }

  const headersData = [
    "SL",
    "Code",
    "Name",
    "Type",
    "Category",
    "Sub-Category",
    "Status",
    "Action",
  ]
  useEffect(() => {
    getPlantDDL(
      `/wms/Plant/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId,buId]);
  useEffect(() => {
    getItemTypeDDL(`/item/ItemCategory/GetItemTypeListDDL`,(data)=>{
        const updatedData = data?.map(item=>({label:item?.itemTypeName,value:item?.itemTypeId}))
        setGetItemTypeDDL(updatedData)
    });
    getLandingData(`/mes/QCTest/GetQCItemInformation?businessUnitId=${buId}&plantId=${initData?.plant?.value}&itemTypeId=${initData?.itemType?.value}&itemCategoryId=${initData?.itemCategory?.value}&itemSubCategoryId=${initData?.itemSubCategory?.value}&status=${initData?.status?.label}&pageNo=${pageNo}&pageSize=${pageSize}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
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
          {(loadLandingData || loadItemTypeDDL) && <Loading />}
          <IForm
            title="QC Item Config"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            //   renderProps={() => {
            //     return (
            //       <div>
            //         <button
            //           type="button"
            //           className="btn btn-primary"
            //           onClick={() => {
            //             history.push("route here");
            //           }}
            //         >
            //           Create
            //         </button>
            //       </div>
            //     );
            //   }}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={[{value:0,label:"All"},...plantDDL] || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      setFieldValue("plant", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemType"
                    options={[{value:0,label:"All"},...itemTypeDDL] || []}
                    value={values?.itemType}
                    label="Item Type"
                    onChange={(valueOption) => {
                      setFieldValue("itemCategory", "");
                      setFieldValue("itemSubCategory", "");
                      setFieldValue("itemType", valueOption);
                      if (!valueOption) return;
                      getItemCategoryDDL(
                        `/item/ItemCategory/GetItemCategoryDDLByTypeId?AccountId=${accId}&BusinessUnitId=${buId}&ItemTypeId=${valueOption?.value}`,
                        (data)=>{
                            const updatedData = data?.map(item=>({label:item?.itemCategoryName,value:item?.itemCategoryId}))
                            settItemCategoryDDL(updatedData)
                        }
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemCategory"
                    options={[{value:0,label:"All"},...itemCategoryDDL] || []}
                    value={values?.itemCategory}
                    label="Item Type"
                    onChange={(valueOption) => {
                      setFieldValue("itemSubCategory", "");
                      setFieldValue("itemCategory", valueOption);
                      if (!valueOption) return;
                      getItemSubCategoryDDL(
                        `/item/ItemSubCategory/GetItemSubCategoryDDLByCategoryId?accountId=${accId}&businessUnitId=${buId}&itemCategoryId=${valueOption?.value}&typeId=${values?.itemType?.value}`,
                        (data)=>{
                            const updatedData = data?.map(item=>({...item,label:item?.itemSubCategoryName,value:item?.id}))
                            setItemSubCategoryDDL(updatedData)
                        }
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemSubCategory"
                    options={[{value:0,label:"All"},...itemSubCategoryDDL] || []}
                    value={values?.itemSubCategory}
                    label="Item Sub-Category"
                    onChange={(valueOption) => {
                      setFieldValue("itemSubCategory", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="status"
                    options={[
                      { label: "All", value: 0 },
                      { label: "Particulars", value: 1 },
                      { label: "Required", value: 2 },
                    ]}
                    value={values?.status}
                    label="Status"
                    onChange={(valueOption) => {
                      setFieldValue("status", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    type="button"
                    style={{
                      marginTop: "16px",
                    }}
                    onClick={() => {
                       getLandingDataHandler(pageNo,pageSize,values)
                    }}
                    class="btn btn-primary ml-2"
                    disabled={
                      !values?.plant ||
                      !values.itemType ||
                      !values.itemCategory ||
                      !values?.itemSubCategory
                    }
                  >
                    View
                  </button>
                 
                </div>
              </div>
              <div style={{marginTop:"20px"}}>
              <PaginationSearch
              placeholder="Item  Code Search"
              paginationSearchHandler={paginationSearchHandler}
              values={values}
            />
            <CommonTable headersData={headersData}>
                <tbody>
                    {
                        landingData?.data?.length>0 && landingData?.data?.map((item,index)=>(
                            <tr key={index}>
                                <td className="text-center">{index+1}</td>
                                <td className="text-center">{item?.itemCode}</td>
                                <td >{item?.itemName}</td>
                                <td className="text-center">{item?.itemTypeName}</td>
                                <td className="text-center">{item?.itemCategoryName}</td>
                                <td className="text-center">{item?.itemSubCategoryName}</td>
                                <td className="text-center">{item?.status}</td>
                                <td className="text-center">
                                    <span
                                    onClick={()=>{
                                        history.push({
                                            pathname:`/config/material-management/qc-item-config/${item?.itemId}`,
                                            state:item
                                        })
                                    }}
                                    >
                                        <IEdit/>
                                    </span>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </CommonTable>
            {
                landingData?.data?.length > 0 && (
                    <PaginationTable
                    count={landingData?.totalCount}
                    setPositionHandler={getLandingDataHandler}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )
            }
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
