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
import ICustomCard from '../../../_helper/_customCard';
import InsurancePolicyForm from './collapsePanels/insuranceInformation/form/addEditForm';
import ShipmentWisePolicy from './collapsePanels/shipmentwisePolicy/form/addEditForm';

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

const hide = {
  display: 'none',
};

const block = {
  display: 'block',
};

export default function InsurancePolicyCollapsePanel() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState('false');
  const history = useHistory();
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // toast.dismiss(1)
  };

  const { state } = useLocation();

  useEffect(() => {
    if (state?.checkbox === 'insuranceCoverNote') {
      setExpanded('panel2');
    } else if (state?.checkbox === 'shipmentWiseInsurancePolicy') {
      setExpanded('panel3');
    }
  }, [state]);

  const backHandler = () => {
    history.goBack();
  };
  return (
    <div className={classes.root}>
      <ICustomCard title="Insurance" backHandler={backHandler}>
        <div
          style={
            state?.checkbox === 'shipmentWiseInsurancePolicy' ? hide : block
          }
        >
          {/* Insurance Cover Note */}
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
                Insurance Cover Note
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <InsurancePolicyForm />
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        {/* Shipment Wise Insurance Policy */}
        <div style={state?.checkbox === 'insuranceCoverNote' ? hide : block}>
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
                {/* Shipment Wise Insurance Policy */}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <ShipmentWisePolicy />
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </ICustomCard>
    </div>
  );
}
