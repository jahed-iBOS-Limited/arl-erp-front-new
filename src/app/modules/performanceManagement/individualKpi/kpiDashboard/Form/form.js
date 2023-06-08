import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getUnFavouriteDDLAction, updateUnpovAction } from "../_redux/Actions";
import GroupChart from "../rgl";
import { getReportAction } from "../_redux/Actions";
import { getEmployeeBasicInfoByIdAction } from "../../../_redux/Actions";
import {
  makeStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// Validation schema
const validationSchema = Yup.object().shape({});

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "100%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  yearDDL,
  month,
  selectedBusinessUnit,
  profileData,
  unPavDDL,
  employeeBasicInfo,
  empDDL,
}) {
  const dispatch = useDispatch();

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);


  const { userRole } = useSelector((state) => state?.authData, shallowEqual);

  let dashboardPublic = null;

  for (let i = 0; i < userRole.length; i++) {
    if (userRole[i]?.intFeatureId === 883) {
      dashboardPublic = userRole[i];
    }
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          employee: {
            value: profileData?.userId,
            label: profileData?.userName,
          },
          year: { value: yearDDL[0]?.value, label: yearDDL[0]?.label },
          from: { value: month[0]?.value, label: month[0]?.label },
          to: {
            value: month[month.length - 1]?.value,
            label: month[month.length - 1]?.label,
          },
        }}
        validationSchema={validationSchema}
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="dashboard-collapse">
                <ExpansionPanel
                  expanded={expanded}
                  onChange={() => setExpanded(!expanded)}
                >
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                  >
                    <Typography className={classes.heading}>
                      <b className="text-blue">
                        {values?.employee?.label}, {" "}{values?.year?.label},{" "}
                        {values?.from?.label}-{values?.to?.label}
                      </b>
                    </Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <div
                      style={{
                        background: "#ffffff",
                        padding: "0 8px",
                        borderRadius: "4px",
                      }}
                    >
                      <div>
                        <div className="form-group row">
                          <div className="col-lg">
                            <ISelect
                              label="Select Employee"
                              options={empDDL}
                              defaultValue={values.employee}
                              isDisabled={!dashboardPublic?.isView}
                              values={values}
                              name="employee"
                              dependencyFunc={(
                                value,
                                valuess,
                                setFieldValue
                              ) => {
                                dispatch(
                                  getReportAction(
                                    selectedBusinessUnit?.value,
                                    value,
                                    values?.year?.value,
                                    values.from.value,
                                    values.to.value,
                                    true,
                                    1
                                  )
                                );
                                dispatch(getEmployeeBasicInfoByIdAction(value));
                                dispatch(
                                  getUnFavouriteDDLAction(
                                    selectedBusinessUnit?.value,
                                    value,
                                    values.year?.value
                                  )
                                );
                                setFieldValue("unpavorite", "");
                              }}
                              setFieldValue={setFieldValue}
                              errors={errors}
                              touched={touched}
                            />
                          </div>

                          <div className="col-lg">
                            <ISelect
                              label="Year"
                              options={yearDDL}
                              defaultValue={values.year}
                              values={values}
                              name="year"
                              dependencyFunc={(
                                value,
                                valuess,
                                setFieldValue
                              ) => {
                                dispatch(
                                  getUnFavouriteDDLAction(
                                    selectedBusinessUnit?.value,
                                    values.employee?.value,
                                    value
                                  )
                                );
                                dispatch(
                                  getReportAction(
                                    selectedBusinessUnit?.value,
                                    values.employee?.value,
                                    value,
                                    values.from.value,
                                    values.to.value,
                                    true,
                                    1
                                  )
                                );
                                setFieldValue("unpavorite", "");
                              }}
                              setFieldValue={setFieldValue}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg">
                            <ISelect
                              label="From month"
                              options={month}
                              defaultValue={values.from}
                              values={values}
                              name="from"
                              dependencyFunc={(
                                value,
                                valuess,
                                setFieldValue
                              ) => {
                                dispatch(
                                  getReportAction(
                                    selectedBusinessUnit?.value,
                                    values.employee?.value,
                                    values.year.value,
                                    value,
                                    values.to.value,
                                    true,
                                    1
                                  )
                                );
                              }}
                              setFieldValue={setFieldValue}
                              errors={errors}
                              touched={touched}
                              isDisabled={!values.year}
                            />
                          </div>

                          <div className="col-lg">
                            <ISelect
                              label="To month"
                              options={month}
                              defaultValue={values.to}
                              values={values}
                              name="to"
                              dependencyFunc={(
                                value,
                                values,
                                setFieldValue
                              ) => {
                                dispatch(
                                  getReportAction(
                                    selectedBusinessUnit?.value,
                                    values.employee?.value,
                                    values.year.value,
                                    values.from.value,
                                    value,
                                    true,
                                    1
                                  )
                                );
                              }}
                              setFieldValue={setFieldValue}
                              errors={errors}
                              touched={touched}
                              isDisabled={!values.from}
                            />
                          </div>
                          <div className="col-lg">
                            <ISelect
                              label="Add to dashboard"
                              options={unPavDDL}
                              defaultValue={values.unpavorite}
                              name="unpavorite"
                              setFieldValue={setFieldValue}
                              errors={errors}
                              touched={touched}
                              isDisabled={!values.year}
                              dependencyFunc={(
                                value,
                                valuess,
                                setFieldValue
                              ) => {
                                dispatch(
                                  updateUnpovAction(value, () => {
                                    dispatch(
                                      getReportAction(
                                        selectedBusinessUnit?.value,
                                        values.employee?.value,
                                        values.year?.value,
                                        values.from?.value,
                                        values.to?.value,
                                        true,
                                        1
                                      )
                                    );
                                    dispatch(
                                      getUnFavouriteDDLAction(
                                        selectedBusinessUnit?.value,
                                        values.employee?.value,
                                        values.year?.value
                                      )
                                    );
                                  })
                                );
                                setFieldValue("unpavorite", "");
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
              </div>

              <GroupChart values={values} yearDDL={yearDDL} />
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
