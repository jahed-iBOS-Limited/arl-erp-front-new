import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../_metronic/_partials/controls";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import Loading from "../../_helper/_loading";

const MyAsset = () => {
  const [rowData, getRowData, lodar] = useAxiosGet();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const { employeeId } = profileData;

  useEffect(() => {
    getRowData(`/asset/Asset/GetAssignedAssetOfEmployee?empId=${employeeId}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"My Assets"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="row">
                  <div className="col-lg-12">
                    {rowData?.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>SL</th>
                              <th>Code</th>
                              <th>Name</th>
                              <th>Description</th>
                              <th>Asset Type</th>
                              <th>Plant Name</th>
                              <th>Business Unit</th>
                            </tr>
                          </thead>
                          <tbody>
                            {console.log("rowData", rowData)}

                            {rowData?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.assetCode}</td>
                                <td>{item?.assetName}</td>
                                <td>{item?.assetDescription}</td>
                                <td>{item?.assetTypeName}</td>
                                <td>{item?.plantName}</td>
                                <td>{item?.businessUnitName}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default MyAsset;
