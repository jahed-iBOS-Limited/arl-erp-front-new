/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import { ISelect } from "../../../../_helper/_inputDropDown";
import Loading from "../../../../_helper/_loading";

export function TableRow(props) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [gridData, setGridData] = useState([]);

  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [pageCount, setPageCount] = useState();

  //setPositionHandler
  // const setPositionHandler = (pageNo, pageSize, searchValue) => {
  //   getItemRequestGridData(
  //     selectCheckPost.value,
  //     profileData.accountId,
  //     selectVehicleStatusDDL.value,
  //     setGridData,
  //     setLoading,
  //     pageNo,
  //     pageSize,
  //     setPageCount,
  //     searchValue
  //   );
  // };

  // const paginationSearchHandler = (searchValue) => {
  //   setPositionHandler(pageNo, pageSize, searchValue);
  // };

  return (
    <>
      <Formik
        // enableReinitialize={true}
        // initialValues={{}}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // saveHandler(values, () => {
          //   resetForm(initialData);
          // });
        }}
      >
        {" "}
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
              <CardHeader title={"Trip Load Unload"}>
                <CardHeaderToolbar>
                  <button
                    className="btn btn-primary"
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <form action="">
                  <div className="row my-3 global-form">
                    <div className="col-lg-3">
                      <ISelect
                        label="Shippoint"
                        name="pgiShippoint"
                      />
                    </div>
                    {/* <div className="col-lg-3">
                      <InputField
                        // value={values?.fromDate}
                        label="From Date"
                        // type="date"
                        // name="fromDate"
                      />
                    </div> */}
                    <div className="col-lg-2 mt-6">
                      <button className="btn btn-primary">View</button>
                    </div>
                  </div>
                  {loading && <Loading />}
                  {/* <PaginationSearch
          placeholder="Item Name & Code Search"
          paginationSearchHandler={paginationSearchHandler}
        /> */}
                  {/* {gridData?.length > 0 && ( */}
                  <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                    <thead>
                      <tr>
                        <th style={{ width: "50px" }}>Sl</th>
                        <th>Challan No</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        {/* <th>Entry Date</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {/* {gridData?.map((td, index) => (
                <tr key={index}>
                  <td className="text-center"> {index + 1} </td>
                  <td>
                    <div className="pl-2">{td?.vehicleNo}</div>
                  </td>
                  <td>
                    <div className="pl-2">{td?.driverName}</div>
                  </td>
                  <td>
                    <div className="pl-2">{td?.cameFrom}</div>
                  </td>
                  <td className="text-center">
                    {_dateFormatter(td?.inDateTime)}
                  </td>
                </tr>
              ))} */}
                    </tbody>
                  </table>
                  </div>
                  {/* )} */}
                  {/* {gridData?.length > 0 && (
          <PaginationTable
            count={pageCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )} */}
                </form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
