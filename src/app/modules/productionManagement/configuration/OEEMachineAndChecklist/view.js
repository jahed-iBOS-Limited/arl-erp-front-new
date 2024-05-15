import { Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import IView from "../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { attachmentUploadAction } from "../../../financialManagement/expense/dryDocSchedule/helper";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";

const initData = {};

export default function CheckListView() {
  const [objProps, setObjprops] = useState({});
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [rowClickData, steRowClickData] = useState({});
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
  const { id } = useParams();

  const loaction = useLocation();
  const { strShopfloorName, strMachineName } = loaction?.state?.landingData;

  const getData = (id) => {
    getTableData(`/asset/AssetMaintanance/GetAssetHealthCheckById?id=${id}`);
  };

  const saveHandler = (values, cb) => {
    const payload = tableData?.map((item) => {
      return {
        headerId: item?.intAssetHealthCheckId,
        rowId: item?.intRowId,
        fileId: item?.strImageUrl,
      };
    });
    saveData(
      `/asset/AssetMaintanance/UpdateAssetHealthCheckImage`,
      payload,
      () => getData(id),
      true
    );
  };

  useEffect(() => {
    getData(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const [fileObjects, setFileObjects] = useState([]);

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
          {(tableDataLoader || saveDataLoader) && <Loading />}
          <IForm
            customTitle="Machine And Checklist"
            isHiddenReset={true}
            getProps={setObjprops}
          >
            <Form>
              <div className="mt-2 row">
                <h4 className="ml-4">
                  Shopfloor Name: {strShopfloorName || ""}
                </h4>
                <h4 className="ml-4">Machine Name: {strMachineName || ""}</h4>
              </div>
              <div className="mt-2">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Asset Health Check Id</th>
                        <th>CheckList Criteria Type</th>
                        <th>CheckList Criteria</th>
                        <th>Standard Value</th>
                        <th>Image</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.length > 0
                        ? tableData.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.intAssetHealthCheckId}</td>
                              <td>{item?.strCheckListCriteriaType}</td>
                              <td>{item?.strCheckListCriteria}</td>
                              <td>{item?.strStandardValue}</td>
                              <td className="d-flex justify-content-around">
                                {item?.strImageUrl ? (
                                  <IView
                                    title="View Attachment"
                                    clickHandler={() => {
                                      dispatch(
                                        getDownlloadFileView_Action(
                                          item?.strImageUrl
                                        )
                                      );
                                    }}
                                  />
                                ) : null}
                                <>
                                  <span
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setOpen(true);
                                      steRowClickData({
                                        ...rowClickData,
                                        rowIdx: index,
                                      });
                                    }}
                                  >
                                    <i class="fa fa-upload" aria-hidden="true">
                                      upload
                                    </i>
                                  </span>
                                </>
                              </td>
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={["image/*", "application/pdf"]}
                fileObjects={fileObjects || []}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={1000000}
                open={open}
                onAdd={(newFileObjs) => {
                  setFileObjects([].concat(newFileObjs));
                }}
                onDelete={(deleteFileObj) => {
                  const newData = fileObjects?.filter(
                    (item) => item.file.name !== deleteFileObj.file.name
                  );
                  setFileObjects(newData);
                }}
                onClose={() => setOpen(false)}
                onSave={() => {
                  setOpen(false);
                  attachmentUploadAction(fileObjects).then((data) => {
                    const copyData = [...tableData];
                    copyData[rowClickData?.rowIdx].strImageUrl =
                      data?.[0].id || "";
                    setTableData(copyData);
                    setFileObjects([]);
                  });
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
