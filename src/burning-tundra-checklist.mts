import {getBooleanSetting} from './settings.mjs';

type Checklist = Record<string, boolean>;

export const onlyHappensOnceEncounterDefaults: Checklist = {
    'Battle Standard': false,
    'Druid\'s Cave': false,
    'Famine Daemon': false,
    'Forest Trickster': false,
    'Frozen Hut': false,
    'Graveyard Guardian': false,
    'Hodag Horde': false,
    'Jealous Abjurer': false,
    'Last Words': false,
    'Mated Pair': false,
    'Thunderbird': false,
};

export class CompletedEncounterStorage {
    constructor(private game: Game) {
    }

    getChecklist(): Checklist {
        const checklist = Object.fromEntries(
            Object.entries(onlyHappensOnceEncounterDefaults)
                .map(([key]) => [key, getBooleanSetting(this.game, `burningTundraEncounter.${key}`)])
        );
        if (checklist) {
            return checklist;
        } else {
            this.reset();
            return this.getChecklist();
        }
    }

    getCheckedOff(): string[] {
        return Object.entries(this.getChecklist())
            .filter((x) => x[1])
            .map(([key]) => key);
    }

    setChecklist(data: Checklist): void {
        Object.entries(data)
            .forEach(([key, value]) => {
                this.game.settings.set('pf2e-qftff-tools', `burningTundraEncounter.${key}`, value);
            });
    }

    reset(): void {
        this.setChecklist(onlyHappensOnceEncounterDefaults);
    }
}

class CompletedEncounterChecklist extends FormApplication<FormApplicationOptions, {object: Checklist}, Checklist> {
    constructor(private storage: CompletedEncounterStorage) {
        super(storage.getChecklist());
    }

    static get defaultOptions(): FormApplicationOptions {
        const options = super.defaultOptions;
        options.title = 'Encounter Checklist';
        options.template = 'modules/pf2e-qftff-tools/templates/completed-encounter-checklist.html';
        return options;
    }

    override getData(): Promise<{object: Checklist}> | {object: Checklist} {
        return {
            object: this.storage.getChecklist(),
        };
    }

    override async _updateObject(_: Event, formData: Record<string, boolean>): Promise<void> {
        this.storage.setChecklist(formData);
    }
}

export function showBurningTundraEncounterChecklist(): void {
    if (game instanceof Game) {
        const storage = new CompletedEncounterStorage(game);
        new CompletedEncounterChecklist(storage).render(true);
    }
}
