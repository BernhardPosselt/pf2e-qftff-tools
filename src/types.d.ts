import {DateTime} from 'luxon';
import {RollTableDraw} from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/client/data/documents/table';
import {FxMaster, WeatherEffects} from './fxmaster';

declare global {
    interface Game {
        pf2eQftffTools: {
            macros: Record<string, () => void>;
        };
        pf2e: {
            worldClock: {
                worldTime: DateTime
            }
        }
    }

    interface Window {
        FXMASTER: FxMaster
    }

    // fix roll table types
    interface RollTable {
        draw(options?: Partial<RollTable.DrawOptions>): Promise<RollTableDraw>;
    }

    interface Hooks {
        call<T extends WeatherEffects>(hook: 'fxmaster.switchParticleEffects', parameter: {
            type: T['type'],
            name: string,
            options: T['options'],
        }): boolean;
        call(hook: 'fxmaster.updateParticleEffects', parameter: WeatherEffects[]): boolean;
    }
}
