export interface RollTableResult {
    table: RollTable;
    draw: RollTableDraw;
}

export function getWorldTables(game: Game): RollTable[] {
    return game?.tables?.map(t => t) ?? [];
}

export function getWorldTableUuidMappings(game: Game): Record<string, string> {
    const tables = getWorldTables(game);
    return Object.fromEntries(tables.map((t: RollTable) => [`RollTable.${t.id!}`, t.name!]));
}

export async function rollRollTable(
    game: Game,
    tableUuid: string,
    rollOptions: Partial<RollTable.DrawOptions>,
): Promise<RollTableResult> {
    const table = await fromUuid(tableUuid);
    if (table && table instanceof RollTable) {
        return {
            table,
            draw: await table.draw(rollOptions),
        };
    } else {
        throw new Error(`Could not find table with uuid ${tableUuid}`);
    }
}

export async function buildUuids(game: Game): Promise<Record<string, string>> {
    const compendiumName = 'pf2e-qftff-tools.burning-tundra-random-encounters';
    const compendium = await game.packs.get(compendiumName, {strict: true});
    const documents = await compendium.getDocuments({});
    return Object.fromEntries(documents.map(document => [document.name, `Compendium.${compendiumName}.${document.id}`]));
}
