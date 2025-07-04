const BASE_URL = 'https://api.alquran.cloud/v1';

export const fetchSurahs = async () => {
  const response = await fetch(`${BASE_URL}/quran/en.sahih`);
  return response.json();
};

export const fetchSurah = async (surahNumber, qari) => {
  const response = await fetch(`${BASE_URL}/surah/${surahNumber}/${qari}`);
  return response.json();
};

export const fetchJuz = async (juzNumber, qari) => {
  const response = await fetch(`${BASE_URL}/juz/${juzNumber}/${qari}`);
  return response.json();
};

export const fetchReciters = async () => {
  const response = await fetch(`${BASE_URL}/edition?format=audio`);
  return response.json();
};