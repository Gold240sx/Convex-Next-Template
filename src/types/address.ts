import { z } from "zod";

export const addressSchema = z.object({
  address_ln1: z.string().min(1, "Street address is required"),
  address_ln2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(1, "Country is required"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;

// Stripe billing address format
export interface StripeAddress {
  line1: string;
  line2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

// Google address format
export interface GoogleAddress {
  street_number: string;
  route: string;
  subpremise?: string;
  locality: string;
  administrative_area_level_1: string;
  postal_code: string;
  country: string;
}

export interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
  languageCode: string;
}

export interface Place {
  id: string;
  displayName: {
    text: string;
  };
  formattedAddress: string;
  addressComponents: AddressComponent[];
}

export interface PlacePrediction {
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface AddressFormProps {
  onSubmit: (data: StripeAddress) => void;
  className?: string;
  onApiCall: () => void;
}

export interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GooglePlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface GooglePlaceDetails {
  address_components: GoogleAddressComponent[];
  formatted_address: string;
}
