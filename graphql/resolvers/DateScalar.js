import { GraphQLScalarType, Kind } from "graphql";

export const DateScalar = new GraphQLScalarType({
    name: "Date",
    description: "Custom scalar for handling dates in YYYY-MM-DD format",

    // Wartość wysyłana do klienta
    serialize(value) {
        if (typeof value === "string") {
            return value;
        }
        if (value instanceof Date) {
            return value.toISOString().split("T")[0]; // Konwersja do YYYY-MM-DD
        }
        throw new TypeError("DateScalar can only serialize Date objects or valid date strings");
    },

    parseValue(value) {
        if (typeof value !== "string") {
            throw new TypeError("DateScalar can only parse strings");
        }
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new TypeError("Invalid date format");
        }
        return date;
    },

    parseLiteral(ast) {
        if (ast.kind !== Kind.STRING) {
            throw new TypeError("DateScalar can only parse string literals");
        }
        const date = new Date(ast.value);
        if (isNaN(date.getTime())) {
            throw new TypeError("Invalid date format");
        }
        return date;
    },
});
