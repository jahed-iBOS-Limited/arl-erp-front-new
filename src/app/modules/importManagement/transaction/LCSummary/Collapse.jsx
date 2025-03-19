import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useLocation } from 'react-router-dom';
import ICustomCard from '../../../_helper/_customCard';
import BasicInformation from './landingCollapse/basicInformation/form/addEditForm';
import CostSummary from './landingCollapse/costSummary/form/addEditForm';

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

export default function LCSummaryCollapsePanel() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState('false');
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // toast.dismiss(1)
  };

  const { state } = useLocation();

  useEffect(() => {
    if (state?.checkbox === 'insuranceInformation') {
      setExpanded('panel2');
    } else if (state?.checkbox === 'shipmentWisePolicy') {
      setExpanded('panel3');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <div className={classes.root}>
      <ICustomCard
        title="LC Summary"
        // backHandler={backHandler}
      >
        {/* Basic Information */}
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
              Basic Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <BasicInformation />
            </div>
          </AccordionDetails>
        </Accordion>
        {/* Shipment Wise Policy */}
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
              Cost Summary (BDT)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <CostSummary />
            </div>
          </AccordionDetails>
        </Accordion>
      </ICustomCard>
    </div>
  );
}
