import {burningTundraEncountersMacro} from "./random-encounters.mjs";

Hooks.on('init', () => {
    game.pf2eQftffTools = {
        macros: {
            burningTundraEncountersMacro
        }
    }
});
