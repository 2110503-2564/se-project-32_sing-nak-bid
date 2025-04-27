import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReservationsItem } from "../../../interfaces";

type ReserveState = {
  reserveItems: ReservationsItem[];
};

const initialState: ReserveState = {
  reserveItems: []
};

export const reserveSlice = createSlice({
  name: "reserve",
  initialState,
  reducers: {
    addReserve: (state, action: PayloadAction<ReservationsItem>) => {
      const index = state.reserveItems.findIndex(
        (item) =>
          item.restaurant._id === action.payload.restaurant._id &&
          item.reservationDateTime === action.payload.reservationDateTime
      );

      if (index !== -1) {
        state.reserveItems[index] = action.payload;
      } else {
        state.reserveItems.push(action.payload);
      }
    },

    removeReserve: (state, action: PayloadAction<ReservationsItem>) => {
      const remainItems = state.reserveItems.filter((item) => {
        return (
          item.restaurant._id !== action.payload.restaurant._id ||
          item.reservationDateTime !== action.payload.reservationDateTime
        );
      });

      state.reserveItems = remainItems;
    }
  }
});

export const { addReserve, removeReserve } = reserveSlice.actions;
export default reserveSlice.reducer;
