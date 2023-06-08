import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import GridData from "./grid";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../_metronic/_partials/controls";
import NewSelect from "../../../../_helper/_select";
import {
  getTaxBranches,
  getOpenningBalenceData,
  getDeductionData,
} from "../helper";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";
import IViewModal from "../../../../_helper/_viewModal";
import OpeningBalanceForm from "../Form/addEditForm";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
  branch: "",
  type: "openningBalance",
};

export default function HeaderForm({ createHandler }) {
  const [taxBranchDDL, setTaxbranchDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [status, setStatus] = useState("");

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getTaxBranches(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxbranchDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const getDeductionDataFunc = (branch) => {
    getDeductionData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      branch,
      setLoading,
      setGridData
    );
  };
  const getOpenningBalenceFunc = (branch) => {
    getOpenningBalenceData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      branch,
      setLoading,
      setGridData
    );
  };

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      taxBranchDDL[0]?.value
    ) {
      getOpenningBalenceFunc(taxBranchDDL[0]?.value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit, taxBranchDDL]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, branch: taxBranchDDL[0] }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Openning Balance"}>
                <CardHeaderToolbar>
                  <button
                    style={{ marginRight: "10px" }}
                    onClick={(e) => {
                      setFieldValue("type", "deduction");
                      setStatus("deduction");
                      setShowModel(true);
                      getDeductionDataFunc(values?.branch?.value);
                    }}
                    className="btn btn-primary"
                    disabled={!values?.branch}
                  >
                    Deduction
                  </button>

                  <button
                    onClick={(e) => {
                      setFieldValue("type", "openningBalance");
                      getOpenningBalenceFunc(values?.branch?.value);
                      setStatus("Opening Balance");
                      setShowModel(true);
                    }}
                    className="btn btn-primary"
                    disabled={!values?.branch}
                  >
                    Opening Balance
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="form-group row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="branch"
                        options={taxBranchDDL || []}
                        value={values?.branch}
                        label="Select Branch"
                        onChange={(valueOption) => {
                          setFieldValue("branch", valueOption);
                          if(values?.deduction){
                            getDeductionDataFunc(valueOption?.value)
                          }else {
                            getOpenningBalenceFunc(valueOption?.value)
                          }
                        }}
                        errors={errors}
                        touched={touched}
                        placeholder="Select Branch"
                      />
                    </div>
                    <div className="col-lg-3 d-flex align-items-center justify-content-start mt-3">
                      <div
                        role="group"
                        aria-labelledby="my-radio-group"
                        className="d-flex justify-content-around align-items-center w-100 mt-2"
                      >
                        <label className="d-flex justify-content-around align-items-center">
                          <input
                            type="radio"
                            name="type"
                            value="One"
                            checked={values.type === "deduction"}
                            className="mr-1 pointer"
                            onChange={(e) => {
                              setFieldValue("type", "deduction");
                              setStatus("deduction");
                              getDeductionDataFunc(values?.branch?.value);
                            }}
                          />
                          Deduction
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="picked"
                            checked={values.type === "openningBalance"}
                            className="mr-1 pointer"
                            onChange={(e) => {
                              setFieldValue("type", "openningBalance");
                              setStatus("Opening Balance");
                              getOpenningBalenceFunc(values?.branch?.value);
                            }}
                          />
                          Openning Balance
                        </label>
                      </div>
                    </div>
                  </div>

                  <GridData rowDto={gridData} status={status} />
                  <IViewModal
                    show={showModel}
                    onHide={() => setShowModel(false)}
                    title={
                      status === "deduction"
                        ? "Create Deduction"
                        : "Create Openning Balance"
                    }
                  >
                    <OpeningBalanceForm
                      status={status}
                      formValues={values}
                      getDeductionDataFunc={getDeductionDataFunc}
                      getOpenningBalenceFunc={getOpenningBalenceFunc}
                      setShowModel={setShowModel}
                    />
                  </IViewModal>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
