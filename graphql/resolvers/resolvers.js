import circuit from "../JSONsForGraphQl/Circuit.json" assert { type: "json" };
import race from "../JSONsForGraphQl/race.json" assert { type: "json" };
import driver from "../JSONsForGraphQl/driver.json" assert { type: "json" };
import constructor from "../JSONsForGraphQl/Constructor.json"  assert { type: "json" };


export const resolvers = {
    Query: {
        circuits: () => circuit.Circuit,
        race: () => race.Race,
        driver: () => driver.Driver,
        constructor: () => constructor.Constructor

    },
    // Circuit dodac obiekt
    //i dostac potem konkretny obiekt

}