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
        console.log(checklist);
        if (checklist) {
            return checklist;
        } else {
            this.reset();
            return this.getChecklist();
        }
    }

    setChecklist(data) {
        Object.entries(data)
            .forEach(([key, value]) => {
                console.log('set', `burningTundraEncounter.${key}`, value)
                game.settings.set("pf2e-qftff-tools", `burningTundraEncounter.${key}`, value);
            });
    }

    reset() {
        this.setChecklist(onlyHappensOnceEncounterDefaults);
    }
}

class CompletedEncounterChecklist extends FormApplication {
    #storage = new CompletedEncounterStorage();

    static get defaultOptions() {
        const options = super.defaultOptions;
        // options.id = "npc-skills-selector";
        // options.classes = ["pf2e", "npc"];
        options.title = 'Encounter Checklist';
        options.template = "modules/pf2e-qftff-tools/templates/completed-encounter-checklist.html";
        options.width = "auto";
        return options;
    }

    getData() {
        return {
            checklist: this.#storage.getChecklist()
        };
    }

    _updateObject(_event, formData) {
        this.#storage.setChecklist(formData);
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
    showPopup({
        title: 'Burning Tundra Random Encounter',
        rollMode: game.settings.get('pf2e-qftff-tools', 'randomEncounterRollMode'),
        compendiumName: 'pf2e-qftff-tools.burning-tundra-random-encounters',
        terrainTypes,
        travelMethods,
        terrainTypesKey: 'burningTundra.terrain',
        travelMethodKey: 'burningTundra.method',
    });
}
