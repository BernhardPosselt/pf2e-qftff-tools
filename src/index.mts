import {burningTundraEncountersMacro} from './burning-tundra-encounters.mjs';
import {hexplorationEncountersMacro} from './hexploration-encounters.mjs';
import {rollWeather, syncWeather} from './weather.mjs';
import {getWorldTableUuidMappings} from './roll-tables.mjs';
import {onlyHappensOnceEncounterDefaults, showBurningTundraEncounterChecklist} from './burning-tundra-checklist.mjs';
import {shadowPlaneEncountersMacro} from './shadow-plane-encounters.mjs';
import {isGm} from './utils.mjs';

Hooks.on('ready', async () => {
    if (game instanceof Game) {
        const gameInstance = game;
        gameInstance.pf2eQftffTools = {
            macros: {
                burningTundraEncountersMacro: burningTundraEncountersMacro.bind(null, game),
                hexplorationEncountersMacro: hexplorationEncountersMacro.bind(null, game),
                shadowPlaneEncountersMacro: shadowPlaneEncountersMacro.bind(null, game),
                showBurningTundraEncounterChecklist,
            },
        };
        const rollModeChoices = {
            publicroll: 'Public Roll',
            gmroll: 'Private GM Roll',
            blindroll: 'Blind GM Roll',
            selfroll: 'Self Roll',
        };
        const gameRollTables = {
            '': '-',
            ...getWorldTableUuidMappings(game),
        };
        gameInstance.settings.register<string, string, string>('pf2e-qftff-tools', 'hexplorationRandomEncounterTable', {
            name: 'Hexploration: Random Encounter Table Name',
            hint: 'Roll table that is rolled for random encounters. Reload game to refresh drop down.',
            default: '',
            choices: gameRollTables,
            config: true,
            type: String,
            scope: 'world',
        });
        gameInstance.settings.register<string, string, string>('pf2e-qftff-tools', 'randomEncounterRollMode', {
            name: 'Roll Mode',
            scope: 'world',
            config: true,
            default: 'gmroll',
            type: String,
            choices: rollModeChoices,
        });
        gameInstance.settings.register<string, string, string>('pf2e-qftff-tools', 'weatherTable', {
            name: 'Weather Table Name',
            hint: 'Roll table that is rolled for weather. Reload game to refresh drop down. Leave blank to disable.',
            scope: 'world',
            config: true,
            default: '',
            choices: gameRollTables,
            type: String,
        });
        gameInstance.settings.register<string, string, string>('pf2e-qftff-tools', 'weatherRollMode', {
            name: 'Weather Roll Mode',
            scope: 'world',
            config: true,
            default: 'gmroll',
            type: String,
            choices: rollModeChoices,
        });
        gameInstance.settings.register('pf2e-qftff-tools', 'currentWeatherFx', {
            name: 'Current Weather FX',
            hint: 'Based on the current value of the roll table',
            scope: 'world',
            config: true,
            default: 'sunny',
            type: String,
        });
        Object.entries(onlyHappensOnceEncounterDefaults)
            .forEach(([key]) => {
                gameInstance.settings.register('pf2e-qftff-tools', `burningTundraEncounter.${key}`, {
                    name: `Encounter Checklist: ${key}`,
                    type: Boolean,
                    default: false,
                    scope: 'world',
                    config: true,
                });
            });
        Hooks.on('updateWorldTime', async (_, delta) => {
            if (isGm(gameInstance)) {
                await rollWeather(gameInstance, delta);
            }
        });
        Hooks.on('canvasReady', async () => {
            if (isGm(gameInstance)) {
                await syncWeather(gameInstance);
            }
        });
    }
});
