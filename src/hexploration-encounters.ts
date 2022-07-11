import {OptionValue, showPopup, travelMethods} from './random-encounters';
import {getRollMode, getStringSetting} from './settings';

const terrainTypes: OptionValue[] = [
    {name: 'Aquatic', value: 17},
    {name: 'Arctic', value: 17},
    {name: 'Desert', value: 17},
    {name: 'Forest', value: 14},
    {name: 'Mountain', value: 16},
    {name: 'Plains', value: 12},
    {name: 'Swamp', value: 14},
];

export async function hexplorationEncountersMacro(game: Game): Promise<void> {
    const rollTableName = getStringSetting(game, 'hexplorationRandomEncounterTable');
    if (!rollTableName) {
        ui.notifications?.error('Please configure a rollable table in your module settings!');
    } else {
        await showPopup({
            game,
            title: 'Hexploration Random Encounter',
            rollMode: getRollMode(game, 'randomEncounterRollMode'),
            rollTablesUuids: rollTableName,
            terrainTypes,
            travelMethods,
            terrainTypesKey: 'hexploration.terrain',
            travelMethodKey: 'hexploration.method',
        });
    }
}
