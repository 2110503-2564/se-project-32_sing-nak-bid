'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import getRestaurant from '@/libs/getRestaurant'; // Adjust the path as needed
import { AdjustmentsHorizontalIcon } from '@heroicons/react/20/solid';
import styles from '../../../../components/Button.module.css';
import { ShoppingCartIcon, XMarkIcon, PlusIcon, MinusIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import addOrder from '@/libs/addOrder';
import { useSession } from 'next-auth/react';
import getUserProfile from '@/libs/getUserProfile';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
// Import OrderItem interface (สมมติว่าอยู่ในไฟล์นี้)
interface OrderItem {
  _id: string; // ID ของ MenuItem
  quantity: number;
  note?: string;
}

interface RestaurantDetail {
  _id: string;
  name: string;
  address: string;
  tel: string;
  opentime: string;
  closetime: string;
  menuItems?: MenuItem[];
  picture: string;
}

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  allergens?: Allergen[];
  picture : string;
}

interface Allergen {
  _id: string;
  name: string[];
  description: string[];
}

interface CartItem extends MenuItem {
  quantity: number;
  note?: string; // เปลี่ยนจาก specialRequests เป็น note
}


const OrdersMenuPage = () => {
  const router = useRouter();
  const params = useParams();
  const { restaurantId, reservationId } = params;
  const [restaurant, setRestaurant] = useState<RestaurantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItem[] | undefined>(restaurant?.menuItems);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [specialRequest, setSpecialRequest] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isShowingConfetti, setIsShowingConfetti] = useState(false);
  const [categories, setCategories] = useState<string[]>(['all']);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchRestaurantDetail = async () => {
      if (restaurantId && typeof restaurantId === 'string') {
        setLoading(true);
        setError(null);
        try {
          const data = await getRestaurant(restaurantId);
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
  }, [restaurantId]);

  useEffect(() => {
    if (restaurant?.menuItems) {
      const allRestaurantAllergens = new Set<string>();
      // Extract demo categories from menu items
      const demoCategories = new Set(['all']);
      restaurant.menuItems.forEach(item => {
        // Add random category for demo purposes
        const randomCategories = ['Main Course', 'Appetizer', 'Dessert', 'Beverage', 'Special', 'Popular'];
        demoCategories.add(randomCategories[Math.floor(Math.random() * randomCategories.length)]);
        
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
      setCategories(Array.from(demoCategories));
    }
  }, [restaurant?.menuItems]);

  useEffect(() => {
    if (restaurant?.menuItems) {
      let newFilteredItems = restaurant.menuItems;
      
      // Filter by allergens
      if (selectedAllergens.length > 0) {
        newFilteredItems = newFilteredItems.filter(item => {
          if (!item.allergens || item.allergens.length === 0) {
            return true;
          }
          return !item.allergens.some(allergen => {
            if (allergen.name && Array.isArray(allergen.name)) {
              return allergen.name.some(name => selectedAllergens.includes(name));
            } else if (allergen.name && typeof allergen.name === 'string') {
              return selectedAllergens.includes(allergen.name);
            } else {
              return false;
            }
          });
        });
      }
      
      // Filter by category (for demo purposes)
      if (activeCategory !== 'all') {
        // This is just for UI demonstration
        // In real implementation, this would filter based on actual categories from backend
        newFilteredItems = newFilteredItems.filter((_, index) => 
          index % categories.length === categories.indexOf(activeCategory) - 1
        );
      }
      
      setFilteredMenuItems(newFilteredItems);
    }
  }, [selectedAllergens, activeCategory, restaurant?.menuItems, categories]);

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

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-rose-50 to-rose-100">
        <div className="animate-bounce flex flex-col items-center">
          <ShoppingCartIcon className="h-16 w-16 text-rose-500 animate-pulse" />
          <p className="mt-4 text-rose-600 font-medium text-lg">Loading delicious menu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-50">
        <div className="bg-white p-8 rounded-lg shadow-xl border-2 border-red-300">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => router.back()} 
            className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center h-screen bg-amber-50">
        <div className="bg-white p-8 rounded-lg shadow-xl border-2 border-amber-300">
          <h2 className="text-2xl font-bold text-amber-600 mb-4">Restaurant not found</h2>
          <p className="text-gray-700">We couldn't find the restaurant you're looking for.</p>
          <button 
            onClick={() => router.back()} 
            className="mt-6 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Return to Restaurants
          </button>
        </div>
      </div>
    );
  }

  const handleClick = (menuItem: MenuItem) => {
    setSelectedMenuItem(menuItem);
    setShowPopup(true);
  };

  const handleClose = () => {
    setShowPopup(false);
    setSelectedMenuItem(null);
    setSpecialRequest(''); // Clear special request when closing popup
    setQuantity(1); // Reset quantity when closing popup
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const addToCart = () => {
    if (selectedMenuItem) {
      const existingItemIndex = cartItems.findIndex(item =>
        item._id === selectedMenuItem._id &&
        item.note === (specialRequest.trim() || '')
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += quantity;
        setCartItems(updatedItems);
      } else {
        const newItem: CartItem = {
          ...selectedMenuItem,
          quantity: quantity,
          note: specialRequest.trim() || ''
        };
        setCartItems([...cartItems, newItem]);
      }

      setShowPopup(false);
      setSelectedMenuItem(null);
      setSpecialRequest('');
      setQuantity(1);
      setIsCartOpen(true);
      
      // Show the animated +1 effect
      const cartButton = document.querySelector('.cart-button');
      if (cartButton) {
        const animatedPlus = document.createElement('span');
        animatedPlus.className = 'animated-plus';
        animatedPlus.textContent = '+1';
        cartButton.appendChild(animatedPlus);
        setTimeout(() => {
          animatedPlus.remove();
        }, 1000);
      }
    }
  };

  const removeFromCart = (index: number) => {
    const newCartItems = [...cartItems];
    newCartItems.splice(index, 1);
    setCartItems(newCartItems);
  };

  const updateCartItemQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQuantity;
    setCartItems(updatedItems);
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleConfirmOrder = async () => {
    if (!reservationId) {
      setOrderError('Reservation ID is missing.');
      return;
    }

    // สมมติว่าคุณมีวิธีจัดการ token อยู่แล้ว
    if(!session?.user?.token) return
    const token = session.user.token; // Replace with your actual token retrieval method

    const orderItemsToSend = cartItems.map(cartItem => ({
      menuItem: cartItem._id, // ส่ง _id ของ MenuItem โดยตรง
      menuName:cartItem.name,
      quantity: cartItem.quantity,
      note: cartItem.note,
    }));

    const totalPrice = calculateTotal();

    const userProfile = await getUserProfile(token);
    const phoneNumberFromProfile = userProfile.data.telnumber;
    const EmailFromProfile = userProfile.data.email;

    const orderData = {
      orderItems: orderItemsToSend,
      totalPrice: totalPrice,
      // คุณอาจต้องส่ง status เริ่มต้นด้วย เช่น 'pending'
      phoneNumber: phoneNumberFromProfile,
      emailUser:EmailFromProfile,
      status: 'pending',
    };

    setLoading(true);
    setOrderError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/v1/reservations/${reservationId}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to add order:', errorData);
        throw new Error(errorData?.message || 'Failed to add order');
      }

      const data = await response.json();
      setShowSuccessPopup(true);
      setCartItems([]);
      setIsShowingConfetti(true);
      setTimeout(() => setIsShowingConfetti(false), 5000);
      console.log('Order created:', data);
    } catch (err: any) {
      setOrderError(err.message || 'Failed to place order.');
      console.error('Error placing order:', err);
    } finally {
      setLoading(false);
    }
  };

  const navigateToReservations = () => {
    setShowSuccessPopup(false);
    router.push('/myorder'); // Adjust this path as needed
  };

  // Generate random ratings for demo purposes
  const getRandomRating = () => {
    return (Math.floor(Math.random() * 10) + 40) / 10;
  };

  // Random tags for menu items (demo purposes)
  const getRandomTags = (index: number) => {
    const tags = ['Popular', 'Spicy', 'Chef\'s Special', 'Vegan', 'Gluten-free', 'Organic', 'New'];
    return [tags[index % tags.length]];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-rose-100">
      {/* Floating menu - simplified */}
    <div className="fixed left-1/2 transform -translate-x-1/2 top-4 z-40">
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="bg-white px-4 py-1 rounded-full shadow-lg flex space-x-2 border-2 border-rose-200"
      >
        <button 
          onClick={() => router.push('/myorder')}
          className="text-rose-600 hover:text-rose-800 font-medium py-2 px-4 rounded-full transition-all duration-300 hover:bg-rose-50"
        >
          My Orders
        </button>
        <div className="h-6 my-auto w-px bg-rose-200"></div>
        <button 
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          className="text-rose-600 hover:text-rose-800 font-medium py-2 px-4 rounded-full transition-all duration-300 hover:bg-rose-50"
        >
          {viewMode === 'grid' ? 'List View' : 'Grid View'}
        </button>
      </motion.div>
    </div>

    {/* Action buttons at the bottom */}
    <motion.div 
      className="fixed right-4 bottom-4 z-40"
      initial={{ x: 100 }}
      animate={{ x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        className="cart-button bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center relative"
      >
        <ShoppingCartIcon className="h-6 w-6 mr-2" />
        <span>Your Order</span>
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
            {cartItems.length}
          </span>
        )}
      </button>
    </motion.div>

      {/* Shopping cart button (fixed on the right) */}
      <motion.div 
        className="fixed right-4 bottom-4 z-40"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="cart-button bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center relative"
        >
          <ShoppingCartIcon className="h-6 w-6 mr-2" />
          <span>Your Order</span>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
              {cartItems.length}
            </span>
          )}
        </button>
      </motion.div>

      {/* Cart sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-2xl w-80 sm:w-96 z-50 transform transition-transform duration-500 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white flex justify-between items-center sticky top-0 z-10">
          <h3 className="text-xl font-bold flex items-center">
            <ShoppingCartIcon className="h-6 w-6 mr-2" />
            Your Current Order
          </h3>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <ShoppingCartIcon className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-2">Your cart is empty</p>
              <p className="text-gray-400 text-sm mb-6">Add items from the menu to get started</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-emerald-50 p-3 rounded-lg">
                <p className="text-emerald-800 font-medium">Your order from {restaurant.name}</p>
              </div>
              
              {cartItems.map((item, index) => (
                <motion.div 
                  key={`${item._id}-${index}`} 
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        {item.note && (
                          <p className="text-gray-500 text-sm mt-1">
                            <span className="font-medium">Note:</span> {item.note}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors duration-200"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
                          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 transition-colors duration-200"
                        >
                          <MinusIcon className="h-4 w-4 text-gray-600" />
                        </button>
                        <span className="px-3 font-medium text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
                          className="bg-gray-200 hover:bg-gray-300 px-2 py-1 transition-colors duration-200"
                        >
                          <PlusIcon className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                      <p className="font-semibold text-gray-800">฿{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="border-t-2 border-dashed border-gray-200 my-4 pt-4">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Subtotal:</span>
                  <span>฿{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Service fee:</span>
                  <span>฿{(calculateTotal() * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-3">
                  <span>Total:</span>
                  <span>฿{(calculateTotal() * 1.1).toFixed(2)}</span>
                </div>

                {orderError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{orderError}</p>
                  </div>
                )}

                <button
                  onClick={handleConfirmOrder}
                  className={`w-full mt-6 py-3 px-4 rounded-lg font-bold text-white transition duration-300 flex justify-center items-center
                    ${loading || cartItems.length === 0 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transform hover:scale-[1.02]'}`}
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Placing Order...
                    </>
                  ) : 'Confirm Order'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Restaurant Header - Redesigned with better layout */}
    <div className="w-full max-w-6xl mx-auto pt-16 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-xl overflow-hidden mb-6"
      >
        <div className="relative h-52 overflow-hidden">
          <Image
            src={restaurant.picture}
            alt={restaurant.name}
            width={500}
            height={300}
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold mb-2 drop-shadow-lg"
            >
              {restaurant.name}
            </motion.h1>
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-2 mb-2"
            >
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon 
                    key={star} 
                    className={`h-4 w-4 ${star <= Math.floor(getRandomRating()) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium bg-yellow-400 text-yellow-800 px-2 py-0.5 rounded-full">
                {getRandomRating().toFixed(1)}
              </span>
              <span className="text-sm">(287 reviews)</span>
            </motion.div>
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              <span className="px-2 py-1 bg-rose-500 bg-opacity-70 rounded-full text-xs font-medium">Thai Cuisine</span>
              <span className="px-2 py-1 bg-amber-500 bg-opacity-70 rounded-full text-xs font-medium">Fine Dining</span>
              <span className="px-2 py-1 bg-emerald-500 bg-opacity-70 rounded-full text-xs font-medium">Seafood</span>
            </motion.div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="text-gray-600 text-sm">{restaurant.tel}</span>
            </div>
            
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 text-sm">Open {restaurant.opentime} - {restaurant.closetime}</span>
            </div>
            
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 text-sm">{restaurant.address}</span>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
      
       {/* Category Navigation - Horizontal Scrolling */}
    <div className="w-full max-w-6xl mx-auto px-4 mb-4">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-rose-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-rose-50 to-transparent z-10 pointer-events-none"></div>
        <div className="overflow-x-auto pb-2 hide-scrollbar">
          <div className="flex space-x-2 min-w-max px-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-rose-100'
                }`}
              >
                {category === 'all' ? 'All Menu' : category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>

       {/* Menu Section Header with Filter */}
    <div className="w-full max-w-6xl mx-auto px-4 flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold text-rose-700">Our Menu</h2>
      <div className="relative inline-block">
        <button
          ref={filterButtonRef}
          onClick={toggleFilterDropdown}
          className="bg-white hover:bg-rose-50 text-rose-600 font-medium py-2 px-4 rounded-full border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300 transition duration-300 flex items-center"
        >
          <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" aria-hidden="true" />
          Filter
        </button>
        {isFilterOpen && (
          <div
            ref={filterDropdownRef}
            className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg z-10 overflow-hidden border border-rose-100"
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
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 cursor-pointer transition duration-150 border-b border-rose-50 last:border-b-0"
              >
                <input
                  type="checkbox"
                  className="mr-2 leading-tight text-rose-500 focus:ring-rose-300 rounded border-rose-300"
                  value={allergen}
                  checked={selectedAllergens.includes(allergen)}
                  onChange={() => toggleAllergen(allergen)}
                />
                {selectedAllergens.includes(allergen) ? (
                  <span className="font-semibold text-rose-500">No {allergen}</span>
                ) : (
                  <span>{allergen}</span>
                )}
              </label>
            ))}
            {allergens.length === 0 && (
              <div className="px-4 py-2 text-gray-600 text-sm">No allergens found.</div>
            )}
            {selectedAllergens.length > 0 && (
              <button
                onClick={() => setSelectedAllergens([])}
                className="block w-full px-4 py-2 text-xs text-rose-500 hover:bg-rose-50 text-left cursor-pointer transition duration-150 border-t border-rose-100"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>

     {/* Menu Items Grid */}
     <div className="w-full max-w-6xl mx-auto px-4 pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMenuItems &&
          filteredMenuItems.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition duration-300"
            >
              <div className="relative">
                <Image src={item.picture} alt={item.name}  width={500}  height={300} className="w-full object-cover h-40" />
                {item.allergens && item.allergens.length > 0 && (
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-xs text-rose-500 px-2 py-1 rounded-full">
                    <span className="font-medium">⚠️ Allergens</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="font-bold text-emerald-600">฿{item.price.toFixed(2)}</p>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                {item.allergens && item.allergens.length > 0 && (
                  <div className="text-xs text-gray-500 mb-3">
                    <span className="font-medium">Contains: </span>
                    {item.allergens
                      .map((allergen) => {
                        if (allergen.name && Array.isArray(allergen.name)) {
                          return allergen.name.join(', ');
                        } else if (allergen.name && typeof allergen.name === 'string') {
                          return allergen.name;
                        } else {
                          return '';
                        }
                      })
                      .join(', ')}
                  </div>
                )}
                <button 
                  onClick={() => handleClick(item)}
                  className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Add to Order
                </button>
              </div>
            </motion.div>
          ))}
        {filteredMenuItems && filteredMenuItems.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-10 text-center">
            <div className="bg-rose-50 p-4 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-gray-700 font-medium mb-2">No menu items found</p>
            <p className="text-gray-500 text-sm mb-4">
              {selectedAllergens.length > 0 
                ? 'Try removing some allergen filters to see more options.' 
                : 'Please try another category or check back later.'}
            </p>
            {selectedAllergens.length > 0 && (
              <button
                onClick={() => setSelectedAllergens([])}
                className="bg-rose-100 hover:bg-rose-200 text-rose-700 font-medium py-2 px-6 rounded-lg transition-all duration-300"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>

      {/* Add to cart popup - Enhanced version */}
{showPopup && selectedMenuItem && (
  <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
    >
      {/* Header with Menu Picture */}
      <div className="relative h-48">
        <Image
          src={selectedMenuItem.picture}
          alt={selectedMenuItem.name} 
          width={500}
          height={300}
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-0 right-0 m-3">
          <button
            onClick={handleClose}
            className="bg-white bg-opacity-80 text-gray-600 hover:text-red-600 p-2 rounded-full transition-colors duration-200"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent py-2 px-4">
          <h2 className="text-xl font-bold text-white">{selectedMenuItem.name}</h2>
        </div>
      </div>

      {/* Description */}
      <div className="p-5">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-gray-700 text-sm">{selectedMenuItem.description}</p>
          {selectedMenuItem.allergens && selectedMenuItem.allergens.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-amber-600">
              <span className="font-medium">Allergen info: </span>
              {selectedMenuItem.allergens
                .map((allergen) => {
                  if (allergen.name && Array.isArray(allergen.name)) {
                    return allergen.name.join(', ');
                  } else if (allergen.name && typeof allergen.name === 'string') {
                    return allergen.name;
                  } else {
                    return '';
                  }
                })
                .join(', ')}
            </div>
          )}
        </div>

        {/* Special Request Input */}
        <div className="mb-4">
          <label htmlFor="special-request" className="block text-sm font-medium text-gray-700 mb-2">
            Special requests (optional)
          </label>
          <textarea
            id="special-request"
            //rows="2"
            placeholder="Any special instructions for this item?"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 text-sm transition-all duration-200"
            value={specialRequest}
            onChange={(e) => setSpecialRequest(e.target.value)}
          />
        </div>

        {/* Price and Quantity */}
        <div className="flex justify-between items-center mb-5">
          <div className="text-green-600 font-bold text-lg">
            ฿{(selectedMenuItem.price * quantity).toFixed(2)}
          </div>
          
          <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={decreaseQuantity}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 flex items-center justify-center transition-colors duration-200"
              disabled={quantity <= 1}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="px-4 font-medium text-gray-800">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 flex items-center justify-center transition-colors duration-200"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 py-3 px-4 rounded-lg font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={addToCart}
            className="flex-1 py-3 px-4 rounded-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Add to Order
          </button>
        </div>
      </div>
    </motion.div>
  </div>
)}

      {/* Success popup - Enhanced version */}
{showSuccessPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 text-center"
    >
      <div className="relative -mt-16 mb-2">
        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center border-4 border-white shadow-lg">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Thank You!</h2>
      <p className="text-gray-600 mb-6">Your order has been successfully placed and is being prepared by our chefs.</p>
      
      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Order #:</span>
          <span className="font-medium text-gray-800">{Math.floor(Math.random() * 1000) + 1000}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Estimated time:</span>
          <span className="font-medium text-gray-800">15-20 minutes</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          <span className="font-medium text-green-600">Being prepared</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => setShowSuccessPopup(false)}
          className="py-3 px-6 rounded-lg font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
        >
          Continue Browsing
        </button>
        <button
          onClick={() => router.push('/myorder')}
          className="py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-200"
        >
          View My Orders
        </button>
      </div>
    </motion.div>
  </div>
)}
    </div>
  );
};

export default OrdersMenuPage;