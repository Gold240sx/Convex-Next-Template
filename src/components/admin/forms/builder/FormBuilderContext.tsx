import { createContext, useContext } from 'react';

interface FormBuilderContextType {
    openRTFEditor: (fieldId: string, content: string) => void;
}

export const FormBuilderContext = createContext<FormBuilderContextType>({
    openRTFEditor: () => console.warn("FormBuilderContext not initialized")
});

export const useFormBuilderContext = () => useContext(FormBuilderContext);
