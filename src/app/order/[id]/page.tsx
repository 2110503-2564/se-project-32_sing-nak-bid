'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import getRestaurant from '@/libs/getRestaurant'; // Adjust the path as needed
import { AdjustmentsHorizontalIcon } from '@heroicons/react/20/solid';
import styles from '../../../components/Button.module.css';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import addOrder from '@/libs/addOrder';
import { useSession } from 'next-auth/react';

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

interface CartItem extends MenuItem {
  quantity: number;
  note?: string; // เปลี่ยนจาก specialRequests เป็น note
}

const OrdersMenuPage = () => {
  const router = useRouter();
  const params = useParams();
  const { id: restaurantId, reservationId } = params as { id: string; reservationId: string };
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
  const [orderError, setOrderError] = useState<string | null>(null); // State สำหรับ error ในการสั่งซื้อ
  const { data: session, status } = useSession();

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
        item.note === (specialRequest.trim() || undefined) // ใช้ note แทน specialRequests
      );

      if (existingItemIndex !== -1) {
        // If the same item with the same note exists, update quantity
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex].quantity += quantity;
        setCartItems(updatedItems);
      } else {
        // Otherwise add as new item
        const newItem: CartItem = {
          ...selectedMenuItem,
          quantity: quantity,
          note: specialRequest.trim() || undefined // ใช้ note แทน specialRequests
        };
        setCartItems([...cartItems, newItem]);
      }

      setShowPopup(false);
      setSelectedMenuItem(null);
      setSpecialRequest(''); // Clear special request after adding to cart
      setQuantity(1); // Reset quantity after adding to cart
      setIsCartOpen(true);
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
    const token = session?.user.token; // Replace with your actual token retrieval method

    const orderItemsToSend = cartItems.map(cartItem => ({
      menuItem: cartItem._id, // ส่ง _id ของ MenuItem โดยตรง
      quantity: cartItem.quantity,
      note: cartItem.note,
    }));

    const totalPrice = calculateTotal();

    const orderData = {
      orderItems: orderItemsToSend,
      totalPrice: totalPrice,
      // คุณอาจต้องส่ง status เริ่มต้นด้วย เช่น 'pending'
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
      setCartItems([]); // Reset cart after successful order
      console.log('Order created:', data); // Log ข้อมูล Order ที่สร้างจาก Backend
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8">
      {/* Reservation button (fixed on the left) */}
      <div className="fixed left-4 bottom-4 z-40">
        <button
          onClick={() => router.push('/myorder')}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300 flex items-center"
        >
          <span>My Orders</span>
        </button>
      </div>

      {/* Shopping cart button (fixed on the right) */}
      <div className="fixed right-4 bottom-4 z-40">
        <button
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition duration-300 flex items-center"
        >
          <ShoppingCartIcon className="h-6 w-6 mr-2" />
          <span>Your Order {cartItems.length > 0 && `(${cartItems.length})`}</span>
        </button>
      </div>

      {/* Cart sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white shadow-lg w-80 z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        <div className="p-4 bg-[#ED8265] text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">Your Current Order</h3>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-white hover:text-red-200"
          >
            &times;
          </button>
        </div>

        <div className="p-4">
          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center py-6">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={`<span class="math-inline">\{item\.\_id\}\-</span>{index}`} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-gray-600 text-sm">{item.note}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateCartItemQuantity(index, item.quantity - 1)}
                        className="bg-gray-200 px-2 rounded"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateCartItemQuantity(index, item.quantity + 1)}
                        className="bg-gray-200 px-2 rounded"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold">฿{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>฿{calculateTotal().toFixed(2)}</span>
                </div>

                {orderError && <p className="text-red-500 mt-2">{orderError}</p>}

                <button
                  onClick={handleConfirmOrder}
                  className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded mt-4 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading || cartItems.length === 0}
                >
                  {loading ? 'Placing Order...' : 'Confirm Order'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-10 mb-8 w-full md:w-3/4 lg:w-1/2">
        <img src="/img/food3.jpg"
          alt={restaurant.name}
          className="rounded-md mb-4 w-full object-cover h-48"
        />
        <div className="flex justify-between items-start">
          <div className="flex-grow">
            <h1 className="text-3xl font-semibold mb-4 text-red-700">{restaurant.name}</h1> {/* Red text */}
            <p className="text-gray-700 mb-2">
              <span className="font-semibold text-red-500">Address:</span> {restaurant.address}
            </p> {/* Red accent */}
            <p className="text-gray-700 mb-2">
              <span className="font-semibold text-red-500">Tel:</span> {restaurant.tel}
            </p> {/* Red accent */}
            <p className="text-gray-700 mb-2">
              <span className="font-semibold text-red-500">Open Time:</span> {restaurant.opentime}
            </p> {/* Red accent */}
            <p className="text-gray-700">
              <span className="font-semibold text-red-500">Close Time:</span> {restaurant.closetime}
            </p> {/* Red accent */}
          </div>
          <div className="flex-shrink-0 ml-4">
            <div className="card">
              <ul className="flex flex-col py-5 gap-5">
                {/* Facebook */}
                <li className="iso-pro">
                  <span></span>
                  <span></span>
                  <span></span>
                  <a href="#">
                    <svg viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg" className="svg h-6 w-6">
                      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                    </svg>
                  </a>
                  <div className="text">Facebook</div>
                </li>

                {/* Twitter */}
                <li className="iso-pro">
                  <span></span>
                  <span></span>
                  <span></span>
                  <a href="#">
                    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className="svg h-6 w-6">
                      <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                    </svg>
                  </a>
                  <div className="text">Twitter</div>
                </li>

                {/* Instagram */}
                <li className="iso-pro">
                  <span></span>
                  <span></span>
                  <span></span>
                  <a href="#">
                    <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" className="svg h-6 w-6">
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                  </a>
                  <div className="text">Instagram</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-3/4 lg:w-1/2 mt-8 flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-red-700">Menu</h2>
        <div className="relative inline-block">
          <button
            ref={filterButtonRef}
            onClick={toggleFilterDropdown}
            className="bg-red-300 hover:bg-red-400 text-white font-bold py-2 px-3 rounded focus:outline-none focus:ring focus:ring-red-200 transition duration-300 ease-in-out flex items-center hover:scale-105 border-2 border-red-500"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2 text-white" aria-hidden="true" />Filter
          </button>
          {isFilterOpen && (
            <div
              ref={filterDropdownRef}
              className="absolute right-0 mt-2 w-52 bg-red-100 rounded-md shadow-lg z-10 overflow-hidden transition-all duration-300 ease-in-out transform origin-top-right scale-95 opacity-0 border-2 border-red-500"
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
                  className="block px-4 py-3 text-lg text-gray-800 hover:bg-red-200 cursor-pointer hover:scale-105 transition duration-150 ease-in-out border-b border-red-300 last:border-b-0"
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
                  className="block w-full px-4 py-3 text-sm text-red-500 hover:bg-red-200 text-left cursor-pointer transition duration-150 ease-in-out hover:scale-105 border-t border-red-300"
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 w-full md:w-3/4 lg:w-1/2">
        {filteredMenuItems &&
          filteredMenuItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg overflow-hidden hover:scale-105 transition duration-200 ease-in-out hover:border-4 hover:border-red-300"
            >
              <div className="relative">
                <img src="/img/menu.png" alt={item.name} className="rounded-t-lg w-full object-cover h-32" />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-xl text-red-700 mb-2">{item.name}</h3>
                <p className="text-gray-700 text-base mb-3">{item.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-green-600 font-bold text-lg">฿{item.price.toFixed(2)}</p>
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="text-sm text-red-500 italic">
                      Contains:
                      {item.allergens
                        .map((allergen) => {
                          if (allergen.name && Array.isArray(allergen.name)) {
                            return allergen.name.join(', ');
                          } else if (allergen.name && typeof allergen.name === 'string') {
                            return allergen.name;
                          } else {
                            console.warn('Unexpected allergen name format for join:', allergen.name);
                            return '';
                          }
                        })
                        .join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full flex justify-center mt-4">
                <button className={`group ${styles["button"]}`} onClick={() => handleClick(item)}>
                  <span className="relative z-10 text-white group-hover:text-black transition-colors duration-300">
                    Add menu to your order
                  </span>
                </button>
              </div>
            </div>
          ))}
        {filteredMenuItems && filteredMenuItems.length === 0 && (
          <p className="text-gray-500">No menu items found {selectedAllergens.length > 0 ? 'matching your filter.' : '.'}</p>
        )}
      </div>

      {/* Add to cart popup */}
      {showPopup && selectedMenuItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-[#F4ECDD] rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
            {/* Header with Menu Picture */}
            <div className="bg-[#F4ECDD] flex">
              <img src="/img/menu.png" alt={selectedMenuItem.name} className="w-full h-48 object-cover" />
            </div>

            {/* Description */}
            <div className="bg-gray-50 p-4 mt-4 mx-4 rounded">
              <h1 className="text-center text-[#201335] text-xl font-bold">{selectedMenuItem.name}</h1>
              <p className="text-center text-gray-600">{selectedMenuItem.description}</p>
            </div>

            {/* Input Field */}
            <div className="p-4">
              <input
                type="text"
                placeholder="Special requests (optional)..."
                className="w-full p-2 border border-gray-300 rounded"
                value={specialRequest}
                onChange={(e) => setSpecialRequest(e.target.value)}
              />
            </div>

            {/* Quantity Controls and Confirm Button */}
            <div className="p-4 flex justify-between items-center bg-[#F4ECDD]">
              <div className="flex items-center space-x-4">
                <button
                  className="text-2xl font-bold text-gray-600 hover:text-red-600"
                  onClick={decreaseQuantity}
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  className="text-2xl font-bold text-gray-600 hover:text-green-600"
                  onClick={increaseQuantity}
                >
                  +
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition duration-200"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
                  onClick={addToCart}
                >
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Successfully Placed!</h2>
            <p className="text-gray-600 mb-6">Your order has been received and is being processed.</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded transition duration-200"
              >
                Close
              </button>
              <button
                onClick={() => router.push('/myorder')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition duration-200"
              >
                My Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersMenuPage;