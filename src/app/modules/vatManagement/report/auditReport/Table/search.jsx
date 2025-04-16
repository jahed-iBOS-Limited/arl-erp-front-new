import React from 'react';
import { makeStyles } from '@mui/styles';
import TextField from '@mui/material/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function SearchForAuditReport({ gridAllData, setRowDto }) {
  const classes = useStyles();

  const searchHandler = (data, lists) => {
    const filteredCountries = lists.filter((itm) => {
      return (
        itm?.customHouse?.toLowerCase().indexOf(data.toLowerCase()) !== -1 ||
        itm?.binNo?.toLowerCase().indexOf(data.toLowerCase()) !== -1
      );
    });
    setRowDto(filteredCountries);
  };

  return (
    <div className="">
      <form className={classes.root} noValidate autoComplete="off">
        <div style={{ position: 'relative' }}>
          <TextField
            id="standard-basic"
            label="Custom House Name Search"
            onChange={(e) => {
              searchHandler(e.target.value, gridAllData);
            }}
            color="secondary"
            style={{ width: '170px', marginTop: '-21px', height: '40px' }}
            InputProps={{
              endAdornment: (
                <i
                  className="fas fa-search"
                  style={{
                    fontSize: '13px',
                    color: '#6d8aa7',
                  }}
                ></i>
              ),
            }}
          />
        </div>
      </form>
    </div>
  );
}
