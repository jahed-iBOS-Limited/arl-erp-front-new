/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import GridData from "./grid";
import Axios from "axios";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";

export default function HeaderForm({ createHandler }) {
  const [gridData, setGirdData] = useState([]);
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData } = storeData;

  //FETCHING ALL DATA
  const dispatchProduct = async (accId, pageNo, pageSize) => {
    setLoading(true);
    try {
      const res = await Axios.get(
        `/wms/Plant/GetPlantLandingDataListPagination?accountId=${accId}&status=true&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=desc`
      );
      if (res.status === 200) {
        setLoading(false);
        setGirdData(res?.data);
      }
    } catch (error) {
     
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profileData) {
      dispatchProduct(profileData.accountId, pageNo, pageSize);
    }
  }, [profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    dispatchProduct(profileData.accountId, pageNo, pageSize);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        //initialValues={}
        //validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Plant"}>
                <CardHeaderToolbar>
                  <button onClick={createHandler} className="btn btn-primary">
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}
                <Form className="form form-label-right">
                  <GridData rowDto={gridData?.data} />

                  {/* Pagination Code */}
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
