import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useHistory, useLocation } from 'react-router-dom';
// import AdministrativeInformation from "./collpaseComponent/administrativeInformation/addEditForm";
import BankInformation from './collpaseComponent/bankInformation/addEditForm';
import ICustomCard from './../../../../_helper/_customCard';
import BasicEmployeeInformation from './collpaseComponent/basicEmployeeInformation/addEditForm';
import DocumentManagement from './collpaseComponent/documentMgt/addEditForm';
import RoasterSetup from './collpaseComponent/roasterSetup/addEditForm';

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

export default function OfficialInfoCollapsePanel() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [isConsolidatedEmpRemu, setIsConsolidatedEmpRemu] = React.useState();
  const [basicDataSave, setBasicDataSave] = React.useState(false);
  const history = useHistory();
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // toast.dismiss(1)
  };
  const { state } = useLocation();

  useEffect(() => {
    if (state?.checkbox === 'employeeInformation') {
      setExpanded('panel0');
    } else if (state?.checkbox === 'administrativeInformation') {
      setExpanded('panel1');
    } else if (state?.checkbox === 'employeeRemuneration') {
      setExpanded('panel12');
    } else if (state?.checkbox === 'banklInformation') {
      setExpanded('panel10');
    }

  }, [state]);

  const backHandler = () => {
    history.goBack();
  };

  return (
    <div className={classes.root}>
      <ICustomCard
        title={`Official Information [${
          state?.employeeFullName || state?.tableData?.employeeFullName
        }, Emp.Code: ${state?.employeeCode || state?.tableData?.employeeCode}]`}
        backHandler={backHandler}
      >
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel0'}
          onChange={handleChange('panel0')}
          defaultExpanded={true}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel0bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>
              Basic Employee Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <BasicEmployeeInformation
                isConsolidatedEmpRemu={isConsolidatedEmpRemu}
                setIsConsolidatedEmpRemu={setIsConsolidatedEmpRemu}
                setBasicDataSave={setBasicDataSave}
                basicDataSave={basicDataSave}
              />
            </div>
          </AccordionDetails>
        </Accordion>

        {/* <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          defaultExpanded={true}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>
              Administrative Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <AdministrativeInformation basicDataSave={basicDataSave} />
            </div>
          </AccordionDetails>
        </Accordion> */}

        {/* Employment Information */}
        {/* <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel11"}
          onChange={handleChange("panel11")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel11bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              Employment Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <EmploymentInformation />
            </div>
          </AccordionDetails>
        </Accordion> */}

        {/* Employee Remuneration Setup */}
        {/* <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === "panel12"}
          onChange={handleChange("panel12")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel12bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              Employee Remuneration Setup
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              {remunaration?.isView ? (
                <EmployeeRemunerationSetup
                  isConsolidatedEmpRemu={isConsolidatedEmpRemu}
                  setIsConsolidatedEmpRemu={setIsConsolidatedEmpRemu}
                />
              ) : (
                <strong>You don't have permission to view</strong>
              )}
            </div>
          </AccordionDetails>
        </Accordion> */}

        {/* Bank Information */}
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel10'}
          onChange={handleChange('panel10')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel10bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              Bank Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <BankInformation
                empName={
                  state?.employeeFullName || state?.tableData?.employeeFullName
                }
              />
            </div>
          </AccordionDetails>
        </Accordion>
        {/* Document Management */}
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel11'}
          onChange={handleChange('panel11')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel10bh-content"
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
        {/* Roaster Setup */}
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel13'}
          onChange={handleChange('panel13')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel10bh-content"
            id="panel7bh-header"
          >
            <Typography className={classes.heading}>
              {/* Roster Setup */}
              Work Schedule
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <RoasterSetup basicDataSave={basicDataSave} />
            </div>
          </AccordionDetails>
        </Accordion>
      </ICustomCard>
    </div>
  );
}
