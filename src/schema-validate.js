import lodash from 'lodash';

export function schemaValidate(schema) {
    const keysMap = schema._ids._byKey.keys();
    const keys = [...keysMap];

    return function (params) {
        const data = lodash.pick(params, keys);
        const result = schema.validate(data, { abortEarly: false });
        if (result.error) {
            console.log(result.error.details)
            throw new Error({
                message: result.error.details.map((r) => r.message).join(', '),
            });
        }
    };
}
