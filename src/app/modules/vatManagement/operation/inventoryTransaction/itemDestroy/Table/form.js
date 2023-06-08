import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import GridData from "./grid";
import {
  GetItemDestroyPagination,
  getItemTypeDDL_api,
  getTaxBranchDDL_api,
} from "../helper";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from './../../../../../_helper/_todayDate';
import Loading from './../../../../../_helper/_loading';
import ICustomCard from './../../../../../_helper/_customCard';
import NewSelect from './../../../../../_helper/_select';
import InputField from './../../../../../_helper/_inputField';



// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  branchName: "",
  fromDate: _todayDate(),
  todate: _todayDate(),
  itemType: "",
};

export default function ItemDestroyLanding() {
  // eslint-disable-next-line no-unused-vars
  const [rowDto, setRowDto] = useState({});
  // const [girdData, setGirdData] = useState([1]);
  let history = useHistory();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  // let { profileData, selectedBusinessUnit } = receivepaymentAuthData;
  const [branch, setBranch] = useState([]);
  const [itemType, setItemType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  //ddl from helper

  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit?.value &&
      profileData?.userId
    ) {
      getTaxBranchDDL_api(
        profileData?.userId,
        profileData.accountId,
        selectedBusinessUnit?.value,
        setBranch,
        initData
      );
      getItemTypeDDL_api(setItemType);
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit?.value &&
      branch[0]?.value
    ) {
      GetItemDestroyPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        branch[0]?.value,
        itemType[0]?.value,
        setRowDto,
        setLoading,
        pageNo,
        pageSize
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, branch, itemType]);
  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          branchName: {
            value: branch ? branch[0]?.value : 0,
            label: branch ? branch[0]?.label : "",
            address: branch ? branch[0]?.address : "",
          },
          itemType: itemType[0],
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <div className="global-form">
              <ICustomCard title={"Item Destroy"}>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3 pr-0 pl-3">
                      <NewSelect
                        name="branchName"
                        options={branch}
                        value={values?.branchName}
                        label="Branch Name"
                        onChange={(valueOption) => {
                          setFieldValue("branchName", valueOption);
                          GetItemDestroyPagination(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value || "",
                            values?.itemType?.value || "",
                            setRowDto,
                            setLoading,
                            pageNo,
                            pageSize
                          );
                        }}
                        placeholder="Branch Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2 pr-0 pl-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        // disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-2 pr-0 pl-3">
                      <label>To Date</label>
                      <InputField
                        value={values?.todate}
                        name="todate"
                        placeholder="To Date"
                        type="date"
                        // disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3 pr-0 pl-3">
                      <NewSelect
                        name="itemType"
                        options={itemType}
                        value={values?.itemType}
                        label="Item Type"
                        onChange={(valueOption) => {
                          setFieldValue("itemType", valueOption);
                          GetItemDestroyPagination(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.branchName?.value,
                            valueOption?.value,
                            setRowDto,
                            setLoading,
                            pageNo,
                            pageSize
                          );
                        }}
                        placeholder="Item Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-2 pr-0 pl-">
                      <button
                        className="btn btn-primary"
                        style={{
                          marginBottom: "-37px",
                        }}
                        disabled={!values?.itemType}
                        onClick={() =>
                          history.push({
                            pathname: "/operation/inventoryTransaction/itemDestroy/add",
                            state: { values },
                          })
                        }
                      >
                        Create
                      </button>
                    </div>
                  </div>
                  <GridData
                    rowDto={rowDto}
                    setRowDto={setRowDto}
                    pageNo={pageNo}
                    pageSize={pageSize}
                    setPageNo={setPageNo}
                    setPageSize={setPageSize}
                    setLoading={setLoading}
                    values={values}
                  />
                </Form>
              </ICustomCard>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
