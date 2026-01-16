
export interface FormField {
    id: string;
    type: string;
    label?: string;
    children?: FormField[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

// Helper to recursively update fields
export const updateFieldInTree = (fields: FormField[], fieldId: string, updates: Partial<FormField>): FormField[] => {
    return fields.map(field => {
        if (field.id === fieldId) {
            return { ...field, ...updates };
        }
        if (field.children) {
            return { ...field, children: updateFieldInTree(field.children, fieldId, updates) };
        }
        return field;
    });
};

// Helper to recursively remove fields
export const removeFieldFromTree = (fields: FormField[], fieldId: string): FormField[] => {
    return fields.filter(field => field.id !== fieldId).map(field => {
        if (field.children) {
            return { ...field, children: removeFieldFromTree(field.children, fieldId) };
        }
        return field;
    });
};

// Helper to recursively insert field at specific index or target
export const insertFieldInTree = (fields: FormField[], newField: FormField, targetId?: string, position?: 'before' | 'after' | 'inside'): FormField[] => {
    // If no target, and no position, just push to end (handled by caller if root)
    if (!targetId) return [...fields, newField];

    // Check if target is in this list
    const targetIndex = fields.findIndex(f => f.id === targetId);
    if (targetIndex !== -1) {
        if (position === 'inside') {
            const field = fields[targetIndex];
            return [
                ...fields.slice(0, targetIndex),
                { ...field, children: [...(field.children || []), newField] },
                ...fields.slice(targetIndex + 1)
            ];
        } else if (position === 'before') {
            return [
                ...fields.slice(0, targetIndex),
                newField,
                ...fields.slice(targetIndex)
            ];
        } else { // after
            return [
                ...fields.slice(0, targetIndex + 1),
                newField,
                ...fields.slice(targetIndex + 1)
            ];
        }
    }

    // Otherwise recurse
    return fields.map(field => {
        if (field.children) {
            return {
                ...field,
                children: insertFieldInTree(field.children, newField, targetId, position)
            };
        }
        return field;
    });
};
