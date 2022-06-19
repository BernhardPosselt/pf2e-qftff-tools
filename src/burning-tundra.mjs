import {showPopup, travelMethods} from "./random-encounters.mjs";

const terrainTypes = [
    {name: 'Barren Plains', value: 21},  // no encounters, 21+ can never be rolled
    {name: 'Frozen River or Lake', value: 12},
    {name: 'Forested Hills or Mountains', value: 16},
    {name: 'Geyser Field', value: 17},
    {name: 'Grimgorge', value: 14},
    {name: 'Mammoth Graveyard', value: 15},
    {name: 'Tar Forest', value: 14},
    {name: 'Tar Sands', value: 17},
    {name: 'Tar Swamp', value: 14},
];

export function burningTundraEncountersMacro() {
    showPopup({
        title: 'Burning Tundra Random Encounter',
        rollMode: game.settings.get('pf2e-qftff-tools', 'randomEncounterRollMode'),
        compendiumName: 'pf2e-qftff-tools.burning-tundra-random-encounters',
        terrainTypes,
        travelMethods,
        terrainTypesKey: 'burningTundra.terrain',
        travelMethodKey: 'burningTundra.method',
    });
}
