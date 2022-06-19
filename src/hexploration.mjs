import {showPopup, travelMethods} from "./random-encounters.mjs";

const terrainTypes = [
    {name: 'Aquatic', value: 17},
    {name: 'Arctic', value: 17},
    {name: 'Desert', value: 17},
    {name: 'Forest', value: 14},
    {name: 'Mountain', value: 16},
    {name: 'Plains', value: 12},
    {name: 'Swamp', value: 14},
];

export function hexplorationEncountersMacro() {
    const rollTableName = game.settings.get("pf2e-qftff-tools", "hexplorationRandomEncounterTable");
    if (!rollTableName) {
        ui.notifications.error('Please configure a rollable table in your module settings!');
    } else {
        showPopup({
            title: 'Hexploration Random Encounter',
            rollMode: game.settings.get('pf2e-qftff-tools', 'randomEncounterRollMode'),
            rollTableName,
            terrainTypes,
            travelMethods,
            terrainTypesKey: 'hexploration.terrain',
            travelMethodKey: 'hexploration.method',
        });
    }
}
