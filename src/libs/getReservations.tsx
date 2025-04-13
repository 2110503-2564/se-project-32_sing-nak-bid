"use server"
export const getReservations = async (token: string) => {
    try {
        const response = await fetch(`https://pompengamer.vercel.app/api/v1/reservations`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch reservations");
        return await response.json();
    } catch (error) {
        console.error("Error fetching reservations:", error);
        return { success: false, message: "Could not retrieve reservations" };
    }
};