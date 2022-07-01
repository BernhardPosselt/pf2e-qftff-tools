import {getRollMode} from './settings.mjs';
import {buildUuids, rollRollTable} from './roll-tables.mjs';

export async function shadowPlaneEncountersMacro(game: Game): Promise<void> {
    const rollMode = getRollMode(game, 'randomEncounterRollMode');
    const uuids = await buildUuids(game);
    await rollRollTable(game, uuids['Shadow Plane Encounters'], {rollMode});
}
