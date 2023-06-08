import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
// eslint-disable-next-line no-unused-vars
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  makeStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from "@material-ui/core";
import { OthersInfo } from "./OthersInfo";
import { PersonalInfo } from "./PersonalInfo";
import { BasicInfo } from "./BasicInfo";

// Validation schema
const validationSchema = Yup.object().shape({});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setBeatNameDDL,
  setRowDto,
  profileData,
  selectedBusinessUnit,
  attributes,
  beatNameDDL,
  latutude,
  longitude,
  fileObjects,
  setFileObjects,
  outletId,
  collerCompanyDDL,
}) {
  // eslint-disable-next-line no-unused-vars
  const classes = useStyles();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            // setRowDto([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setValues,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}
            <Form className="form form-label-right">
              <div className={classes.root}>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className={classes.heading}>
                      Outlet Information
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      <BasicInfo
                        values={values}
                        setFieldValue={setFieldValue}
                        touched={touched}
                        errors={errors}
                        fileObjects={fileObjects}
                        setFileObjects={setFileObjects}
                        outletId={outletId}
                        collerCompanyDDL={collerCompanyDDL}
                      />
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className={classes.heading}>
                      Owner Information
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      <PersonalInfo
                        values={values}
                        setFieldValue={setFieldValue}
                        touched={touched}
                        latutude={latutude}
                        longitude={longitude}
                        errors={errors}
                      />
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className={classes.heading}>
                      Business Information*
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography>
                      <OthersInfo
                        values={values}
                        setFieldValue={setFieldValue}
                        touched={touched}
                        errors={errors}
                        attributes={attributes}
                      />
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
