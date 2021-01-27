import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

import { toggleLightControlActive } from '~/features/light-control/actions';
import { isLightControlActive } from '~/features/light-control/selectors';
import { isConnected } from '~/features/servers/selectors';

/**
 * Component that explains to the user how the drones will start after the
 * authorization has been given.
 */
const LightControlMainSwitch = ({ active, connected, onToggle }) => (
  <ListItem
    button
    disabled={!connected}
    onClick={connected ? onToggle : undefined}
  >
    <Switch checked={active && connected} />
    <ListItemText
      primary={
        connected
          ? active
            ? 'Lights controlled from GCS'
            : 'Lights not controlled from GCS'
          : 'Not connected to server'
      }
      secondary={
        connected
          ? active
            ? 'Click to restore default light program'
            : 'Click to take control'
          : 'Connect to a server to control lights'
      }
    />
  </ListItem>
);

LightControlMainSwitch.propTypes = {
  active: PropTypes.bool,
  connected: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default connect(
  // mapStateToProps
  (state) => ({
    active: isLightControlActive(state),
    connected: isConnected(state),
  }),
  // mapDispatchToProps
  {
    onToggle: toggleLightControlActive,
  }
)(LightControlMainSwitch);
