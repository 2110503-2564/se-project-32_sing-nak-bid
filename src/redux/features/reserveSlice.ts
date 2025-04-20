import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReservationsItem } from "../../../interfaces";

type ReserveState = {
  reserveItems: ReservationsItem[];
};

const initialState: ReserveState = {
  reserveItems: [],
};

export const reserveSlice = createSlice({
  name: "reserve",
  initialState,
  reducers: {
    addReserve: (state, action: PayloadAction<ReservationsItem>) => {
      const index = state.reserveItems.findIndex(
        (item) =>
          item.restaurant._id === action.payload.restaurant._id &&
          item.reservationDate === action.payload.reservationDate &&
          item.user === action.payload.user
      );

      if (index !== -1) {
        state.reserveItems[index] = action.payload;
      } else {
        state.reserveItems.push(action.payload);
      }
    },

    removeReserveing: (state, action: PayloadAction<ReservationsItem>) => {
      state.reserveItems = state.reserveItems.filter(
        (item) =>
          !(
            item._id === action.payload._id ||
            (item.user === action.payload.user &&
              item.restaurant._id === action.payload.restaurant._id &&
              item.reservationDate === action.payload.reservationDate)
          )
      );
    },
  },
});

export const { addReserve, removeReserveing } = reserveSlice.actions;
export default reserveSlice.reducer;
