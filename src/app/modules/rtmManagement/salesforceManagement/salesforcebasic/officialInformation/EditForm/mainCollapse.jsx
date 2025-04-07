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
import ICustomCard from './../../../../../_helper/_customCard';
import BasicEmployeeInformation from './collpaseComponent/basicEmployeeInformation/addEditForm';
import PersonalInformation from '../../personalInformation/EditForm/collpaseComponent/personalInformation/addEditForm';
import SalesforceTerrioryInfo from './collpaseComponent/salesforceTerritoryInfo/addEditForm';

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

export default function SalesOfficialInfoCollapsePanel() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
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
      <ICustomCard title={`Sales Force Information`} backHandler={backHandler}>
        {/* Basic Sales Force Information tab */}
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
              Basic Sales Force Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <BasicEmployeeInformation />
            </div>
          </AccordionDetails>
        </Accordion>

        {/* Personal Information tab */}
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
          defaultExpanded={true}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
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

        {/* Salesforce territory info tab */}
        <Accordion
          className="general-ledger-collapse-custom"
          expanded={expanded === 'panel2'}
          onChange={handleChange('panel2')}
          defaultExpanded={true}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography className={classes.heading}>
              Salesforce territory Info
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <SalesforceTerrioryInfo />
            </div>
          </AccordionDetails>
        </Accordion>
      </ICustomCard>
    </div>
  );
}
