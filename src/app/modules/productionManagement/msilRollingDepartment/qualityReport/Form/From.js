import { Form, Formik } from 'formik';
import React from 'react';
import InputField from '../../../../_helper/_inputField';
import NewSelect from '../../../../_helper/_select';

export default function QualityReportForm({
   initData,
   btnRef,
   saveHandler,
   resetBtnRef,
   nominalDiaDDL,
   validationSchema,
}) {
   const actualDiaFunction = data => {
      return Math.sqrt(data * 162.196).toFixed(6);
   };

   const actualAreaFunction = data => {
      return ((Math.sqrt(data * 162.196) * Math.sqrt(data * 162.196) * 3.14) / 4).toFixed(6);
   };

   return (
      <>
         <Formik
            enableReinitialize={true}
            initialValues={initData}
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
               setFieldValue,
               isValid,
               errors,
               touched,
            }) => (
               <>
                  <Form className="form form-label-right">
                     <div className="form-group row global-form">
                        <div className="col-lg-3">
                           <InputField
                              value={values?.heatNo}
                              label="Heat No"
                              name="heatNo"
                              type="text"
                              onChange={e => {
                                 setFieldValue('heatNo', e.target.value);
                              }}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.physicalTestDate}
                              label="Physical Test Date"
                              name="physicalTestDate"
                              type="date"
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.physicalTestTime}
                              label="Physical Test Time"
                              name="physicalTestTime"
                              type="time"
                              onChange={e => {
                                 setFieldValue(
                                    'physicalTestTime',
                                    e.target.value
                                 );
                              }}
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="grade"
                              options={[
                                 {
                                    value: 'Magnum Supreme 500W',
                                    label: 'Magnum Supreme 500W',
                                 },
                                 { value: 'Magnum 400', label: 'Magnum 400' },
                                 { value: 'Akij Ispat B500DWR', label: 'Akij Ispat B500DWR' },
                                 { value: 'Akij Ispat B420DWR', label: 'Akij Ispat B420DWR' },
                              ]}
                              value={values?.grade}
                              label="Grade"
                              onChange={valueOption => {
                                 setFieldValue('grade', valueOption);
                              }}
                              errors={errors}
                              touched={touched}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numActualUnitWtKg}
                              label="Actual Weight (kg)"
                              name="numActualUnitWtKg"
                              type="number"
                              onChange={e => {
                                 if (e.target.value) {
                                    setFieldValue('numActualUnitWtKg', e.target.value);
                                    setFieldValue('numActualDia', actualDiaFunction(e.target.value));
                                    setFieldValue('numActualArea', actualAreaFunction(e.target.value));
                                 } else {
                                    setFieldValue('numActualUnitWtKg', "");
                                    setFieldValue('numYieldLoad', '');
                                    setFieldValue('numMaximumForce', '');
                                    setFieldValue('numYieldStrengthCal', '');
                                    setFieldValue('numTensileStrengthCal', '');
                                    setFieldValue('numTsYsratioCal', '');
                                    setFieldValue('numActualDia', "");
                                    setFieldValue('numActualArea', "");
                                 }
                              }}
                              min={0}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numActualDia}
                              label="Actual Dia"
                              name="numActualDia"
                              type="number"
                              onChange={e => {
                                 setFieldValue('numActualDia', e.target.value);
                              }}
                              min={0}
                              disabled={true}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numActualArea}
                              label="Actual Area"
                              name="numActualArea"
                              type="number"
                              onChange={e => {
                                 setFieldValue('numActualArea', e.target.value);
                              }}
                              disabled
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="strNominalDia"
                              options={nominalDiaDDL || []}
                              value={values?.strNominalDia}
                              label="Nominal Dia"
                              onChange={valueOption => {
                                 setFieldValue('strNominalDia', valueOption);
                              }}
                              errors={errors}
                              touched={touched}
                           />
                        </div>

                        <div className="col-lg-3">
                           <InputField
                              value={values?.numElongationAfterFracture}
                              label="Elongation After Fracture"
                              name="numElongationAfterFracture"
                              type="number"
                              onChange={e => {
                                 setFieldValue(
                                    'numElongationAfterFracture',
                                    e.target.value
                                 );
                              }}
                              min={0}
                              max={100}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numEmfpercentage}
                              label="EMF"
                              name="numEmfpercentage"
                              type="number"
                              onChange={e => {
                                 setFieldValue(
                                    'numEmfpercentage',
                                    e.target.value
                                 );
                              }}
                              min={0}
                              max={100}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numYieldLoad}
                              label="Yield Load"
                              name="numYieldLoad"
                              type="number"
                              onChange={e => {
                                 if (e.target.value) {
                                    setFieldValue('numYieldLoad', e.target.value);
                                    setFieldValue('numYieldStrengthCal', ((e.target.value / values?.numActualArea) * 1000).toFixed(6));
                                 } else {
                                    setFieldValue('numYieldLoad', '');
                                    setFieldValue('numYieldStrengthCal', '');
                                    setFieldValue('numTsYsratioCal', '');
                                 }
                              }}
                              min={0}
                              disabled={!values?.numActualUnitWtKg}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numYieldStrengthCal}
                              label="Yield Strength (MPa)"
                              name="numYieldStrengthCal"
                              type="number"
                              onChange={e => {
                                 setFieldValue(
                                    'numYieldStrengthCal',
                                    e.target.value
                                 );
                              }}
                              min={0}
                              disabled
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numMaximumForce}
                              label="Maximumv Force (kN)"
                              name="numMaximumForce"
                              type="number"
                              onChange={e => {
                                 if (e.target.value) {
                                    setFieldValue('numMaximumForce', e.target.value);
                                    setFieldValue('numTensileStrengthCal', ((e.target.value / values?.numActualArea) * 1000).toFixed(6));
                                    setFieldValue('numTsYsratioCal', (((e.target.value / values?.numActualArea) * 1000) / values?.numYieldStrengthCal).toFixed(6));
                                 } else {
                                    setFieldValue('numMaximumForce', '');
                                    setFieldValue('numTensileStrengthCal', '');
                                    setFieldValue('numTsYsratioCal', '');
                                 }
                              }}
                              min={0}
                              disabled={!values?.numActualUnitWtKg}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numTensileStrengthCal}
                              label="Tensile Strength (MPa)"
                              name="numTensileStrengthCal"
                              type="number"
                              onChange={e => {
                                 setFieldValue(
                                    'numTensileStrengthCal',
                                    e.target.value
                                 );
                              }}
                              min={0}
                              disabled
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numRuptureLoad}
                              label="Rupture"
                              name="numRuptureLoad"
                              type="number"
                              onChange={e => {
                                 setFieldValue(
                                    'numRuptureLoad',
                                    e.target.value
                                 );
                                 //setFieldValue("numTsYsratioCal", (values?.numTensileStrengthCal / values?.numYieldStrengthCal).toFixed(6));
                              }}
                              min={0}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numTsYsratioCal}
                              label="TS/YS Ratio"
                              name="numTsYsratioCal"
                              type="number"
                              onChange={e => {
                                 setFieldValue(
                                    'numTsYsratioCal',
                                    e.target.value
                                 );
                              }}
                              min={0}
                              disabled
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="strBendTest"
                              options={[
                                 {
                                    value: 'Everything is Good',
                                    label: 'Everything is Good',
                                 },
                                 { value: 'Not Good', label: 'Not Good' },
                              ]}
                              value={values?.strBendTest}
                              label="Bend Test"
                              onChange={valueOption => {
                                 setFieldValue('strBendTest', valueOption);
                              }}
                              errors={errors}
                              touched={touched}
                           />
                        </div>
                        <div className="col-lg-3">
                           <NewSelect
                              name="strNatureOfBillet"
                              options={[
                                 {
                                    value: 'Direct charging Billet',
                                    label: 'Direct charging Billet',
                                 },
                                 {
                                    value: 'Re-Heating Billet',
                                    label: 'Re-Heating Billet',
                                 },
                              ]}
                              value={values?.strNatureOfBillet}
                              label="Nature Of Billet"
                              onChange={valueOption => {
                                 setFieldValue(
                                    'strNatureOfBillet',
                                    valueOption
                                 );
                              }}
                              errors={errors}
                              touched={touched}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numBilletTempreture}
                              label="Billet Tempreture (C)"
                              name="numBilletTempreture"
                              type="number"
                              onChange={e => {
                                 setFieldValue(
                                    'numBilletTempreture',
                                    e.target.value
                                 );
                              }}
                              min={0}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numFurnaceTempreture}
                              label="Furnace Tempreture (C)"
                              name="numFurnaceTempreture"
                              type="number"
                              onChange={e => {
                                 setFieldValue(
                                    'numFurnaceTempreture',
                                    e.target.value
                                 );
                              }}
                              min={0}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numTmtwaterTempreture}
                              label="TMT Water Tempreture (C)"
                              name="numTmtwaterTempreture"
                              type="number"
                              onChange={e => {
                                 setFieldValue(
                                    'numTmtwaterTempreture',
                                    e.target.value
                                 );
                              }}
                              min={0}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numBarEntryTempreture}
                              label="Bar entry Tempreture (C)"
                              name="numBarEntryTempreture"
                              type="number"
                              onChange={e => {
                                 setFieldValue(
                                    'numBarEntryTempreture',
                                    e.target.value
                                 );
                              }}
                              min={0}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numBarExitTempreture}
                              label="Bar exite Tempreture (C)"
                              name="numBarExitTempreture"
                              type="number"
                              onChange={e => {
                                 setFieldValue(
                                    'numBarExitTempreture',
                                    e.target.value
                                 );
                              }}
                              min={0}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numWaterFlow}
                              label="Water flow"
                              name="numWaterFlow"
                              type="number"
                              onChange={e => {
                                 setFieldValue('numWaterFlow', e.target.value);
                              }}
                              min={0}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.numWaterPressure}
                              label="Water Pressure"
                              name="numWaterPressure"
                              type="number"
                              onChange={e => {
                                 setFieldValue(
                                    'numWaterPressure',
                                    e.target.value
                                 );
                              }}
                              min={0}
                           />
                        </div>
                        <div className="col-lg-3">
                           <InputField
                              value={values?.strRemarks}
                              label="Remarks"
                              name="strRemarks"
                              type="text"
                              onChange={e => {
                                 setFieldValue('strRemarks', e.target.value);
                              }}
                           />
                        </div>
                     </div>

                     <button
                        type="submit"
                        style={{ display: 'none' }}
                        ref={btnRef}
                        onSubmit={() => handleSubmit()}
                     ></button>

                     <button
                        type="reset"
                        style={{ display: 'none' }}
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
