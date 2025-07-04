import { createSlice } from '@reduxjs/toolkit';

interface SurahState {
  surahList: any[];
  translation: string;
  reciter: string;
}

const initialState: SurahState = {
  surahList: [],
  translation: 'en.sahih',
  reciter: 'ar.alafasy',
};

const surahSlice = createSlice({
  name: 'surah',
  initialState,
  reducers: {
    getSurahList(state, action) {
      state.surahList = action.payload;
    },
    setTranslation(state, action) {
      state.translation = action.payload;
    },
    setReciter(state, action) {
      state.reciter = action.payload;
    },
  },
});

export const { getSurahList, setTranslation, setReciter } = surahSlice.actions;
export default surahSlice.reducer;