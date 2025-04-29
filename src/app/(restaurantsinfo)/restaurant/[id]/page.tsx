"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import getRestaurant from "@/libs/getRestaurant";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/20/solid";
import styles from "../../../../components/Button.module.css";
import Rating from "@mui/material/Rating";
import RecommendedMenu from "@/components/RecommendedMenu";
import { Restaurant } from "../../../../../interfaces";
import Image from "next/image";
import { FaRegClock, FaPhone, FaMapMarkerAlt, FaHeart, FaShoppingCart } from "react-icons/fa";

interface RestaurantDetail {
  _id: string;
  name: string;
  address: string;
  tel: string;
  opentime: string;
  closetime: string;
  picture: string;
  menuItems?: MenuItem[];
}

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  recommended?: boolean;
  orderCount?: number;
  allergens?: Allergen[];
  picture: string;
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
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[] | undefined>(
    restaurant?.menuItems
  );
  const [recommendedMenuItems, setRecommendedMenuItems] = useState<MenuItem[]>([]);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchRestaurantDetail = async () => {
      if (id && typeof id === "string") {
        setLoading(true);
        setError(null);
        try {
          const data = await getRestaurant(id);
          setRestaurant(data?.data || null);
        } catch (err: any) {
          setError("Failed to fetch restaurant details.");
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
      const deduplicatedItems = Array.from(
        new Map(restaurant.menuItems.map((item) => [item._id, item])).values()
      );

      deduplicatedItems.forEach((item) => {
        item.allergens?.forEach((allergen) => {
          if (Array.isArray(allergen.name)) {
            allergen.name.forEach((n) => allRestaurantAllergens.add(n));
          } else if (typeof allergen.name === "string") {
            allRestaurantAllergens.add(allergen.name);
          } else {
            console.warn("Unexpected allergen name format:", allergen.name);
          }
        });
      });
      setAllergens(Array.from(allRestaurantAllergens));

      // Initial filter for recommended items
      const initialRecommended = deduplicatedItems.filter(
        (item) => item.recommended === true
      );
      setRecommendedMenuItems(initialRecommended);
      setFilteredMenuItems(deduplicatedItems);
    }
  }, [restaurant?.menuItems]);

  useEffect(() => {
    if (restaurant?.menuItems) {
      let filteredItems = restaurant.menuItems;
      let filteredRecommendedItems = restaurant.menuItems.filter(
        (item) => item.recommended === true
      );

      if (selectedAllergens.length > 0) {
        filteredItems = filteredItems.filter((item) => {
          if (!item.allergens || item.allergens.length === 0) {
            return true;
          }
          return !item.allergens.some((allergen) => {
            if (allergen.name && Array.isArray(allergen.name)) {
              return allergen.name.some((name) => selectedAllergens.includes(name));
            } else if (allergen.name && typeof allergen.name === "string") {
              return selectedAllergens.includes(allergen.name);
            } else {
              console.warn("Unexpected allergen name format for some:", allergen.name);
              return false;
            }
          });
        });

        filteredRecommendedItems = filteredRecommendedItems.filter((item) => {
          if (!item.allergens || item.allergens.length === 0) {
            return true;
          }
          return !item.allergens.some((allergen) => {
            if (allergen.name && Array.isArray(allergen.name)) {
              return allergen.name.some((name) => selectedAllergens.includes(name));
            } else if (allergen.name && typeof allergen.name === "string") {
              return selectedAllergens.includes(allergen.name);
            } else {
              console.warn("Unexpected allergen name format for some:", allergen.name);
              return false;
            }
          });
        });
      }

      const deduplicateFilteredItems = Array.from(
        new Map(filteredItems.map((item) => [item._id, item])).values()
      );

      // Deduplicate recommended items based on _id
      const uniqueRecommendedItems = Array.from(
        new Map(filteredRecommendedItems.map((item) => [item._id, item])).values()
      );

      setFilteredMenuItems(deduplicateFilteredItems);
      setRecommendedMenuItems(uniqueRecommendedItems);
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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterDropdownRef, filterButtonRef]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-600 border-opacity-75"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center h-screen">
        Restaurant not found.
      </div>
    );
  }

  const handleClick = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setQuantity(1);
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
    setSelectedMenuItem(null);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Create menu categories 
  const menuCategories = ["all", "appetizers", "main", "desserts", "drinks"];

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen">
      {/* Hero Section with Restaurant Image */}
      <div className="w-full h-64 md:h-80 lg:h-96 relative">
        <Image
          src={restaurant.picture}
          alt={restaurant.name}
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent h-32 p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            {restaurant.name}
          </h1>
          <div className="flex items-center mt-2">
            <Rating
              name="read-only-rating"
              value={4.2}
              readOnly
              precision={0.5}
              size="medium"
            />
            <span className="ml-2 text-white text-sm">4.2 (245 reviews)</span>
          </div>
        </div>
      </div>

      {/* Restaurant Info Section */}
      <div className="container mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <div className="bg-red-100 rounded-full p-3 mr-4">
                <FaMapMarkerAlt className="text-red-500 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{restaurant.address}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-red-100 rounded-full p-3 mr-4">
                <FaRegClock className="text-red-500 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Hours</p>
                <p className="font-medium">{restaurant.opentime} - {restaurant.closetime}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-red-100 rounded-full p-3 mr-4">
                <FaPhone className="text-red-500 h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Contact</p>
                <p className="font-medium">{restaurant.tel}</p>
              </div>
            </div>
          </div>
          
          <div className="flex mt-6 gap-4 flex-wrap">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg transition duration-300 flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                router.push("/reserve");
              }}
            >
              Reserve Table
            </button>
            
            <button
              className="bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 font-medium px-6 py-2.5 rounded-lg transition duration-300 flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/review/${restaurant._id}`);
              }}
            >
              Write Review
            </button>
            
            <button
              className="bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition duration-300 flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/viewreview/${restaurant._id}`);
              }}
            >
              <span>View Reviews</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Menu Section */}
      {recommendedMenuItems.length > 0 && (
        <div className="container mx-auto px-4 mt-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-400 p-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <FaHeart className="mr-2" /> Chef's Recommendations
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedMenuItems.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleClick(item)}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="h-48 relative overflow-hidden">
                      <Image
                        src={item.picture}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        className="transform hover:scale-105 transition-transform duration-300"
                      />
                      {item.recommended && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          Popular
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <div className="font-bold text-red-600">฿{item.price.toFixed(2)}</div>  
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Categories and Filter */}
      <div className="container mx-auto px-4 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Our Menu</h2>
          
          <div className="flex items-center mt-4 md:mt-0">
            <div className="mr-4">
              <button
                ref={filterButtonRef}
                onClick={toggleFilterDropdown}
                className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 flex items-center transition duration-300"
              >
                <AdjustmentsHorizontalIcon
                  className="h-5 w-5 mr-2 text-gray-500"
                  aria-hidden="true"
                />
                Filter Allergens
                {selectedAllergens.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {selectedAllergens.length}
                  </span>
                )}
              </button>
              {isFilterOpen && (
                <div
                  ref={filterDropdownRef}
                  className="absolute mt-2 w-64 bg-white rounded-lg shadow-xl z-10 border border-gray-200 overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-medium text-gray-700">Filter by Allergens</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {allergens.map((allergen) => (
                      <label
                        key={allergen}
                        className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-red-500 rounded border-gray-300 focus:ring-red-500"
                          value={allergen}
                          checked={selectedAllergens.includes(allergen)}
                          onChange={() => toggleAllergen(allergen)}
                        />
                        <span className="ml-3 text-gray-700">
                          {allergen}
                        </span>
                      </label>
                    ))}
                    {allergens.length === 0 && (
                      <div className="px-4 py-3 text-gray-500 text-center">
                        No allergens found
                      </div>
                    )}
                  </div>
                  {selectedAllergens.length > 0 && (
                    <div className="p-3 bg-gray-50 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedAllergens([])}
                        className="w-full py-2 text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Categories */}
        <div className="scrollbar-hide overflow-x-auto mb-6">
          <div className="flex space-x-2 min-w-max pb-2">
            {menuCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`py-2 px-4 rounded-full capitalize transition duration-300 ${
                  activeCategory === category
                    ? "bg-red-600 text-white font-medium"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredMenuItems &&
            filteredMenuItems.map((item) => (
              <div
                key={item._id}
                onClick={() => handleClick(item)}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="h-48 relative overflow-hidden">
                  <Image
                    src={item.picture}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="transform hover:scale-105 transition-transform duration-300"
                  />
                  {item.recommended && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <FaHeart className="mr-1" /> Popular
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                    {item.description}
                  </p>
                  
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {item.allergens.map((allergen, index) => {
                        const allergenNames = Array.isArray(allergen.name)
                          ? allergen.name
                          : [allergen.name];
                        
                        return allergenNames.map((name, i) => (
                          <span
                            key={`${index}-${i}`}
                            className="bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full"
                          >
                            {name}
                          </span>
                        ));
                      })}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="font-bold text-gray-900">฿{item.price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            ))}
          {filteredMenuItems && filteredMenuItems.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No menu items found</h3>
              <p className="text-gray-500">
                {selectedAllergens.length > 0
                  ? "Try adjusting your allergen filters"
                  : "The menu items will appear here"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Food Item Detail Modal */}
      {showPopup && selectedMenuItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="relative h-56">
              <Image
                src={selectedMenuItem.picture}
                alt={selectedMenuItem.name}
                layout="fill"
                objectFit="cover"
              />
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800">{selectedMenuItem.name}</h2>
              <p className="text-gray-600 mt-2">{selectedMenuItem.description}</p>
              
              {selectedMenuItem.allergens && selectedMenuItem.allergens.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium text-gray-700 mb-2">Allergens:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMenuItem.allergens.map((allergen, index) => {
                      const allergenNames = Array.isArray(allergen.name)
                        ? allergen.name
                        : [allergen.name];
                      
                      return allergenNames.map((name, i) => (
                        <span
                          key={`${index}-${i}`}
                          className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm"
                        >
                          {name}
                        </span>
                      ));
                    })}
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex items-center justify-between">
                <div className="font-bold text-xl text-gray-900">฿{selectedMenuItem.price.toFixed(2)}</div>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition duration-300"
                  >
                    -
                  </button>
                  <div className="px-4 py-2 font-medium">{quantity}</div>
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition duration-300"
                  >
                    +
                  </button>
                </div>
              </div> 
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetailPage;