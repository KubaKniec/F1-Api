import circuit from "../JSONsForGraphQl/Circuit.json" assert { type: "json" };
import race from "../JSONsForGraphQl/race.json" assert { type: "json" };

export const resolvers = {
    Query: {
        circuits: () => circuit.Circuit,
        race: () => race.Race
    },
    // Circuit dodac obiekt
    //i dostac potem konkretny obiekt

}