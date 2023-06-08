import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  editLoanApplication,
  getCircularById,
  saveAttachment_action,
  saveLoanAppAction,
  addAndEditJobCircular,
} from "../helper";
import Form from "./Form";
import "../loanApplication.css";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

let initData = {
  title: "",
  description: "",
};

export default function AddEditCircularForm({
  history,
  match: {
    params: { id, applicationId },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [singleData, setSingleData] = useState("");
  const [open, setOpen] = React.useState(false);

  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // Get Selected Business unit data from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      getCircularById(id,setSingleData,setDisabled);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, applicationId]);

  const [objProps, setObjprops] = useState({});
  const [fileObjects, setFileObjects] = useState([]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      let payload = {
        intJobRequisitionId: 0,
        strDesignation: values?.title || "",
        jobImagePath: "",
        strRequisitionSummery: values?.description || "",
        strJobResponsibilities: "",
        strSkill: "",
        strEducationalRequirement: "",
        strWorkExprience: "",
        strSalary: "",
        strBenefits: "",
        numNumberOfVacency: 0,
        strJobType: "",
        strJobCategory: "",
        dteJobValidto: "2021-04-15T08:17:59.843Z",
      };

      if (id) {
        payload = {
          ...payload,
          intJobRequisitionId: id,
          isAprove:singleData?.isAprove,
        };
      }
      if (fileObjects.length > 0) {
        //  Attachment file add
        saveAttachment_action(fileObjects).then((data) => {
          payload = {
            ...payload,
            jobImagePath: data[0]?.id || "",
          };
          addAndEditJobCircular(payload, cb, setDisabled);
        });
      } else {
        addAndEditJobCircular(payload, ()=>{}, setDisabled);
      }

      // if (fileObjects.length > 0) {
      //   //  Attachment file add
      //   saveAttachment_action(fileObjects).then((data) => {
      //     const modifyPlyload = {
      //       ...payload,
      //       jobImagePath: data[0]?.id || "",
      //     };
      //     addAndEditJobCircular(modifyPlyload, cb, setDisabled);
      //   });
      // } else {
      //   //  Attachment file not add
      //   // saveLeaveMovementAction(payload, cb, setDisabled);
      // }
    } else {
      setDisabled(false);
    }
  };

  return (
    <IForm
      title={id ? "Edit Circular":"Add New Circular"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id}
        setOpen={setOpen}
      />

      <DropzoneDialogBase
        filesLimit={1}
        acceptedFiles={["image/*"]}
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
          // console.log("onSave", fileObjects);
          setOpen(false);
          // handleSubmit();
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </IForm>
  );
}
