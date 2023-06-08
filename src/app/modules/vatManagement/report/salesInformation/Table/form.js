import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "./../../../../_helper/_inputField";
import { useSelector } from "react-redux";
import GridData from "./grid";
import { shallowEqual } from "react-redux";

import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";

import NewSelect from "./../../../../_helper/_select";
import { GetItemNameDDL_api, getVatBranches_api, SalesInformation_Report_api } from "../helper";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { getHeaderData_api } from "./../../purchaseReg/helper";
import { GetItemTypeDDL_api } from './../helper';
import Loading from './../../../../_helper/_loading';

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
  fromDate: _todayDate(),
  toDate: _todayDate(),
  itemType: "",
  branch: "",
  itemName: "",
  type: "",
};

export default function HeaderForm() {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [headerData, setHeaderData] = useState("");
  const [branchDDL, setBranchDDL] = useState([]);
  const [itemTypeDDL, setitemType] = useState([]);
  const [itemName, setItemName] = useState([])


  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getVatBranches_api(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setBranchDDL
      );
      getHeaderData_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setHeaderData
      );
      GetItemTypeDDL_api(setitemType)
    }
  }, [selectedBusinessUnit, profileData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, branch: branchDDL[0] }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
          {loading && <Loading />}
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Sales Information"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {console.log('values: ',values)}
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="branch"
                        options={branchDDL || []}
                        value={values?.branch}
                        label="Branch"
                        onChange={(valueOption) => {
                          setRowDto([])
                          setFieldValue("branch", valueOption);
                        }}
                        placeholder="Branch"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="itemType"
                        options={itemTypeDDL || []}
                        value={values?.itemType}
                        label="Item Type"
                        onChange={(valueOption) => {
                          setRowDto([])
                          setFieldValue('itemType', valueOption)
                          setFieldValue('itemName', '')
                          GetItemNameDDL_api(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.value,
                            setItemName
                          )
                        }}
                        placeholder="Item Type"
                        errors={errors}
                        touched={touched}
                        // isDisabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="itemName"
                        options={itemName || []}
                        value={values?.itemName}
                        label="Item"
                        onChange={(valueOption) => {
                          setFieldValue('itemName', valueOption)
                          setRowDto([])
                        }}
                        placeholder="Item Name"
                        errors={errors}
                        touched={touched}
                        // isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value)
                          setRowDto([])
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Top Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="Top Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value)
                          setRowDto([])
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="type"
                        options={[
                          { value: 1, label: "Sales" },
                          { value: 2, label: "Transfer" },
                        ]}
                        value={values?.type}
                        label="Report Type"
                        onChange={(valueOption) => {
                          setFieldValue("type", valueOption);
                          setRowDto([])
                        }}
                        placeholder="Report Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          SalesInformation_Report_api(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.fromDate,
                            values?.toDate,
                            values?.branch?.value,
                            values?.type?.value,
                            values?.itemName?.value,
                            setRowDto,
                            setLoading
                          );
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  {rowDto?.length > 0 && (
                    <GridData
                      rowDto={rowDto}
                      loading={loading}
                      headerData={headerData}
                    />
                  )}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
