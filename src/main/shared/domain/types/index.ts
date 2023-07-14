export interface AnyObject {
    [property: string]: any;
}

export type Options = AnyObject;

export type PropertyType = string | Function | object;

export interface PropertyForm {
    in?: boolean; // Can the property be used for input
    out?: boolean; // Can the property be used for output
    name?: string; // Custom name for this form
}

export interface PropertyDefinition {
    type: PropertyType; // For example, 'string', String, or {}
    id?: boolean | number;
    json?: PropertyForm;
    [attribute: string]: any; // Other attributes
}

export interface ModelDefinitionSyntax {
    name: string;
    properties?: {[name: string]: PropertyDefinition | PropertyType};
    [attribute: string]: any;
    settings?: {[name: string]: any};
}

export type DeepPartial<T> =
    | Partial<T> // handle free-form properties, e.g. DeepPartial<AnyObject>
    | {[P in keyof T]?: DeepPartial<T[P]>};

export type DataObject<T extends object> = T | DeepPartial<T>;

export type ValidateStructure<T, Struct> = T extends Struct
    ? Exclude<keyof T, keyof Struct> extends never
        ? T
        : never
    : never;

type Subset<T extends U, U> = U;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
