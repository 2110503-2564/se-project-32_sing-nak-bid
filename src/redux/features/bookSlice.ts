import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BookingItem } from "../../../interfaces";

type BookState = {
  bookItems: BookingItem[]
};

const initialState: BookState = { bookItems: []}

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<BookingItem>) => {
        const index = state.bookItems.findIndex(
          (item) =>
            item.hotel === action.payload.hotel &&
            item.bookDate === action.payload.bookDate
        );
      
        if (index !== -1) {
          state.bookItems[index] = action.payload;
        } else {
          state.bookItems.push(action.payload);
        }
      },
    removeBooking: (state, action: PayloadAction<BookingItem>) => {
      const remainItems = state.bookItems.filter((obj) => {
        return (
          (obj.nameLastname !== action.payload.nameLastname) ||
          (obj.tel !== action.payload.tel) ||
          (obj.hotel !== action.payload.hotel) ||
          (obj.bookDate !== action.payload.bookDate)||
          (obj.night !== action.payload.night)
        );
      })
      state.bookItems = remainItems;
    }
  }
});

export const { addBooking, removeBooking } = bookSlice.actions;
export default bookSlice.reducer;
