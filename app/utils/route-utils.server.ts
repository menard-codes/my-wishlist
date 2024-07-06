
export function checkRequiredFormFields(
    formData: FormData,
    requiredFields: string[]
): { errors: {[key: string]: string} } {
    const errors: {[key: string]: string} = {};

    requiredFields.forEach(field => {
        if (!formData.get(field)) {
            errors[field] = `${field} is required`;
        }
    })
    
    return { errors };
}
