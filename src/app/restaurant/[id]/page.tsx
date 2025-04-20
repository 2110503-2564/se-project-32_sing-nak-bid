'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import getRestaurant from '@/libs/getRestaurant'; // Adjust the path as needed
import { AdjustmentsHorizontalIcon } from '@heroicons/react/20/solid';

interface RestaurantDetail {
  _id: string;
  name: string;
  address: string;
  tel: string;
  opentime: string;
  closetime: string;
  menuItems?: MenuItem[];
}

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  allergens?: Allergen[];
}

interface Allergen {
  _id: string;
  name: string[];
  description: string[];
}

const RestaurantDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[] | undefined>(restaurant?.menuItems);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  useEffect(() => {
    if (restaurant?.menuItems) {
      const allRestaurantAllergens = new Set<string>();
      restaurant.menuItems.forEach(item => {
        item.allergens?.forEach(allergen => {
          if (Array.isArray(allergen.name)) {
            allergen.name.forEach(n => allRestaurantAllergens.add(n));
          } else if (typeof allergen.name === 'string') {
            allRestaurantAllergens.add(allergen.name);
          } else {
            console.warn('Unexpected allergen name format:', allergen.name);
          }
        });
      });
      setAllergens(Array.from(allRestaurantAllergens));
      setFilteredMenuItems(restaurant.menuItems);
    }
  }, [restaurant?.menuItems]);

  useEffect(() => {
    if (restaurant?.menuItems) {
      if (selectedAllergens.length > 0) {
        const newFilteredItems = restaurant.menuItems.filter(item => {
          if (!item.allergens || item.allergens.length === 0) {
            return true;
          }
          return !item.allergens.some(allergen => {
            if (allergen.name && Array.isArray(allergen.name)) {
              return allergen.name.some(name => selectedAllergens.includes(name));
            } else if (allergen.name && typeof allergen.name === 'string') {
              return selectedAllergens.includes(allergen.name);
            } else {
              console.warn('Unexpected allergen name format for some:', allergen.name);
              return false;
            }
          });
        });
        setFilteredMenuItems(newFilteredItems);
      } else {
        setFilteredMenuItems(restaurant.menuItems);
      }
    }
  }, [selectedAllergens, restaurant?.menuItems]);

  const toggleAllergen = (allergenName: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(allergenName)
        ? prev.filter((item) => item !== allergenName)
        : [...prev, allergenName]
    );
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterDropdownRef, filterButtonRef]);

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
    <div className="flex flex-col items-center justify-center min-h-screen -my-3"> {/* Centering Container */}
      <div className="bg-white rounded-lg shadow-md p-10 mb-8 w-full md:w-3/4 lg:w-1/2"> {/* Thicker restaurant border */}
        <img src="/img/Jeh-O.jpg" alt={restaurant.name} className="rounded-md mb-4 w-full object-cover h-48" /> {/* Restaurant Image */}
        <h1 className="text-3xl font-semibold mb-4 text-red-700">{restaurant.name}</h1> {/* Red text */}
        <p className="text-gray-700 mb-2"><span className="font-semibold text-red-500">Address:</span> {restaurant.address}</p> {/* Red accent */}
        <p className="text-gray-700 mb-2"><span className="font-semibold text-red-500">Tel:</span> {restaurant.tel}</p> {/* Red accent */}
        <p className="text-gray-700 mb-2"><span className="font-semibold text-red-500">Open Time:</span> {restaurant.opentime}</p> {/* Red accent */}
        <p className="text-gray-700"><span className="font-semibold text-red-500">Close Time:</span> {restaurant.closetime}</p> {/* Red accent */}
      </div>

      {/* Menu and Filter Button */}
      <div className="w-full md:w-3/4 lg:w-1/2 mt-8 flex justify-between items-center mb-6"> {/* Adjusted width */}
        <h2 className="text-2xl font-semibold text-red-700">Menu</h2> {/* Red text */}
        <div className="relative inline-block">
          <button
            ref={filterButtonRef}
            onClick={toggleFilterDropdown}
            className="bg-red-300 hover:bg-red-400 text-white font-bold py-2 px-3 rounded focus:outline-none focus:ring focus:ring-red-200 transition duration-300 ease-in-out flex items-center hover:scale-105 border-2 border-red-500" // Thicker button border
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-white" aria-hidden="true" /> {/* White icon */}
            Filter
          </button>
          {isFilterOpen && (
            <div
              ref={filterDropdownRef}
              className="absolute right-0 mt-2 w-52 bg-red-100 rounded-md shadow-lg z-10 overflow-hidden transition-all duration-300 ease-in-out transform origin-top-right scale-95 opacity-0 border-2 border-red-500" // Thicker dropdown border
              style={{
                transformOrigin: 'top right',
                transform: isFilterOpen ? 'scale(1)' : 'scale(0.95)',
                opacity: isFilterOpen ? 1 : 0,
                visibility: isFilterOpen ? 'visible' : 'hidden',
              }}
            >
              {allergens.map((allergen) => (
                <label
                  key={allergen}
                  className="block px-4 py-3 text-lg text-gray-800 hover:bg-red-200 cursor-pointer hover:scale-105 transition duration-150 ease-in-out border-b border-red-300 last:border-b-0" // Slightly thicker divider
                >
                  <input
                    type="checkbox"
                    className="mr-2 leading-tight text-red-500 focus:ring-red-300 rounded border-red-300"
                    value={allergen}
                    checked={selectedAllergens.includes(allergen)}
                    onChange={() => toggleAllergen(allergen)}
                  />
                  {selectedAllergens.includes(allergen) ? (
                    <span className="font-semibold text-red-500">X</span>
                  ) : (
                    <span>{allergen}</span>
                  )}
                </label>
              ))}
              {allergens.length === 0 && (
                <div className="px-4 py-2 text-gray-600">No allergens found.</div>
              )}
              {selectedAllergens.length > 0 && (
                <button
                  onClick={() => setSelectedAllergens([])}
                  className="block w-full px-4 py-3 text-sm text-red-500 hover:bg-red-200 text-left cursor-pointer transition duration-150 ease-in-out hover:scale-105 border-t border-red-300" // Slightly thicker divider
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Display Menu Items - Border on Hover */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 w-full md:w-3/4 lg:w-1/2"> {/* Adjusted width */}
        {filteredMenuItems && filteredMenuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-lg overflow-hidden hover:scale-105 transition duration-200 ease-in-out hover:border-4 hover:border-red-300" // Border on hover
          >
            <img src="/img/menu.png" alt={item.name} className="rounded-t-lg w-full object-cover h-32" /> {/* Menu Item Image */}
            <div className="p-6">
              <h3 className="font-semibold text-xl text-red-700 mb-2">{item.name}</h3> {/* Red text */}
              <p className="text-gray-700 text-base mb-3">{item.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-green-600 font-bold text-lg">฿{item.price.toFixed(2)}</p>
                {item.allergens && item.allergens.length > 0 && (
                  <div className="text-sm text-red-500 italic">
                    Contains: {item.allergens.map(allergen => {
                      if (allergen.name && Array.isArray(allergen.name)) {
                        return allergen.name.join(', ');
                      } else if (allergen.name && typeof allergen.name === 'string') {
                        return allergen.name;
                      } else {
                        console.warn('Unexpected allergen name format for join:', allergen.name);
                        return '';
                      }
                    }).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filteredMenuItems && filteredMenuItems.length === 0 && (
          <p className="text-gray-500">No menu items found {selectedAllergens.length > 0 ? 'matching your filter.' : '.'}</p>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetailPage;