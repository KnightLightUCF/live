import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MaterialUISwitch from '@material-ui/core/Switch';
import MaterialUITextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import PropTypes from 'prop-types';
import React from 'react';
import useToggle from 'react-use-toggle';

/**
 * Render function for `react-final-form` that binds a `<Field>` component
 * to a Material UI `<Switch>`.
 *
 * @param  {Object} props  props provided by `react-final-form`
 * @return {Object} the rendered Material UI switch component
 */
export const Switch = ({ input, meta, ...rest }) => {
  const { checked, name, onChange, ...restInput } = input;
  return (
    <MaterialUISwitch
      {...rest}
      name={name}
      inputProps={restInput}
      checked={checked}
      onChange={onChange}
    />
  );
};

Switch.propTypes = {
  input: PropTypes.any,
  meta: PropTypes.any,
};

const preventDefault = (event) => event.preventDefault();

/**
 * Render function for `react-final-form` that binds a `<Field>` component
 * to a Material UI `<TextField>`, configured to be suitable for password
 * entry.
 *
 * @param  {Object} props  props provided by `react-final-form`
 * @return {Object} the rendered Material UI text field component
 */
export const PasswordField = ({ input, meta, ...rest }) => {
  const [passwordIsMasked, togglePasswordMask] = useToggle(true);

  const { name, onChange, value, ...restInput } = input;
  const showError =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
    meta.touched;
  return (
    <MaterialUITextField
      variant='filled'
      {...rest}
      name={name}
      type={passwordIsMasked ? 'password' : 'text'}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      value={value}
      inputProps={{
        autoComplete: 'current-password',
        ...restInput,
        type: passwordIsMasked ? 'password' : 'text',
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={togglePasswordMask}
              onMouseDown={preventDefault}
            >
              {passwordIsMasked ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      onChange={onChange}
    />
  );
};

PasswordField.propTypes = {
  input: PropTypes.any,
  meta: PropTypes.any,
};

/**
 * Render function for `react-final-form` that binds a `<Field>` component
 * to a Material UI `<TextField>`.
 *
 * @param  {Object} props  props provided by `react-final-form`
 * @return {Object} the rendered Material UI text field component
 */
export const TextField = ({ input, meta, ...rest }) => {
  const { name, onChange, value, ...restInput } = input;
  const showError =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
    meta.touched;
  return (
    <MaterialUITextField
      variant='filled'
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      inputProps={restInput}
      value={value}
      onChange={onChange}
    />
  );
};

TextField.propTypes = {
  input: PropTypes.any,
  meta: PropTypes.any,
};

// This is designed to be used in conjunction with react-final-form
export const AngleField = ({ max, min, size, step, ...rest }) => {
  const { inputProps, InputProps, ...restRest } = rest;
  return (
    <TextField
      InputProps={{
        ...InputProps,
        endAdornment: <InputAdornment position='end'>degrees</InputAdornment>,
      }}
      inputProps={{
        ...inputProps,
        max,
        min,
        size,
        step,
        type: 'number',
      }}
      {...restRest}
    />
  );
};

AngleField.propTypes = {
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  size: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.number,
};

// This is NOT designed to be used in conjunction with react-final-form; it is a
// standalone controlled field based on Material UI
export const DistanceField = ({ max, min, size, step, ...rest }) => (
  <MaterialUITextField
    InputProps={{
      endAdornment: <InputAdornment position='end'>m</InputAdornment>,
    }}
    inputProps={{ max, min, size, step, type: 'number' }}
    variant='filled'
    {...rest}
  />
);

DistanceField.propTypes = {
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  size: PropTypes.number,
  step: PropTypes.number,
  value: PropTypes.number,
};

// This is NOT designed to be used in conjunction with react-final-form; it is a
// standalone controlled field based on Material UI
export const DurationField = ({ max, min, size, ...rest }) => (
  <MaterialUITextField
    InputProps={{
      endAdornment: <InputAdornment position='end'>seconds</InputAdornment>,
    }}
    inputProps={{ max, min, size, type: 'number' }}
    {...rest}
  />
);

DurationField.propTypes = {
  max: PropTypes.number,
  min: PropTypes.number,
  onChange: PropTypes.func,
  size: PropTypes.number,
  value: PropTypes.number,
};

DurationField.defaultProps = {
  size: 4,
};
