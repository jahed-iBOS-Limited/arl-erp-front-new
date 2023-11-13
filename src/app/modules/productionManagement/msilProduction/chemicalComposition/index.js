import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IEdit from "../../../_helper/_helperIcons/_edit";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
// import { ITable } from "../../../_helper/_table";
import axios from "axios";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import PaginationTable from "./../../../_helper/_tablePagination";

const initData = {
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
};
export default function ChemicalComposition() {
  const history = useHistory();
  const [, saveData, loading] = useAxiosPost();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [fileObjects, setFileObjects] = useState([]);

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, isLoading] = useAxiosGet();

  const getData = (values, pageNo, pageSize) => {
    const rowURL = `/mes/MSIL/GetMeltingQCLandingPagination?PartName=MeltingQC&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&BusinessUnitId=${selectedBusinessUnit?.value}&pageNumber=${pageNo}&pageSize=${pageSize}`;

    const url = rowURL;
    getRowData(url);
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    getData(values, pageNo, pageSize);
  };

  const saveHandler = (values, cb) => {};

  const [open, setOpen] = React.useState(false);

<<<<<<< HEAD
  const attachmentAction = async (attachment, cb) => {
    const formData = new FormData();

    // Verify that 'attachment' is an array and contains valid file objects
    attachment.forEach((file) => {
      console.log({ file });
      // Verify that 'file' exists and is a valid file object
      if (file && file.file) {
        console.log({file: file.file})
        formData.append("file", file.file);
      }
    });
=======
  const attachmentAction = async (fileObjects, cb) => {
    let formData = new FormData();
    await formData.append("file", fileObjects[0]?.file);
>>>>>>> 16a809423e6293cecb32e7d0c314bb8e2d48af30
    try {
      let { data } = await axios.post(
        "https://qc.ibos.io/process-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("File Upload successfully");
      return data;
    } catch (error) {
      toast.error("Document not uploaded");
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {(isLoading || loading) && <Loading />}
          <IForm
            title="Chemical Composition"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary mr-1"
                    onClick={() => {
                      setOpen(true);
                    }}
                  >
                    Grab Data
                  </button>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/production-management/msil-Production/chemicalcomposition/create"
                      );
                    }}
                  >
                    Create New
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div>
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      name="fromDate"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      name="toDate"
                      type="date"
                      min={values?.fromDate}
                    />
                  </div>
                  <div style={{ marginTop: "15px" }} className="col-lg-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        getData(values, pageNo, pageSize);
                      }}
                      className="btn btn-primary"
                      disabled={!values?.fromDate || !values?.toDate}
                    >
                      Show
                    </button>
                  </div>
                </div>
                {rowData?.data?.length > 0 && (
                  <div className="row">
                    <div className="col-lg-12">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th>Date</th>
                            <th>Shift</th>
                            <th>Heat No</th>
                            <th>Sample Type</th>
                            <th>Carbone (C)</th>
                            <th>Silicon (Si)</th>
                            <th>Manganese (Mn)</th>
                            <th>Phosphorus (P)</th>
                            <th>Shulfer (S)</th>
                            <th>Chromium (Cr)</th>
                            <th>Copper (Cu)</th>
                            <th>Nickel (Ni)</th>
                            <th>Carbon Equivalent</th>
                            <th style={{ width: "50px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.data?.length > 0 &&
                            rowData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{_dateFormatter(item?.dteDate)}</td>
                                <td>{item?.strShift}</td>
                                <td>{item?.strHeatNo}</td>
                                <td>{item?.strSampleType}</td>
                                <td className="text-right">{item?.numC}</td>
                                <td className="text-right">{item?.numSi}</td>
                                <td className="text-right">{item?.numMn}</td>
                                <td className="text-right">{item?.numP}</td>
                                <td className="text-right">{item?.numS}</td>
                                <td className="text-right">{item?.numCr}</td>
                                <td className="text-right">{item?.numCu}</td>
                                <td className="text-right">{item?.numNi}</td>
                                <td className="text-right">{item?.numCe}</td>
                                <td className="text-center">
                                  <IEdit
                                    onClick={() =>
                                      history.push({
                                        pathname: `/production-management/msil-Production/chemicalcomposition/edit/${item?.intAutoId}`,
                                        state: { ...item },
                                      })
                                    }
                                  />
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      {rowData?.data.length > 0 && (
                        <PaginationTable
                          count={rowData?.totalCount}
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
                  </div>
                )}
              </div>
            </Form>
            <DropzoneDialogBase
              filesLimit={1}
              acceptedFiles={["image/*", "application/pdf"]}
              fileObjects={fileObjects}
              cancelButtonText={"cancel"}
              submitButtonText={"submit"}
              maxFileSize={1000000}
              open={open}
              onAdd={(newFileObjs) => {
                setFileObjects([].concat(newFileObjs));
              }}
              onDelete={(deleteFileObj) => {
                const newData = fileObjects.filter(
                  (item) => item.file.name !== deleteFileObj.file.name
                );
                setFileObjects(newData);
              }}
              onClose={() => setOpen(false)}
              onSave={() => {
                setOpen(false);
                attachmentAction(fileObjects).then((data) => {
<<<<<<< HEAD
                  console.log({data})
                  // setUploadImage(data);
                  //save data payload
=======
>>>>>>> 16a809423e6293cecb32e7d0c314bb8e2d48af30
                  if (data) {
                    const payload = {
                      meltingQc: {
                        intAutoId: 0,
                        dteDate: data.dteDate,
                        numC: data.numC,
                        numCe: data.numCe,
                        numCr: data.numCr,
                        numCu: data.numCu,
                        numMn: data.numMn,
                        numNi: data.numNi,
                        numP: data.numP,
                        numS: data.numS,
                        numSi: data.numSi,
                        strHeatNo: data.strHeatNo,
                        strSampleType: data.strSampleType,
                        strShift: data.strShift,
                        intInsertBy: profileData?.userId,
                        dteInsertDate: _todayDate(),
                        isActive: true,
                      },
                    };
<<<<<<< HEAD
                    // saveData(
                    //   `/mes/MSIL/CreateEditMSIL`,
                    //   payload,
                    //   undefined,
                    //   true
                    // );
=======
                    saveData(
                      `/mes/MSIL/CreateEditMSIL`,
                      payload,
                      () => {
                        getData(values, pageNo, pageSize);
                      },
                      true
                    );
>>>>>>> 16a809423e6293cecb32e7d0c314bb8e2d48af30
                  }
                });
              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            />
          </IForm>
        </>
      )}
    </Formik>
  );
}

// old code

// <div>
//   <ITable
//     link="/production-management/msil-Production/chemicalcomposition/create"
//     title="Chemical Composition"
//   >
//     <Formik
//       enableReinitialize={true}
//       initialValues={initData}
//       onSubmit={(values, { setSubmitting, resetForm }) => {
//         // saveHandler(values, () => {
//         //   resetForm(initData);
//         // });
//       }}
//     >
//       {({
//         handleSubmit,
//         resetForm,
//         values,
//         setFieldValue,
//         isValid,
//         errors,
//         touched,
//       }) => (
//         <>
//           <Form className="form form-label-right">
//             {isLoading && <Loading />}
//             <div className="form-group row global-form">
//               <div className="col-lg-3">
//                 <InputField
//                   value={values?.fromDate}
//                   label="From Date"
//                   name="fromDate"
//                   type="date"
//                 />
//               </div>
//               <div className="col-lg-3">
//                 <InputField
//                   value={values?.toDate}
//                   label="To Date"
//                   name="toDate"
//                   type="date"
//                   min={values?.fromDate}
//                 />
//               </div>
//               <div style={{ marginTop: "15px" }} className="col-lg-1">
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     getData(values);
//                   }}
//                   className="btn btn-primary"
//                   disabled={!values?.fromDate || !values?.toDate}
//                 >
//                   Show
//                 </button>
//               </div>
//             </div>

//             {rowData?.data?.length > 0 && (
//               <div className="row">
//                 <div className="col-lg-12">
//                   <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
//                     <thead>
//                       <tr>
//                         <th style={{ width: "30px" }}>SL</th>
//                         <th>Date</th>
//                         <th>Shift</th>
//                         <th>Heat No</th>
//                         <th>Sample Type</th>
//                         <th>Carbone (C)</th>
//                         <th>Silicon (Si)</th>
//                         <th>Manganese (Mn)</th>
//                         <th>Phosphorus (P)</th>
//                         <th>Shulfer (S)</th>
//                         <th>Chromium (Cr)</th>
//                         <th>Copper (Cu)</th>
//                         <th>Nickel (Ni)</th>
//                         <th>Carbon Equivalent</th>
//                         <th style={{ width: "50px" }}>Action</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {rowData?.data?.length > 0 &&
//                         rowData?.data?.map((item, index) => (
//                           <tr key={index}>
//                             <td>{index + 1}</td>
//                             <td>{_dateFormatter(item?.dteDate)}</td>
//                             <td>{item?.strShift}</td>
//                             <td>{item?.strHeatNo}</td>
//                             <td>{item?.strSampleType}</td>
//                             <td className="text-right">{item?.numC}</td>
//                             <td className="text-right">{item?.numSi}</td>
//                             <td className="text-right">{item?.numMn}</td>
//                             <td className="text-right">{item?.numP}</td>
//                             <td className="text-right">{item?.numS}</td>
//                             <td className="text-right">{item?.numCr}</td>
//                             <td className="text-right">{item?.numCu}</td>
//                             <td className="text-right">{item?.numNi}</td>
//                             <td className="text-right">{item?.numCe}</td>
//                             <td className="text-center">
//                               <IEdit
//                                 onClick={() =>
//                                   history.push({
//                                     pathname: `/production-management/msil-Production/chemicalcomposition/edit/${item?.intAutoId}`,
//                                     state: { ...item },
//                                   })
//                                 }
//                               />
//                             </td>
//                           </tr>
//                         ))}
//                     </tbody>
//                   </table>
//                   {rowData?.data.length > 0 && (
//                     <PaginationTable
//                       count={rowData?.totalCount}
//                       setPositionHandler={setPositionHandler}
//                       paginationState={{
//                         pageNo,
//                         setPageNo,
//                         pageSize,
//                         setPageSize,
//                       }}
//                       values={values}
//                     />
//                   )}
//                 </div>
//               </div>
//             )}
//           </Form>
//         </>
//       )}
//     </Formik>
//   </ITable>
// </div>
