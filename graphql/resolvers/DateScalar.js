import { GraphQLScalarType, Kind } from "graphql";

export const DateScalar = new GraphQLScalarType({
    name: "Date",
    description: "Custom scalar for dates",

    serialize(value) { // serwer -> klient
        if (typeof value === "string") {
            return value;
        }
        if (value instanceof Date) {
            return value.toISOString().split("T")[0]; // YYYY-MM-DD
        }
        throw new TypeError("DateScalar error");
    },

    parseValue(value) { // klient -> serwer (przetwarza dane wejsciowe)
        if (typeof value !== "string") {
            throw new TypeError("DateScalar error");
        }
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            throw new TypeError("Invalid date format");
        }
        return date;
    },

    parseLiteral(ast) { // klient -> serwer (przetwarza z graphQL)
        if (ast.kind !== Kind.STRING) {
            throw new TypeError("DateScalar error");
        }
        const date = new Date(ast.value);
        if (isNaN(date.getTime())) {
            throw new TypeError("Invalid date format");
        }
        return date;
    },
});
