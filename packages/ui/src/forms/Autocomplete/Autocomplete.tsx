import { Autocomplete as MuiAutocomplete, AutocompleteProps as MuiAutocompleteProps, TextField } from '@mui/material';

export interface AutocompleteProps<T> extends Omit<MuiAutocompleteProps<T, boolean, boolean, boolean>, 'renderInput'> {
  label?: string;
  placeholder?: string;
}

export function Autocomplete<T>({ label, placeholder, ...props }: AutocompleteProps<T>) {
  return (
    <MuiAutocomplete
      {...props}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
    />
  );
}
