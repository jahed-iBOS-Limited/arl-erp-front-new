import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PartnerBank from './collpaseComponent/partnerBank/partnerBank';
import PartnerPurchase from './collpaseComponent/partnerPurchase/partnerPurchase';
import PartnerBasicInfo from './collpaseComponent/partnerBasic/partnerBasic';
import PartnerSales from './collpaseComponent/partnerSales/partnerSales';
import ICustomCard from '../../../../_helper/_customCard';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';

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

export default function MainCollapsePanel() {
  const { state } = useLocation();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // toast.dismiss(1)
  };
  const history = useHistory();
  const businessPartnerNameFromHistory =
    history?.location?.state?.businessPartnerName;
  const businessPartnerCodeFromHistory =
    history?.location?.state?.businessPartnerCode;

  const businessPartnerNameCollapsed = state?.tableData?.businessPartnerName;
  const businessPartnerCodeCollapsed = state?.tableData?.businessPartnerCode;

  useEffect(() => {
    if (state?.checkBox === 'BasicInformation') {
      setExpanded('panel1');
    } else if (state?.checkBox === 'BankInformation') {
      setExpanded('panel2');
    } else if (state?.checkBox === 'PurchaseInformation') {
      setExpanded('panel3');
    } else if (state?.checkBox === 'SalesInformation') {
      setExpanded('panel4');
    }

  }, [state]);

  return (
    <ICustomCard
      title={`Partner Information [${
        businessPartnerNameFromHistory || businessPartnerNameCollapsed
      }-${businessPartnerCodeFromHistory || businessPartnerCodeCollapsed}]`}
      backHandler={() =>
        history.push('/config/partner-management/partner-other-info')
      }
    >
      <div className={classes.root}>
        {/* Partner Basic Information */}
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading}>
              Partner Basic Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <PartnerBasicInfo />
            </div>
          </AccordionDetails>
        </Accordion>
        {/* Partner Bank Information */}
        {(state?.businessPartnerTypeName === 'Supplier' ||
          state?.businessPartnerTypeName === 'Customer') && (
          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>
                Partner Bank Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <PartnerBank />
              </div>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Partner Purchase Information  */}
        {state?.businessPartnerTypeName === 'Supplier' && (
          <Accordion
            expanded={expanded === 'panel3'}
            onChange={handleChange('panel3')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography className={classes.heading}>
                Partner Purchase Information{' '}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PartnerPurchase />
            </AccordionDetails>
          </Accordion>
        )}
        {/* Partner Sales Information  */}
        {(state?.businessPartnerTypeName === 'Customer' ||
          state?.businessPartnerTypeName === "Customer's Ship To Party" ||
          state?.businessPartnerTypeName === 'Employee') && (
          <Accordion
            expanded={expanded === 'panel4'}
            onChange={handleChange('panel4')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography className={classes.heading}>
                Partner Sales Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <PartnerSales />
            </AccordionDetails>
          </Accordion>
        )}
      </div>
    </ICustomCard>
  );
}
