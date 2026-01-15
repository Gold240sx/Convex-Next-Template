import { useState, useCallback } from "react";
import { convertGooglePlaceToAddress } from "@/hooks/useAddressConverters";
import type {
  AddressFormValues,
  GooglePlacePrediction,
} from "@/types/address";

export const useAddressAutocomplete = (onApiCall: () => void) => {
  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddressInput = useCallback(
    async (input: string) => {
      if (!input || input.length < 3) {
        setPredictions([]);
        return;
      }

      setIsLoading(true);
      onApiCall();

      try {
        console.log("Fetching predictions for:", input);
        const response = await fetch(
          `/api/places/autocomplete?input=${encodeURIComponent(input)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const data = await response.json();
        console.log("Received predictions:", data);

        if (data.predictions) {
          setPredictions(data.predictions);
        } else {
          console.log("No predictions found in response:", data);
          setPredictions([]);
        }
      } catch (error) {
        console.error("Error fetching address predictions:", error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [onApiCall],
  );

  const handlePredictionSelect = useCallback(
    async (placeId: string): Promise<AddressFormValues | null> => {
      setIsLoading(true);
      onApiCall();

      try {
        console.log("Fetching place details for:", placeId);
        const response = await fetch(`/api/places/details?placeId=${placeId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Received place details:", data);

        if (data.result) {
          const address = convertGooglePlaceToAddress(data.result);
          setPredictions([]);
          return address;
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      } finally {
        setIsLoading(false);
      }

      return null;
    },
    [onApiCall],
  );

  return {
    predictions,
    setPredictions,
    showManualEntry,
    setShowManualEntry,
    isLoading,
    handleAddressInput,
    handlePredictionSelect,
  };
};
