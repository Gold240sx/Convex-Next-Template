# Form Field Components

Reusable, standalone form field components extracted from the form builder. These components provide consistent styling, validation, and behavior across your entire application.

## 📁 Directory Structure

```
fields/
├── index.ts              # Main export file
├── TextField.tsx         # Single-line text input
├── TextAreaField.tsx     # Multi-line text input
├── NumberField.tsx       # Number input with min/max
├── SelectField.tsx       # Dropdown select
├── RadioField.tsx        # Radio button group
├── CheckboxField.tsx     # Single checkbox
├── DateField.tsx         # Date picker
└── README.md            # This file
```

## 🚀 Quick Start

### Import Components

```typescript
import { 
  TextField, 
  SelectField, 
  CheckboxField 
} from '@/components/myComponents/forms/fields';
```

### Basic Usage

```typescript
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    message: '',
    subscribe: false,
  });

  return (
    <form className="space-y-4">
      <TextField
        label="Full Name"
        value={formData.name}
        onChange={(value) => setFormData({ ...formData, name: value })}
        required
        placeholder="John Doe"
      />

      <TextField
        label="Email"
        value={formData.email}
        onChange={(value) => setFormData({ ...formData, email: value })}
        required
        placeholder="john@example.com"
        regexPattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
      />

      <SelectField
        label="Country"
        value={formData.country}
        onChange={(value) => setFormData({ ...formData, country: value })}
        options={['USA', 'Canada', 'UK', 'Australia']}
        placeholder="Select your country"
      />

      <TextAreaField
        label="Message"
        value={formData.message}
        onChange={(value) => setFormData({ ...formData, message: value })}
        rows={5}
        resizable={true}
        placeholder="Tell us about your project..."
      />

      <CheckboxField
        label="Subscribe to newsletter"
        checked={formData.subscribe}
        onChange={(checked) => setFormData({ ...formData, subscribe: checked })}
        helpText="We'll send you updates about new features"
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

## 📚 Component Reference

### TextField

Single-line text input with optional regex validation.

**Props:**
- `label?: string` - Field label
- `placeholder?: string` - Placeholder text
- `required?: boolean` - Mark as required
- `helpText?: string` - Help text below input
- `value?: string` - Current value
- `onChange?: (value: string) => void` - Change handler
- `disabled?: boolean` - Disable input
- `regexPattern?: string` - Validation pattern
- `className?: string` - Additional CSS classes

**Example:**
```typescript
<TextField
  label="Username"
  value={username}
  onChange={setUsername}
  required
  regexPattern="^[a-zA-Z0-9_]{3,20}$"
  helpText="3-20 characters, letters, numbers, and underscores only"
/>
```

### TextAreaField

Multi-line text input with configurable rows and resize behavior.

**Props:**
- `label?: string`
- `placeholder?: string`
- `required?: boolean`
- `helpText?: string`
- `value?: string`
- `onChange?: (value: string) => void`
- `disabled?: boolean`
- `rows?: number` - Number of visible rows (default: 4)
- `resizable?: boolean` - Allow vertical resize (default: true)
- `className?: string`

**Example:**
```typescript
<TextAreaField
  label="Description"
  value={description}
  onChange={setDescription}
  rows={6}
  resizable={false}
  placeholder="Describe your project in detail..."
/>
```

### NumberField

Number input with min/max/step validation.

**Props:**
- `label?: string`
- `placeholder?: string`
- `required?: boolean`
- `helpText?: string`
- `value?: number`
- `onChange?: (value: number) => void`
- `disabled?: boolean`
- `min?: number` - Minimum value
- `max?: number` - Maximum value
- `step?: number` - Step increment (default: 1)
- `className?: string`

**Example:**
```typescript
<NumberField
  label="Age"
  value={age}
  onChange={setAge}
  min={18}
  max={120}
  step={1}
  required
/>
```

### SelectField

Dropdown select with dynamic options.

**Props:**
- `label?: string`
- `placeholder?: string`
- `required?: boolean`
- `helpText?: string`
- `value?: string`
- `onChange?: (value: string) => void`
- `disabled?: boolean`
- `options?: string[]` - Array of options
- `className?: string`

**Example:**
```typescript
<SelectField
  label="Priority"
  value={priority}
  onChange={setPriority}
  options={['Low', 'Medium', 'High', 'Urgent']}
  placeholder="Select priority level"
/>
```

### RadioField

Radio button group for single selection.

**Props:**
- `label?: string`
- `helpText?: string`
- `value?: string`
- `onChange?: (value: string) => void`
- `disabled?: boolean`
- `required?: boolean`
- `options?: string[]`
- `className?: string`

**Example:**
```typescript
<RadioField
  label="Preferred Contact Method"
  value={contactMethod}
  onChange={setContactMethod}
  options={['Email', 'Phone', 'Text Message']}
  required
/>
```

### CheckboxField

Single checkbox with label and help text.

**Props:**
- `label?: string`
- `helpText?: string`
- `checked?: boolean`
- `onChange?: (checked: boolean) => void`
- `disabled?: boolean`
- `required?: boolean`
- `className?: string`

**Example:**
```typescript
<CheckboxField
  label="I agree to the Terms of Service"
  checked={agreedToTerms}
  onChange={setAgreedToTerms}
  required
  helpText="You must agree to continue"
/>
```

### DateField

Date picker with min/max validation.

**Props:**
- `label?: string`
- `helpText?: string`
- `value?: string` - ISO date string (YYYY-MM-DD)
- `onChange?: (value: string) => void`
- `disabled?: boolean`
- `required?: boolean`
- `min?: string` - Minimum date (YYYY-MM-DD)
- `max?: string` - Maximum date (YYYY-MM-DD)
- `className?: string`

**Example:**
```typescript
<DateField
  label="Birth Date"
  value={birthDate}
  onChange={setBirthDate}
  max={new Date().toISOString().split('T')[0]}
  required
/>
```

## 🎨 Styling

All components use Shadcn UI components and follow your theme automatically. They support:
- Light/Dark mode
- Custom CSS classes via `className` prop
- Consistent spacing and typography
- Accessible focus states

## ✅ Features

- **Type-safe** - Full TypeScript support
- **Accessible** - ARIA labels and keyboard navigation
- **Validated** - Built-in HTML5 validation
- **Themed** - Automatic theme support
- **Flexible** - Highly customizable via props
- **Consistent** - Same API across all components

## 🔧 Extending

To add a new field component:

1. Create a new file in this directory (e.g., `EmailField.tsx`)
2. Follow the existing pattern with props interface
3. Export from `index.ts`
4. Add documentation to this README

**Template:**
```typescript
import React from 'react';
import { Input } from '@/components/shadcn/input';
import { Label } from '@/components/shadcn/label';

export interface MyFieldProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  // ... other props
}

export function MyField({
  label,
  value,
  onChange,
  // ... other props
}: MyFieldProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      {/* Your field implementation */}
    </div>
  );
}
```

## 📝 Best Practices

1. **Always provide labels** for accessibility
2. **Use help text** to guide users
3. **Mark required fields** with the `required` prop
4. **Validate on submit** not just on change
5. **Handle errors** gracefully with error states
6. **Test with keyboard** navigation

## 🚧 TODO

Components to add:
- [ ] EmailField (with email validation)
- [ ] UrlField (with URL validation)
- [ ] PhoneField (using PhoneNoInput)
- [ ] DateRangeField
- [ ] SliderField
- [ ] SwitchField
- [ ] FileUploadField
- [ ] AddressField
- [ ] StarRatingField
- [ ] HappinessRatingField
- [ ] ColorPickerField
- [ ] TagsField (multi-select with chips)

## 📖 Related

- [Form Builder](/admin/forms) - Visual form creator
- [Shadcn UI](https://ui.shadcn.com/) - Component library
- [React Hook Form](https://react-hook-form.com/) - Form state management
