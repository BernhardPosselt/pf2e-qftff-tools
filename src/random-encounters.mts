import {RollMode} from './settings.mjs';
import {rollRollTable, RollTableResult} from './roll-tables.mjs';

export interface OptionValue {
    name: string;
    value: number;
}


function renderOptions(options: OptionValue[], lastSelectedIndex: number): string {
    return options.map(({name, value}, index) => {
        const element = document.createElement('option');
        if (index === lastSelectedIndex) {
            element.setAttribute('selected', 'selected');
        }
        element.value = `${value}`;
        element.innerText = name;
        return element.outerHTML;
    }).join('\n');
}

function renderTemplate(
    {
        terrainTypes,
        travelMethods,
        selectedTerrainIndex,
        selectedMethodIndex,
    }: {
        terrainTypes: OptionValue[];
        travelMethods: OptionValue[];
        selectedTerrainIndex: number;
        selectedMethodIndex: number;
    }
): string {
    return `
    <form>
    <div class="form-group">
        <label>Method of Travel</label>
        <select name="method">
            ${renderOptions(travelMethods, selectedMethodIndex)}
        </select>
    </div>
    <div class="form-group">
        <label>Terrain</label>
        <select name="terrain">
            ${renderOptions(terrainTypes, selectedTerrainIndex)}
        </select>
    </div>
    </form>
    `;
}

function getLastSelectedIndex(name: string): number {
    return parseInt(localStorage.getItem(name) ?? '0', 10);
}

export function showPopup(
    {
        title,
        rollMode,
        terrainTypes,
        travelMethods,
        terrainTypesKey,
        travelMethodKey,
        rollTablesUuids,
        customRender,
        game,
    }: {
        title: string;
        rollMode: RollMode;
        rollTablesUuids: Record<string, string> | string,
        terrainTypes: OptionValue[];
        travelMethods: OptionValue[];
        terrainTypesKey: string;
        travelMethodKey: string;
        customRender?: (result: RollTableResult) => Promise<void>;
        game: Game;
    }
): void {
    const tpl = renderTemplate({
        terrainTypes,
        travelMethods,
        selectedTerrainIndex: getLastSelectedIndex(terrainTypesKey),
        selectedMethodIndex: getLastSelectedIndex(travelMethodKey),
    });
    new Dialog({
        title,
        content: tpl,
        buttons: {
            no: {
                icon: '<i class="fas fa-times"></i>',
                label: 'Cancel',
            },
            yes: {
                icon: '<i class="fa-solid fa-dice-d20"></i>',
                label: 'Roll',
                callback: async (html): Promise<void> => {
                    const $html = html as HTMLElement;
                    const terrain = $html.querySelector('select[name="terrain"]') as HTMLSelectElement;
                    const terrainName = terrain.options[terrain.selectedIndex].text;
                    const method = $html.querySelector('select[name="method"]') as HTMLSelectElement;
                    localStorage.setItem(terrainTypesKey, `${terrain.selectedIndex}`);
                    localStorage.setItem(travelMethodKey, `${method.selectedIndex}`);

                    const flatDC = parseInt(terrain.value, 10) ?? 1;
                    const dcIncrease = parseInt(method.value, 10) ?? 0;

                    const dc = flatDC + dcIncrease;
                    const flavor = `Rolling Random Encounter for terrain ${terrainName} with Flat DC ${dc}`;
                    const dieRoll = await new Roll('1d20').evaluate();
                    await dieRoll.toMessage({flavor}, {rollMode});
                    if (dieRoll.total >= dc) {
                        const displayChat = customRender === undefined;
                        const rollTableUuid = typeof rollTablesUuids === 'string' ? rollTablesUuids : rollTablesUuids[terrainName];
                        const result = await rollRollTable(game, rollTableUuid, {rollMode, displayChat});
                        if (customRender) {
                            await customRender(result);
                        }
                    }
                },
            },
        },
        default: 'yes',
    }, {
        jQuery: false,
    }).render(true);
}

export const travelMethods: OptionValue[] = [
    {name: 'By Foot', value: 0},
    {name: 'Road or River', value: -2},
    {name: 'Flying', value: 3},
];
