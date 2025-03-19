import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
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
import { getLandingData } from "../helper";
import { useHistory } from "react-router-dom";
import NewSelect from "./../../../../_helper/_select";
import { getTerritoryDDL, getRouteDDL } from "../helper";
// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
  territory: { value: 0, label: "All" },
  route: { value: 0, label: "All" },
};

export default function HeaderForm({ createHandler }) {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [territoryNameDDL, setTerritoryNameDDL] = useState([]);
  const [routeNameDDL, setRouteNameDDL] = useState([]);
  const history = useHistory();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const girdDataFunc = (terId, routeId, pageNo, pageSize) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      terId,
      routeId,
      setLoading,
      setRowDto,
      pageNo,
      pageSize
    );
  };
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      girdDataFunc(0, 0, pageNo, pageSize);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    girdDataFunc(
      values?.territory?.value,
      values?.route?.value,
      pageNo,
      pageSize
    );
  };

  // Fetch All DDL
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getTerritoryDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTerritoryNameDDL
      );
      getRouteDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setRouteNameDDL
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData && selectedBusinessUnit]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Market"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() =>
                      history.push({
                        pathname: "/rtm-management/configuration/beat/create",
                        state: values,
                      })
                    }
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="form-group row global-form ">
                    <div className="col-lg-3">
                      <NewSelect
                        name="territory"
                        options={
                          [{ value: 0, label: "All" }, ...territoryNameDDL] ||
                          []
                        }
                        value={values?.territory}
                        label="Territory Name"
                        onChange={(valueOption) => {
                          setFieldValue("territory", valueOption);
                          girdDataFunc(valueOption?.value, values?.route?.value, pageNo, pageSize);
                        }}
                        placeholder="Territory Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="route"
                        options={
                          [{ value: 0, label: "All" }, ...routeNameDDL] || []
                        }
                        value={values?.route}
                        label="Route Name"
                        onChange={(valueOption) => {
                          setFieldValue("route", valueOption);
                          girdDataFunc(values?.territory?.value, valueOption?.value, pageNo, pageSize);
                        }}
                        placeholder="Route Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>

                  <GridData
                    rowDto={rowDto}
                    loading={loading}
                    pageSize={pageSize}
                    pageNo={pageNo}
                    setPositionHandler={setPositionHandler}
                    setPageNo={setPageNo}
                    setPageSize={setPageSize}
                    values={values}
                  />
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
