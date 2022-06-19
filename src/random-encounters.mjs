async function rollCompendiumTable(compendiumName, tableName, rollMode) {
    const compendium = await game.packs.get(compendiumName, {strict: true});
    const documents = await compendium.getDocuments({});
    const table = documents.find(document => document.name === tableName);
    table.draw({rollMode});
}

function rollWorldTable(tableName, rollMode) {
    const table = game.tables?.getName(tableName);
    table.draw({rollMode});
}

function renderOptions(options, lastSelectedIndex) {
    return options.map(({name, value}, index) => {
        const element = document.createElement('option');
        if (index === lastSelectedIndex) {
            element.setAttribute('selected', 'selected');
        }
        element.value = value;
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
    }
) {
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

function getLastSelectedIndex(name) {
    return parseInt(localStorage.getItem(name) ?? 0, 10);
}

export function showPopup(
    {
        title,
        rollMode,
        compendiumName,
        terrainTypes,
        travelMethods,
        terrainTypesKey,
        travelMethodKey,
        rollTableName,
    }
) {
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
                callback: async ($html) => {
                    const terrain = $html[0].querySelector('select[name="terrain"]');
                    const terrainName = terrain.options[terrain.selectedIndex].text;
                    const method = $html[0].querySelector('select[name="method"]');
                    localStorage.setItem(terrainTypesKey, terrain.selectedIndex)
                    localStorage.setItem(travelMethodKey, method.selectedIndex)

                    const flatDC = parseInt(terrain.value, 10) ?? 1;
                    const dcIncrease = parseInt(method.value, 10) ?? 0;

                    const dc = flatDC + dcIncrease;
                    const dieRoll = await new Roll("1d20").evaluate();
                    await dieRoll.toMessage(undefined, {rollMode});
                    if (dieRoll.result >= dc) {
                        if (compendiumName) {
                            await rollCompendiumTable(compendiumName, terrainName, rollMode);
                        } else {
                            await rollWorldTable(rollTableName, rollMode);
                        }
                    }
                },
            },
        },
        default: 'yes',
    }).render(true);
}

export const travelMethods = [
    {name: 'By Foot', value: 0},
    {name: 'Road or River', value: -2},
    {name: 'Flying', value: 3},
];
