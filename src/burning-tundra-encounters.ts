import {showPopup, travelMethods} from './random-encounters';
import {buildUuids, RollTableResult} from './roll-tables';
import {getRollMode} from './settings';
import {CompletedEncounterStorage} from './burning-tundra-checklist';

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

export async function burningTundraEncountersMacro(game: Game): Promise<void> {
    const checklist = new CompletedEncounterStorage(game);
    const rollMode = getRollMode(game, 'randomEncounterRollMode');
    await showPopup({
        game,
        title: 'Burning Tundra Random Encounter',
        rollMode,
        rollTablesUuids: await buildUuids(game),
        terrainTypes,
        travelMethods,
        terrainTypesKey: 'burningTundra.terrain',
        travelMethodKey: 'burningTundra.method',
        customRender: async ({table, draw}: RollTableResult) => {
            const {results} = draw;
            const text = results[0].data.text;
            const checkedOff = checklist.getCheckedOff();
            const checkedOffValue = checkedOff.find(checked => text.startsWith(checked));
            if (checkedOffValue) {
                results[0].data.text = `${checkedOffValue} already happened, nothing happens!`;
            }
            await table.toMessage(results, {roll: draw.roll, messageOptions: {rollMode}});
        },
    });
}
