import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import NewSelect from "../../../_helper/_select";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  // getDepartmentDDL,
  getSbuDDL,
  getStrategicMapById,
  saveAttachment_action,
  saveStrategicMap,
} from "../helper";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";

// import {
//   makeStyles,
//   ExpansionPanel,
//   ExpansionPanelDetails,
//   ExpansionPanelSummary,
//   Typography,
// } from "@material-ui/core";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: "100%",
//   },
//   heading: {
//     fontSize: theme.typography.pxToRem(15),
//     flexBasis: "33.33%",
//     flexShrink: 0,
//   },
//   secondaryHeading: {
//     fontSize: theme.typography.pxToRem(15),
//     color: theme.palette.text.secondary,
//   },
// }));

const initData = {
  strategy: "",
  sbu: "",
  departmner: "",
};

export function Header({ onSubmit, onSelect, goalDDL, setGoalDDL }) {
  // const [departmentDDL, setDepartmentDDL] = useState([]);
  // const [expand, setExpand] = useState(false);
  // const classes = useStyles();

  const dispatch = useDispatch();
  const [, setLoading] = useState(false);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [fileObjects, setFileObjects] = useState([]);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const imageView = useSelector((state) => {
    return state?.commonDDL?.imageView;
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit.value) {
      // getDepartmentDDL(
      //   profileData.accountId,
      //   selectedBusinessUnit.value,
      //   setDepartmentDDL
      // );

      getSbuDDL(profileData.accountId, selectedBusinessUnit.value, setSbuDDL);
    }
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // if (id) {
      //   // dispatch(saveEditedControllingUnit(payload));
      // } else {

      const payload = {
        sbuIdFk: values?.sbu?.value,
        documentId: "",
        accountId: profileData?.accountId,
        businessunitId: selectedBusinessUnit?.value,
        actionBy: profileData?.userId,
        isActive: true,
        serverDateTime: "2021-04-08T07:39:43.057Z",
        lastActionDate: "2021-04-08T07:39:43.057Z",
      };

      if (fileObjects.length > 0) {
        //  Attachment file add
        saveAttachment_action(fileObjects).then((data) => {
          const modifyPlyload = {
            ...payload,
            documentId: data[0]?.id || "",
          };
          saveStrategicMap(modifyPlyload);
        });
      } else {
        toast.warn("Please Select a Image");
      }

      // }
    } else {
      // setDisabled(false);
    }
  };

  return (
    <div className="strategic">
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values);
        }}
      >
        {({
          errors,
          touched,
          setFieldValue,
          isValid,
          values,
          handleSubmit,
        }) => (
          <Form>
            {/* ============== Do Not Remove Anything (Contact With Redwan) ========== */}

            {/* <ExpansionPanel
              expanded={expand}
              onChange={() => setExpand(!expand)}
            >
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <Typography className={classes.heading}>
                  <b className="text-blue">Header</b>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails> */}
            {/* */}

            <div className="customRow">
              <button
                type="button"
                class="btn btn-primary"
                style={{ marginTop: "16px", marginRight: "24px" }}
                // ref={btnRef}
                disabled={!values?.sbu}
                onClick={() => setOpen(true)}
              >
              Map  Upload
              </button>

              {/* <button
                type="submit"
                class="btn btn-primary"
                style={{ marginTop: "16px", marginRight: "34px" }}
                disabled={!values?.sbu}
              >
                Save
              </button> */}
            </div>
            <div
              className="row"
              style={{ marginBottom: "50px", padding: "0 24px" }}
            >
              {/* <div className="col-lg-3">
                    <NewSelect
                      name="strategy"
                      options={[
                        { value: 1, label: "Department" },
                        { value: 2, label: "SBU" },
                      ]}
                      // value={values?.strategy}
                      label="Select Strategy"
                      onChange={(valueOption) => {
                        setFieldValue("strategy", valueOption);
                      }}
                      placeholder=" strategy"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}

              {/* SBU  */}
              {/* {values.strategy.value === 2 && ( */}
              <div className="col-lg-3">
                <NewSelect
                  name="sbu"
                  options={sbuDDL}
                  value={values?.sbu}
                  label="Select SBU"
                  onChange={(valueOption) => {
                    setFieldValue("sbu", valueOption);
                  }}
                  placeholder="SBU"
                  errors={errors}
                  touched={touched}
                />
              </div>
              {/* )} */}

              {/* Department */}
              {/* {values.strategy.value === 1 && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="departmner"
                        options={departmentDDL}
                        value={values?.departmner}
                        label="Select Department"
                        onChange={(valueOption) => {
                          setFieldValue("departmner", valueOption);
                        }}
                        placeholder=" departmner"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )} */}

              {/* <div className="col-lg-3">
                    <NewSelect
                      name="goal"
                      options={goalDDL}
                      // value={values?.strategy}
                      label="Select Strategy"
                      onChange={(valueOption) => {
                        // setFieldValue("goal", valueOption);
                        const clone = [...goalDDL]
                        // const updateDDL = clone.filter(item => item.id !== valueOption?.value)
                        const updateDDL = clone.map(item => {
                          if(item.value === valueOption?.value){
                            return {
                              ...item,
                              isDisabled:true,
                            }
                          }else{
                            return item
                          }
                        })
                        setGoalDDL(updateDDL)
                        onSelect(valueOption)
                      }}
                      placeholder="Goal"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}

              <div className="col-lg-3">
                <button
                  type="button"
                  class="btn btn-primary"
                  style={{ marginTop: "16px", marginRight: "14px" }}
                  // ref={btnRef}
                  disabled={!values?.sbu}
                  onClick={() => {
                    getStrategicMapById(
                      values?.sbu?.value, 
                      (data) => {
                      dispatch(
                        getDownlloadFileView_Action(data?.documentId, true)
                      );
                    },
                    setLoading
                    );
                  }}
                >
                  View
                </button>
              </div>
            </div>
            {/* </ExpansionPanelDetails>
            </ExpansionPanel> */}

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
                handleSubmit();
              }}
              showPreviews={true}
              showFileNamesInPreview={true}
            />
          </Form>
        )}
      </Formik>
      {/* {loading && <Loading/>} */}
      
      <div className="row" style={{marginBottom:"30px"}}>
        <div className="col-md-12">
          <img src={imageView?.url} alt="" style={{ width: "100%",padding:"0 25px"}} />
        </div>
      </div>
    </div>
  );
}
