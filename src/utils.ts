export function isGm(game: Game): boolean {
    return game?.user?.data?.name === 'Gamemaster';
}
