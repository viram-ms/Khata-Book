import React,{useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import InsertData from './InsertData';
import Table from './Table';
import Cumulative from './Cumulative';
import loading from './loading.gif';
import {useParams} from 'react-router-dom';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box >
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '98vw',
    maxWidth: 700
  },
}));

export default function Details() {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [show, setShow] = useState(false);
  const {roomId, teamId,teamName} = useParams();

  useEffect(() => {
    setTimeout(function() {
        setShow(true)
    },2000);
    setShow(false);
  },[teamId])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  return !show ? (<img src={loading} style={{height: 100, width: 100,margin:'auto',display: 'block'}}/>) : (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Insert Data" {...a11yProps(0)} />
          <Tab label="View Data" {...a11yProps(1)} />
          <Tab label="View Expenses" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
            <InsertData />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
            <Table />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
            <Cumulative />
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
