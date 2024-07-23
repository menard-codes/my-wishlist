
export function checkRequiredFormFields(
    formData: FormData,
    requiredFields: string[]
) {
    const errors: {[key: string]: string} = {};

    requiredFields.forEach(field => {
        if (!formData.get(field)) {
            errors[field] = `${field} is required`;
        }
    })
    
    return { errors };
}

export function checkRequiredObjectProps(obj: {[key: string]: any}, requiredProps: string[]) {
    const errors: {[key: string]: string} = {};

    requiredProps.forEach(prop => {
        if (!obj[prop]) {
            errors[prop] = `${prop} is required`;
        }
    });

    return {errors};
}

/**
 * @description
 * Takes a url string parameter and returns all the search params
 * from that url as a parsed object
 * 
 * @example
 * getURLSearchParams('https://example.com/some/route?name=menard&age=24&isMale=true')
 * { name: 'menard', age: 24, isMale: true }
 * 
 * @param urlStr The URL string
 * @returns URL Search Params object (parsed)
 */
export function getURLSearchParams(urlStr: string) {
    try {
        const url = new URL(urlStr);
        const searchParams = new URLSearchParams(url.search);
        const searchParamsObj: {[key: string]: any} = Object.fromEntries(searchParams.entries());
        Object
            .entries(searchParamsObj)
            .forEach(([key, val]) => {
                try {
                    if (val === 'undefined') {
                        searchParamsObj[key] = undefined;
                    } else {
                        searchParamsObj[key] = JSON.parse(val)
                    }
                } catch(error) {
                    if (error instanceof SyntaxError) {
                        searchParamsObj[key] = val;
                    }
                }
            })
        return searchParamsObj;
    } catch (error) {
        // TODO: Logger
        console.error(error);
        return {}
    }
}
