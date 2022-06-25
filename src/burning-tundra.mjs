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

export const onlyHappensOnceEncounterDefaults = {
    "Battle Standard": false,
    "Druid's Cave": false,
    "Famine Daemon": false,
    "Forest Trickster": false,
    "Frozen Hut": false,
    "Graveyard Guardian": false,
    "Hodag Horde": false,
    "Jealous Abjurer": false,
    "Last Words": false,
    "Mated Pair": false,
    "Thunderbird": false,
};

class CompletedEncounterStorage {
    getChecklist() {
        const checklist = Object.fromEntries(
            Object.entries(onlyHappensOnceEncounterDefaults)
                .map(([key]) => [key, game.settings.get("pf2e-qftff-tools", `burningTundraEncounter.${key}`)])
        );
        if (checklist) {
            return checklist;
        } else {
            this.reset();
            return this.getChecklist();
        }
    }

    getCheckedOff() {
        return Object.entries(this.getChecklist())
            .filter(([_, value]) => value)
            .map(([key]) => key);
    }

    setChecklist(data) {
        Object.entries(data)
            .forEach(([key, value]) => {
                game.settings.set("pf2e-qftff-tools", `burningTundraEncounter.${key}`, value);
            });
    }

    reset() {
        this.setChecklist(onlyHappensOnceEncounterDefaults);
    }
}

const checklist = new CompletedEncounterStorage();

class CompletedEncounterChecklist extends FormApplication {
    static get defaultOptions() {
        const options = super.defaultOptions;
        options.title = 'Encounter Checklist';
        options.template = "modules/pf2e-qftff-tools/templates/completed-encounter-checklist.html";
        options.width = "auto";
        return options;
    }

    getData() {
        return {
            checklist: checklist.getChecklist()
        };
    }

    _updateObject(_event, formData) {
        checklist.setChecklist(formData);
    }

    activateListeners($form) {
        $form.find('#reset-checklist').on("click", (event) => {
            this.submit({updateData: onlyHappensOnceEncounterDefaults});
        });
    }
}

export function showBurningTundraEncounterChecklist() {
    new CompletedEncounterChecklist({}).render(true);
}

export function burningTundraEncountersMacro() {
    const rollMode = game.settings.get('pf2e-qftff-tools', 'randomEncounterRollMode');
    showPopup({
        title: 'Burning Tundra Random Encounter',
        rollMode,
        compendiumName: 'pf2e-qftff-tools.burning-tundra-random-encounters',
        terrainTypes,
        travelMethods,
        terrainTypesKey: 'burningTundra.terrain',
        travelMethodKey: 'burningTundra.method',
        customRender: async ({table, draw}) => {
            const {results} = draw;
            const text = results[0].data.text;
            const checkedOff = checklist.getCheckedOff();
            const checkedOffValue = checkedOff.find(checked => text.startsWith(checked));
            if (checkedOffValue) {
                results[0].data.text = `${checkedOffValue} already happened, nothing happens!`;
            }
            await table.toMessage(results, {roll: draw.roll, messageData: {rollMode}});
        }
    });
}
