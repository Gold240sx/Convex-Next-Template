import type {
  AddressFormValues,
  StripeAddress,
  GoogleAddress,
  AddressComponent,
  GoogleAddressComponent,
  GooglePlaceDetails,
} from "@/types/address";

export const useGoogleAddressConvert = (
  googleAddress: GoogleAddress,
): AddressFormValues => {
  return {
    address_ln1: `${googleAddress.street_number} ${googleAddress.route}`.trim(),
    address_ln2: googleAddress.subpremise || "",
    city: googleAddress.locality,
    state: googleAddress.administrative_area_level_1,
    zip: googleAddress.postal_code,
    country: googleAddress.country,
  };
};

export const useNativeAddressToGoogleConvert = (address: AddressFormValues) => {
  return `${address.address_ln1}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
};

export const useNativeAddressToStripeConvert = (address: AddressFormValues) => {
  return {
    line1: address.address_ln1,
    line2: address.address_ln2,
    city: address.city,
    state: address.state,
    postal_code: address.zip,
    country: address.country,
  };
};

export const verifyAddress = async (address: AddressFormValues) => {
  try {
    const response = await fetch(
      `/api/places/verify?address=${encodeURIComponent(
        useNativeAddressToGoogleConvert(address),
      )}`,
    );

    const data = await response.json();

    if (data.status === "OK" && data.results?.[0]) {
      const googleAddress = data.results[0].formatted_address;
      return {
        isVerified: true,
        googleAddress,
      };
    }

    return {
      isVerified: false,
      googleAddress: null,
    };
  } catch (error) {
    console.error("Error verifying address:", error);
    return {
      isVerified: false,
      googleAddress: null,
    };
  }
};

export const extractAddressComponents = (
  components: GoogleAddressComponent[],
  type: string,
  useShortName = false,
): string => {
  const component = components.find((comp) => comp.types.includes(type));
  return component
    ? useShortName
      ? component.short_name
      : component.long_name
    : "";
};

export const convertGooglePlaceToAddress = (
  place: GooglePlaceDetails,
): AddressFormValues => {
  const streetNumber = extractAddressComponents(
    place.address_components,
    "street_number",
  );
  const route = extractAddressComponents(place.address_components, "route");

  return {
    address_ln1: streetNumber && route ? `${streetNumber} ${route}` : route,
    address_ln2: "",
    city: extractAddressComponents(place.address_components, "locality"),
    state: extractAddressComponents(
      place.address_components,
      "administrative_area_level_1",
      true,
    ),
    zip: extractAddressComponents(place.address_components, "postal_code"),
    country: extractAddressComponents(place.address_components, "country"),
  };
};
