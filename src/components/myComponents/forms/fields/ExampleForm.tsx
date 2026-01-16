'use client';

import React, { useState } from 'react';
import {
  TextField,
  TextAreaField,
  NumberField,
  SelectField,
  RadioField,
  CheckboxField,
  DateField,
} from './index';
import { Button } from '@/components/shadcn/button';

/**
 * Example usage of reusable form field components
 * 
 * This demonstrates how to use the extracted form components
 * in your own custom forms throughout the application.
 */
export function ExampleForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: 0,
    country: '',
    contactMethod: '',
    message: '',
    newsletter: false,
    birthDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-6">
      <h2 className="text-2xl font-bold">Contact Form Example</h2>

      {/* Text Input */}
      <TextField
        label="Full Name"
        value={formData.name}
        onChange={(value) => setFormData({ ...formData, name: value })}
        required
        placeholder="John Doe"
        helpText="Enter your legal name"
      />

      {/* Email with Regex Validation */}
      <TextField
        label="Email Address"
        value={formData.email}
        onChange={(value) => setFormData({ ...formData, email: value })}
        required
        placeholder="john@example.com"
        regexPattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
        helpText="We'll never share your email"
      />

      {/* Number Input */}
      <NumberField
        label="Age"
        value={formData.age}
        onChange={(value) => setFormData({ ...formData, age: value })}
        min={18}
        max={120}
        step={1}
        required
        helpText="You must be 18 or older"
      />

      {/* Select Dropdown */}
      <SelectField
        label="Country"
        value={formData.country}
        onChange={(value) => setFormData({ ...formData, country: value })}
        options={['United States', 'Canada', 'United Kingdom', 'Australia', 'Other']}
        placeholder="Select your country"
        required
      />

      {/* Radio Buttons */}
      <RadioField
        label="Preferred Contact Method"
        value={formData.contactMethod}
        onChange={(value) => setFormData({ ...formData, contactMethod: value })}
        options={['Email', 'Phone', 'Text Message']}
        required
        helpText="How would you like us to reach you?"
      />

      {/* Date Picker */}
      <DateField
        label="Birth Date"
        value={formData.birthDate}
        onChange={(value) => setFormData({ ...formData, birthDate: value })}
        max={new Date().toISOString().split('T')[0]}
        required
        helpText="Must be 18 or older"
      />

      {/* Textarea */}
      <TextAreaField
        label="Message"
        value={formData.message}
        onChange={(value) => setFormData({ ...formData, message: value })}
        rows={5}
        resizable={true}
        placeholder="Tell us about your project..."
        helpText="Please provide as much detail as possible"
      />

      {/* Checkbox */}
      <CheckboxField
        label="Subscribe to our newsletter"
        checked={formData.newsletter}
        onChange={(checked) => setFormData({ ...formData, newsletter: checked })}
        helpText="Get updates about new features and products"
      />

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" className="flex-1">
          Submit Form
        </Button>
        <Button 
          type="button" 
          variant="outline"
          onClick={() => setFormData({
            name: '',
            email: '',
            age: 0,
            country: '',
            contactMethod: '',
            message: '',
            newsletter: false,
            birthDate: '',
          })}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
