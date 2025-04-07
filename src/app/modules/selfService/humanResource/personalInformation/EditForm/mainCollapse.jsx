import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useHistory, useLocation } from 'react-router-dom';
import PersonalInformation from './collpaseComponent/personalInformation/addEditForm';
import FamilyInformation from './collpaseComponent/familyInformation/addEditForm';
import PersonalContactInformation from './collpaseComponent/personalContactInformation/addEditForm';
import OthersContactInformation from './collpaseComponent/othersContactInformation/addEditForm';
import EducationalInformation from './collpaseComponent/educationalInformation/addEditForm';
import ProfessionalInformation from './collpaseComponent/professionalInformation/addEditForm';
import TrainingInformation from './collpaseComponent/trainingInformation/addEditForm';
import NomineeInformation from './collpaseComponent/nomineeInformation/addEditForm';
import DocumentManagement from './collpaseComponent/documentMgt/addEditForm';
import ICustomCard from './../../../../_helper/_customCard';
import { getEmpIdentificationTypeDDL_api } from './collpaseComponent/familyInformation/helper';
import { getDivisionDDL_api } from './collpaseComponent/personalContactInformation/helper';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function PersonalInfoCollapsePanel() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState('false');
  const history = useHistory();
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // toast.dismiss(1)
  };

  const { state } = useLocation();

  useEffect(() => {
    if (state?.checkbox === 'personalInformation') {
      setExpanded('panel2');
    } else if (state?.checkbox === 'familyInformation') {
      setExpanded('panel3');
    } else if (state?.checkbox === 'personalContactInformation') {
      setExpanded('panel4');
    } else if (state?.checkbox === 'otherContactInformation') {
      setExpanded('panel5');
    } else if (state?.checkbox === 'educationalInformation') {
      setExpanded('panel6');
    } else if (state?.checkbox === 'workingExperience') {
      setExpanded('panel7');
    } else if (state?.checkbox === 'employeeTrainigInfoStatus') {
      setExpanded('panel8');
    } else if (state?.checkbox === 'nomineeInformation') {
      setExpanded('panel9');
    }
  }, [state]);

  const backHandler = () => {
    history.goBack();
  };

  const [identificationTypeDDL, setIdentificationTypeDDL] = useState([]);
  const [divisionDDLGlobal, setDivisionDDLGlobal] = useState([]);

  // get identifaction ddl
  useEffect(() => {
    getEmpIdentificationTypeDDL_api(setIdentificationTypeDDL);
    // 18 means it's bangladesh, initially it will load bangladeshi division
    getDivisionDDL_api(18, setDivisionDDLGlobal);
  }, []);

  return (
    <div className={classes.root}>
      <ICustomCard
        title={`Personal Information [${
          state?.employeeFullName || state?.tableData?.employeeFullName
        }-${state?.employeeCode || state?.tableData?.employeeCode}]`}
        backHandler={backHandler}
      >
        {/* Personal Information */}
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel2'}
          onChange={handleChange('panel2')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography className={classes.heading}>
              Personal Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <PersonalInformation />
            </div>
          </AccordionDetails>
        </Accordion>
        {/* Family Information */}
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel3'}
          onChange={handleChange('panel3')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography className={classes.heading}>
              Family Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <FamilyInformation
                identificationTypeDDL={identificationTypeDDL}
              />
            </div>
          </AccordionDetails>
        </Accordion>
        {/* Personal Contact Information */}
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel4'}
          onChange={handleChange('panel4')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
          >
            <Typography className={classes.heading}>
              Personal Contact Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <PersonalContactInformation
                divisionDDLGlobal={divisionDDLGlobal}
              />
            </div>
          </AccordionDetails>
        </Accordion>
        {/* Others Contact Information */}
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel5'}
          onChange={handleChange('panel5')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel5bh-content"
            id="panel5bh-header"
          >
            <Typography className={classes.heading}>
              Others Contact Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <OthersContactInformation
                identificationTypeDDL={identificationTypeDDL}
                divisionDDLGlobal={divisionDDLGlobal}
              />
            </div>
          </AccordionDetails>
        </Accordion>
        {/* Educational Information Information */}
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel6'}
          onChange={handleChange('panel6')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel6bh-content"
            id="panel6bh-header"
          >
            <Typography className={classes.heading}>
              Educational Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <EducationalInformation />
            </div>
          </AccordionDetails>
        </Accordion>
        {/* Professional Information */}
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel7'}
          onChange={handleChange('panel7')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel7bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              Working Experience
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <ProfessionalInformation />
            </div>
          </AccordionDetails>
        </Accordion>
        {/* Training Information */}
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel8'}
          onChange={handleChange('panel8')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel8bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              Training/Certificate Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <TrainingInformation />
            </div>
          </AccordionDetails>
        </Accordion>
        {/* Nominee Information */}
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel9'}
          onChange={handleChange('panel9')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel9bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              Nominee Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <NomineeInformation
                identificationTypeDDL={identificationTypeDDL}
                divisionDDLGlobal={divisionDDLGlobal}
              />
            </div>
          </AccordionDetails>
        </Accordion>
        {/* Nominee Information */}
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel10'}
          onChange={handleChange('panel10')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel9bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              Document Management
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <DocumentManagement />
            </div>
          </AccordionDetails>
        </Accordion>
      </ICustomCard>
    </div>
  );
}
