import circuit from "../JSONsForGraphQl/Circuit.json" assert { type: "json" };
import race from "../JSONsForGraphQl/race.json" assert { type: "json" };
import driver from "../JSONsForGraphQl/driver.json" assert { type: "json" };
import constructor from "../JSONsForGraphQl/Constructor.json"  assert { type: "json" };
import { DateScalar } from "./DateScalar.js";

export const resolvers = {
    Query: {
        circuits: (_, { filter, sort }) => {
            return applyAdvancedOperations(circuit.Circuit, filter, sort);
        },
        races: (_, { filter, sort }) => {
            return applyAdvancedOperations(race.Race, filter, sort);
        },
        drivers: (_, { filter, sort }) => {
            return applyAdvancedOperations(driver.Driver, filter, sort);
        },
        constructors: (_, { filter, sort }) => {
            return applyAdvancedOperations(constructor.Constructor, filter, sort);
        },
    },Date: DateScalar,
}
function applyAdvancedOperations(data, filter, sort) {
    let result = data;

    //Filtering
    if (filter) {
        result = result.filter(item => matchesFilter(item, filter));
    }

    //Sorting
    if (sort) {
        const { field, order } = sort;
        result = result.sort((a, b) => {
            if (a[field] < b[field]) return order === 'ASC' ? -1 : 1;
            if (a[field] > b[field]) return order === 'ASC' ? 1 : -1;
            return 0;
        });
    }


    return result;
}

function matchesFilter(item, filter) {
    for (const key in filter) {
        const value = filter[key];
        if (typeof value === 'object') {
            if (!applyFilter(value, item[key])) {
                return false;
            }
        }
    }
    return true;
}

function applyFilter(filter, fieldValue) {
    if ('eq' in filter && fieldValue !== filter.eq) return false;                                 // Sprawdza równość.
    if ('neq' in filter && fieldValue === filter.neq) return false;                              // Sprawdza nierówność.
    if ('contains' in filter && !fieldValue.includes(filter.contains)) return false;            // Sprawdza zawieranie.
    if ('notContains' in filter && fieldValue.includes(filter.notContains)) return false;      // Sprawdza brak zawierania.
    if ('gt' in filter && fieldValue <= filter.gt) return false;                              // Sprawdza czy większe.
    if ('lt' in filter && fieldValue >= filter.lt) return false;                             // Sprawdza czy mniejsze.
    if ('gte' in filter && fieldValue < filter.gte) return false;                           // Sprawdza czy większe/równe.
    if ('lte' in filter && fieldValue > filter.lte) return false;                          // Sprawdza czy mniejsze/równe.
    return true;                                                                          // Jeśli wszystkie warunki są spełnione, zwraca true.
}

