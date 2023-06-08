import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { useDispatch } from "react-redux";
import { updateUnpovAction } from "../_redux/Actions";
import GroupChart from "../rgl";
import { getReportAction } from "../_redux/Actions";
import { getUnFavDepSbuDDLAction } from "../../../_redux/Actions";
import {
  makeStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Typography,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  yearDDL,
  month,
  selectedBusinessUnit,
  profileData,
  unFevDepDDL,
  employeeBasicInfo,
  corporateDDL,
}) {
  const dispatch = useDispatch();

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          corporate: {
            value: corporateDDL[0]?.value,
            label: corporateDDL[0]?.label,
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
                        {values?.sbu?.label}, {values?.year?.label},{" "}
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
                              label="Select Corporate"
                              options={corporateDDL || []}
                              defaultValue={values.corporate}
                              values={values}
                              name="corporate"
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
                                    4,
                                    values?.section?.value || 0
                                  )
                                );
                                dispatch(
                                  getUnFavDepSbuDDLAction(
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
                                  getReportAction(
                                    selectedBusinessUnit?.value,
                                    values?.corporate?.value,
                                    value,
                                    values.from.value,
                                    values.to.value,
                                    true,
                                    4,
                                    values?.section?.value || 0
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
                                    values?.corporate?.value,
                                    values.year.value,
                                    value,
                                    values.to.value,
                                    true,
                                    4,
                                    values?.section?.value || 0
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
                                    values?.corporate?.value,
                                    values.year.value,
                                    values.from.value,
                                    value,
                                    true,
                                    4,
                                    values?.section?.value || 0
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
                              label=" UnFavorite List"
                              options={unFevDepDDL}
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
                                setFieldValue("unpavorite", "");
                                dispatch(
                                  updateUnpovAction(value, () => {
                                    dispatch(
                                      getReportAction(
                                        selectedBusinessUnit?.value,
                                        values?.corporate?.value,
                                        values.year?.value,
                                        values.from?.value,
                                        values.to?.value,
                                        true,
                                        4,
                                        values?.section?.value || 0
                                      )
                                    );
                                    dispatch(
                                      getUnFavDepSbuDDLAction(
                                        selectedBusinessUnit?.value,
                                        4,
                                        values?.year?.value
                                      )
                                    );
                                  })
                                );
                              }}
                            />
                          </div>
                          {/* section ddl remove. Assign by Bulbul vai */}
                          {/* <div className="col-lg">
                            <ISelect
                              label="Select Section"
                              options={[
                                { value: 1, label: "Production" },
                                { value: 2, label: "Sales" },
                              ]}
                              defaultValue={values?.section}
                              values={values}
                              name="section"
                              dependencyFunc={(
                                value,
                                valuess,
                                setFieldValue
                              ) => {
                                dispatch(
                                  getReportAction(
                                    selectedBusinessUnit?.value,
                                    values?.sbu?.value,
                                    values?.year?.value,
                                    values.from.value,
                                    values.to.value,
                                    true,
                                    3,
                                    value
                                  )
                                );
                              }}
                              setFieldValue={setFieldValue}
                              errors={errors}
                              touched={touched}
                            />
                          </div> */}
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
