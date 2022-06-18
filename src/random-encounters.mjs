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

const travelMethods = [
    {name: 'By Foot', value: 0},
    {name: 'Road or River', value: -2},
    {name: 'Flying', value: 3},
];

async function rollRollTable(compendiumName, tableName, rollMode) {
    const compendium = await game.packs.get(compendiumName, {strict: true});
    const documents = await compendium.getDocuments({});
    const table = documents.find(document => document.name === tableName);
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

function showPopup(
    {
        rollMode,
        compendiumName,
        terrainTypes,
        travelMethods,
        terrainTypesKey,
        travelMethodKey,
    }
) {
    const tpl = renderTemplate({
        terrainTypes,
        travelMethods,
        selectedTerrainIndex: getLastSelectedIndex(terrainTypesKey),
        selectedMethodIndex: getLastSelectedIndex(travelMethodKey),
    });
    new Dialog({
        title: 'Burning Tundra Random Encounter',
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
                        await rollRollTable(compendiumName, terrainName, rollMode);
                    }
                },
            },
        },
        default: 'yes',
    }).render(true);
}

export function burningTundraEncountersMacro() {
    showPopup({
        rollMode: 'gmroll',
        compendiumName: 'pf2e-qftff-tools.burning-tundra-random-encounters',
        terrainTypes,
        travelMethods,
        terrainTypesKey: 'burningTundra.terrain',
        travelMethodKey: 'burningTundra.method',
    });
}
