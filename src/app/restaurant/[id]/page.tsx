'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import getRestaurant from '@/libs/getRestaurant'; // Adjust the import path

interface RestaurantDetail {
    _id: string;
    name: string;
    address: string;
    tel: string;
    opentime: string;
    closetime: string;
    menuItems?: MenuItem[]; // Add menuItems to the interface
    // ... ข้อมูลอื่นๆ
}

interface MenuItem {
    _id: string;
    name: string;
    price: number;
    description: string;
    // imageUrl?: string; // Assuming you might have an image URL for the menu item
    // ... ข้อมูลอื่นๆ ของเมนู
}

const RestaurantDetailPage = () => {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRestaurantDetail = async () => {
            if (id && typeof id === 'string') {
                setLoading(true);
                setError(null);
                try {
                    const data = await getRestaurant(id);
                    setRestaurant(data?.data || null);
                } catch (err: any) {
                    setError('Failed to fetch restaurant details.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchRestaurantDetail();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading restaurant details...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
    }

    if (!restaurant) {
        return <div className="flex justify-center items-center h-screen">Restaurant not found.</div>;
    }

    return (
        <div className="p-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-3xl font-semibold mb-4">{restaurant.name}</h1>
                <p className="text-gray-700 mb-2">Address: {restaurant.address}</p>
                <p className="text-gray-700 mb-2">Tel: {restaurant.tel}</p>
                <p className="text-gray-700 mb-2">Open Time: {restaurant.opentime}</p>
                <p className="text-gray-700">Close Time: {restaurant.closetime}</p>
            </div>

            {/* Display Menu Items */}
            {restaurant.menuItems && restaurant.menuItems.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Menu</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {restaurant.menuItems.map((item) => (
                            <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                {/* Assuming you have an imageUrl property in your MenuItem schema or API response */}
                                {/* <img src={item.imageUrl || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-32 object-cover" /> */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                                    <p className="text-green-600 font-bold">฿{item.price.toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RestaurantDetailPage;