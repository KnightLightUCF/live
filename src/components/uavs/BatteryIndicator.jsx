import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import BatteryAlertIcon from '@material-ui/icons/BatteryAlert';
import Battery20Icon from '@material-ui/icons/Battery20';
import Battery30Icon from '@material-ui/icons/Battery30';
import Battery50Icon from '@material-ui/icons/Battery50';
import Battery60Icon from '@material-ui/icons/Battery60';
import Battery80Icon from '@material-ui/icons/Battery80';
import Battery90Icon from '@material-ui/icons/Battery90';
import BatteryFullIcon from '@material-ui/icons/BatteryFull';
import BatteryCharging20Icon from '@material-ui/icons/BatteryCharging20';
import BatteryCharging30Icon from '@material-ui/icons/BatteryCharging30';
import BatteryCharging50Icon from '@material-ui/icons/BatteryCharging50';
import BatteryCharging60Icon from '@material-ui/icons/BatteryCharging60';
import BatteryCharging80Icon from '@material-ui/icons/BatteryCharging80';
import BatteryCharging90Icon from '@material-ui/icons/BatteryCharging90';
import BatteryChargingFullIcon from '@material-ui/icons/BatteryChargingFull';

import Colors from '~/components/colors';
import CustomPropTypes from '~/utils/prop-types';
import { isNil } from 'lodash-es';

const useStyles = makeStyles(
  (theme) => ({
    root: {
      marginTop: theme.spacing(0.5),
      padding: '0 2px',
      textAlign: 'center',
      userSelect: 'none',
      width: '100%',
    },

    batteryFull: {
      color: Colors.success,
      fontWeight: 'bold',
    },

    batteryWarning: {
      backgroundColor: Colors.warning,
      borderRadius: `${theme.shape.borderRadius * 2}px`,
      color: theme.palette.getContrastText(Colors.warning),
    },

    batteryError: {
      backgroundColor: Colors.error,
      borderRadius: `${theme.shape.borderRadius * 2}px`,
      color: theme.palette.getContrastText(Colors.error),
      fontWeight: 'bold',
    },
  }),
  { name: 'BatteryIndicator' }
);

const iconStyle = {
  marginLeft: -8,
  marginTop: -2,
  verticalAlign: 'bottom',
};

const unknownIconStyle = {};

const batteryIcons = [
  <BatteryAlertIcon key='batteryIcon' fontSize='small' style={iconStyle} />,
  <BatteryAlertIcon key='batteryIcon' fontSize='small' style={iconStyle} />,
  <Battery20Icon key='batteryIcon' fontSize='small' style={iconStyle} />,
  <Battery30Icon key='batteryIcon' fontSize='small' style={iconStyle} />,
  <Battery50Icon key='batteryIcon' fontSize='small' style={iconStyle} />,
  <Battery50Icon key='batteryIcon' fontSize='small' style={iconStyle} />,
  <Battery60Icon key='batteryIcon' fontSize='small' style={iconStyle} />,
  <Battery80Icon key='batteryIcon' fontSize='small' style={iconStyle} />,
  <Battery80Icon key='batteryIcon' fontSize='small' style={iconStyle} />,
  <Battery90Icon key='batteryIcon' fontSize='small' style={iconStyle} />,
  <BatteryFullIcon key='batteryIcon' fontSize='small' style={iconStyle} />,
  <span key='batteryIcon' style={unknownIconStyle}>
    {' '}
  </span>,
];

const chargingBatteryIcons = [
  <BatteryCharging20Icon
    key='batteryIcon'
    fontSize='small'
    style={iconStyle}
  />,
  <BatteryCharging20Icon
    key='batteryIcon'
    fontSize='small'
    style={iconStyle}
  />,
  <BatteryCharging20Icon
    key='batteryIcon'
    fontSize='small'
    style={iconStyle}
  />,
  <BatteryCharging30Icon
    key='batteryIcon'
    fontSize='small'
    style={iconStyle}
  />,
  <BatteryCharging50Icon
    key='batteryIcon'
    fontSize='small'
    style={iconStyle}
  />,
  <BatteryCharging50Icon
    key='batteryIcon'
    fontSize='small'
    style={iconStyle}
  />,
  <BatteryCharging60Icon
    key='batteryIcon'
    fontSize='small'
    style={iconStyle}
  />,
  <BatteryCharging80Icon
    key='batteryIcon'
    fontSize='small'
    style={iconStyle}
  />,
  <BatteryCharging80Icon
    key='batteryIcon'
    fontSize='small'
    style={iconStyle}
  />,
  <BatteryCharging90Icon
    key='batteryIcon'
    fontSize='small'
    style={iconStyle}
  />,
  <BatteryChargingFullIcon
    key='batteryIcon'
    fontSize='small'
    style={iconStyle}
  />,
  <span key='batteryIcon' style={unknownIconStyle} />,
];

const batteryIconIndexByStatus = {
  Full: 10,
  NearFull: 9,
  Ok: 8,
  Warning: 3,
  Error: 0,
  Unknown: 11,
};

function getVoltagePerCell(voltage, cellCount, settings) {
  if (cellCount === undefined) {
    cellCount = settings ? settings.defaultCellCount : 3;
  }

  return voltage === undefined || cellCount < 1 ? 0 : voltage / cellCount;
}

/**
 * Converts a battery voltage to a crude estimate of the percentage.
 */
const estimatePercentageFromVoltagePerCell = (
  voltagePerCell,
  { voltageThresholds } = {}
) => {
  if (!voltageThresholds) {
    return undefined;
  }

  const { empty, full } = voltageThresholds;

  if (voltagePerCell <= empty) {
    return 0;
  } else if (voltagePerCell >= full) {
    return 100;
  } else {
    return Math.round(((voltagePerCell - empty) / (full - empty)) * 100);
  }
};

const getBatteryIcon = (percentage, status, charging) => {
  const index =
    percentage === undefined
      ? batteryIconIndexByStatus[status]
      : Math.round(Math.min(Math.max(percentage, 0), 100) / 10);
  const iconSet = charging ? chargingBatteryIcons : batteryIcons;
  return iconSet[index];
};

// Percentage thresholds for full, normal, low
const percentageThresholds = {
  Full: 95,
  NearFull: 60,
  Ok: 20,
  Warning: 10,
};

/**
 * Returns a suggested battery status level, given the voltage and charge
 * percentage of the battery, the number of cells in the battery, and a
 * settings object that contains the voltage thresholds for the individual
 * states, per cell.
 */
function getBatteryStatus(voltage, percentage, cellCount, settings) {
  if (percentage) {
    return percentage > percentageThresholds.Full
      ? 'Full'
      : percentage > percentageThresholds.NearFull
      ? 'NearFull'
      : percentage > percentageThresholds.Ok
      ? 'Ok'
      : percentage > percentageThresholds.Warning
      ? 'Warning'
      : 'Error';
  }

  if (!settings || !settings.voltageThresholds) {
    return 'Unknown';
  }

  const voltagePerCell = getVoltagePerCell(voltage, cellCount, settings);
  const { voltageThresholds } = settings;

  return voltagePerCell > voltageThresholds.nearFull
    ? 'Full'
    : voltagePerCell >= voltageThresholds.ok
    ? 'NearFull'
    : voltagePerCell >= voltageThresholds.warning
    ? 'Ok'
    : voltagePerCell >= voltageThresholds.critical
    ? 'Warning'
    : 'Error';
}

/**
 * Function that takes a drone object from the Redux store and derives the
 * battery information that can be used in a `<BatteryIndicator>` component,
 * taking into account the user's preference to see voltages versus percentages.
 */
function getBatteryLabel(voltage, percentage, cellCount, settings = {}) {
  const { displayStyle = 'voltage' } = settings;

  if (isNil(percentage)) {
    if (isNil(voltage)) {
      return '???';
    } else if (displayStyle === 'forcedPercentage') {
      // User wants percentage all the time so let's convert voltage to percentage
      const voltagePerCell = getVoltagePerCell(voltage, cellCount, settings);
      const estimatedPercentage = estimatePercentageFromVoltagePerCell(
        voltagePerCell,
        settings
      );
      if (isNil(estimatedPercentage)) {
        return `${voltage}V`;
      } else {
        return `${estimatedPercentage}%`;
      }
    } else {
      // No percentage info but we have voltage
      return `${voltage}V`;
    }
  } else {
    // We have percentage
    if (displayStyle !== 'voltage' || isNil(voltage)) {
      return `${percentage}%`;
    } else {
      // ...but the user prefers voltage and we have it, so show that one instead
      return `${voltage}V`;
    }
  }
}

/**
 * Presentational component for a battery charge indicator.
 */
const BatteryIndicator = ({
  charging,
  className,
  cellCount,
  percentage,
  settings,
  voltage,
}) => {
  const classes = useStyles();
  const status = getBatteryStatus(voltage, percentage, cellCount, settings);
  const rootClass = clsx(className, classes.root, classes[`battery${status}`]);
  const batteryIcon = getBatteryIcon(percentage, status, charging);
  const label = getBatteryLabel(voltage, percentage, cellCount, settings);
  return (
    <Box fontSize='small' className={rootClass}>
      {batteryIcon}
      {label}
    </Box>
  );
};

BatteryIndicator.propTypes = {
  cellCount: PropTypes.number,
  className: PropTypes.string,
  charging: PropTypes.bool,
  percentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  settings: CustomPropTypes.batterySettings,
  voltage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default BatteryIndicator;
