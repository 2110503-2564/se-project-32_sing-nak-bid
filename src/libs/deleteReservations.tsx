"use server"
export const deleteReservation = async (token: string, id: string) => {
    try {
        const response = await fetch(`https://pompengamer.vercel.app/api/v1/reservations/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error("Failed to delete reservation");
        return await response.json();
    } catch (error) {
        console.error("Error deleting reservation:", error);
        return { success: false, message: "Could not delete reservation" };
    }
};
