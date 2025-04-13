"use server"
export const updateReservation = async (token: string, id: string, updateData: any) => {
    try {
        const response = await fetch(`https://pompengamer.vercel.app/api/v1/reservations/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) throw new Error("Failed to update reservation");
        return await response.json();
    } catch (error) {
        console.error("Error updating reservation:", error);
        return { success: false, message: "Could not update reservation" };
    }
};