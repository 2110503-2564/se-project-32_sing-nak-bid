import { createSlice ,PayloadAction } from "@reduxjs/toolkit";
import { ReservationItem } from "../../../interface";

type bookState = {
    bookItems:ReservationItem[]
}
const initialState:bookState = { bookItems:[]}

export const bookSlice = createSlice({
    name:"bookSlice",
    initialState,
    reducers:{
        addBooking: (state, action: PayloadAction<ReservationItem>) => {
            const index = state.bookItems.findIndex(
              (item) =>
                item.restaurant === action.payload.restaurant &&
                item.reservationDate === action.payload.reservationDate
            );
          
            if (index !== -1) {
              state.bookItems[index] = action.payload;
            } else {
              state.bookItems.push(action.payload);
            }
            console.log(action.payload)
          },
        removeBooking:(state,action:PayloadAction<ReservationItem>)=>{
            const remainItems = state.bookItems.filter(obj => {
                return ((obj.user !== action.payload.user)
            ||(obj.reservationDate !== action.payload.reservationDate) 
            ||(obj.restaurant !== action.payload.restaurant) || (obj.status !== action.payload.status));
            })
            state.bookItems = remainItems
        }
    }
})
export const {addBooking , removeBooking} = bookSlice.actions
export default bookSlice.reducer