import { useState } from "react";

export default function useForm<T extends ReadonlyArray<string>[number]>(
    fieldArray: ReadonlyArray<T>
) {
    const [fields, setFields] = useState<Record<T, string>>(() => {
        const obj: any = {};
        fieldArray.forEach((field) => {
            obj[field] = "";
        });

        return obj;
    }); 
    const [error, setError] = useState<{
        field?: T;
        message: string;
    } | null>(null);
    const onFieldChange = (e: React.ChangeEvent<HTMLInputElement>, field: T) => {
        setFields((state) => ({ ...state, [field]: e.target.value }));
        setError(null);
    };
    const validateEmpty = (fieldToValidate?: T[]) => {
        (fieldToValidate || fieldArray).forEach((key) => {
            if (fields[key].trim().length === 0) {
                setError({ field: key, message: "Required field is Empty" });
                throw new Error();
            }
        });
    };
    return {fields, error, setError, onFieldChange, validateEmpty}
}