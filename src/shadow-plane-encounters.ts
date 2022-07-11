import {getRollMode} from './settings';
import {buildUuids, rollRollTable} from './roll-tables';

export async function shadowPlaneEncountersMacro(game: Game): Promise<void> {
    const rollMode = getRollMode(game, 'randomEncounterRollMode');
    const uuids = await buildUuids(game);
    await rollRollTable(game, uuids['Shadow Plane Encounters'], {rollMode});
}
