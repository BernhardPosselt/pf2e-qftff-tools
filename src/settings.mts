export type RollMode = keyof CONFIG.Dice.RollModes

export function getRollMode(game: Game, settingsKey: string): RollMode {
    const rollMode = getStringSetting(game, settingsKey) as RollMode;
    return rollMode ?? 'publicroll';
}

export function getStringSetting(game: Game, settingsKey: string): string {
    return game.settings.get('pf2e-qftff-tools', settingsKey) as string | undefined ?? '';
}

export function getBooleanSetting(game: Game, settingsKey: string): boolean {
    return game.settings.get('pf2e-qftff-tools', settingsKey) as boolean | undefined ?? false;
}
