import { atom } from 'recoil';

export const gamesAtomKey = 'games';

export const gameState = atom({
  key: gamesAtomKey,
  default: {
    isLoading: true,
    options: [],
  },
});

export const getGameSelectOptions = games =>
  games.map(({ id, image_url, name }) => ({ value: id, label: name }));
