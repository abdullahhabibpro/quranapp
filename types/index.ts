export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  audio: string;
  surah?: { number: number; name: string };
}

export interface Juz {
  number: number;
  name: string;
  arabicName: string;
  meaning: string;
  ayatCount: number;
}

export interface Reciter {
  identifier: string;
  englishName: string;
}