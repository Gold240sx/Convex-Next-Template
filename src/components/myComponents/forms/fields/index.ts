/**
 * Reusable Form Field Components
 * 
 * These components are extracted from the form builder and can be used
 * anywhere in your application for consistent form styling and behavior.
 * 
 * Usage Example:
 * ```tsx
 * import { TextField, SelectField, CheckboxField } from '@/components/myComponents/forms/fields';
 * 
 * function MyForm() {
 *   const [name, setName] = useState('');
 *   const [country, setCountry] = useState('');
 *   const [agreed, setAgreed] = useState(false);
 *   
 *   return (
 *     <form>
 *       <TextField 
 *         label="Full Name"
 *         value={name}
 *         onChange={setName}
 *         required
 *         helpText="Enter your legal name"
 *       />
 *       <SelectField
 *         label="Country"
 *         value={country}
 *         onChange={setCountry}
 *         options={['USA', 'Canada', 'Mexico']}
 *       />
 *       <CheckboxField
 *         label="I agree to the terms"
 *         checked={agreed}
 *         onChange={setAgreed}
 *         required
 *       />
 *     </form>
 *   );
 * }
 * ```
 */

// Basic Input Fields
export { TextField } from './TextField';
export type { TextFieldProps } from './TextField';

export { TextAreaField } from './TextAreaField';
export type { TextAreaFieldProps } from './TextAreaField';

export { NumberField } from './NumberField';
export type { NumberFieldProps } from './NumberField';

export { EmailField } from './EmailField';
export type { EmailFieldProps } from './EmailField';

export { UrlField } from './UrlField';
export type { UrlFieldProps } from './UrlField';

export { PhoneField } from './PhoneField';
export type { PhoneFieldProps } from './PhoneField';

// Selection Fields
export { SelectField } from './SelectField';
export type { SelectFieldProps } from './SelectField';

export { RadioField } from './RadioField';
export type { RadioFieldProps } from './RadioField';

export { CheckboxField } from './CheckboxField';
export type { CheckboxFieldProps } from './CheckboxField';

export { SwitchField } from './SwitchField';
export type { SwitchFieldProps } from './SwitchField';

// Date/Time Fields
export { DateField } from './DateField';
export type { DateFieldProps } from './DateField';

export { DateRangeField } from './DateRangeField';
export type { DateRangeFieldProps, DateRangeValue } from './DateRangeField';

// Interactive Fields
export { SliderField } from './SliderField';
export type { SliderFieldProps } from './SliderField';

export { StarRatingField } from './StarRatingField';
export type { StarRatingFieldProps } from './StarRatingField';

export { HappinessRatingField } from './HappinessRatingField';
export type { HappinessRatingFieldProps, HappinessLevel } from './HappinessRatingField';

// File Upload
export { FileUploadField } from './FileUploadField';
export type { FileUploadFieldProps } from './FileUploadField';

// TODO: Add more field components as needed:
// - AddressField (with Google Autocomplete)
// - ColorPickerField
// - TagsField (multi-select with chips)
// - TimeField
// - DateTimeField
// - CurrencyField
// - PercentageField
