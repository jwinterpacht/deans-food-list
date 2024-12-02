import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import Quagga from 'quagga'; // Import Quagga for barcode detection
import axios from 'axios'; // Import Axios for API requests
import './Apps.css'; // Assuming you have the appropriate CSS for layout

function InventoryPage() {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ name: '', quantity: '', expiration: '', category: '', upc: '' });
    const [sortCategory, setSortCategory] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [showScanner, setShowScanner] = useState(false); // State to show the scanner
    const [scannedUPC, setScannedUPC] = useState(''); // State to store the scanned UPC

    const webcamRef = useRef(null); // Webcam reference

    // Function to fetch product details from Open Food Facts API
    const fetchProductDetails = async (upcCode) => {
        try {
            const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${upcCode}.json`);
            const product = response.data.product;

            if (product) {
                // Format the product name and category
                const productName = product.product_name
                    ? product.product_name.replace(/\b\w/g, char => char.toUpperCase()) // Capitalize first letter of each word
                    : 'Unknown Item';
                const productCategory = product.categories_tags
                    ? product.categories_tags[0].replace('en:', '').replace(/-/g, ' ') // Remove 'en:' and replace dashes with spaces
                    : 'Misc';
                const expirationDate = product.expiration_date || 'No Expiration';
                return { name: productName, category: productCategory, expiration: expirationDate };
            } else {
                return { name: 'Unknown Item', category: 'Misc', expiration: 'No Expiration' };
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            return { name: 'Unknown Item', category: 'Misc', expiration: 'No Expiration' };
        }
    };

    // Handle adding a new item
    const addItem = (item) => {
        setItems([...items, item]);
        setNewItem({ name: '', quantity: '', expiration: '', category: '', upc: '' }); // Clear fields after adding
    };

    // Handle sorting by category
    const handleSortCategory = (category) => {
        setSortCategory(category);
    };

    // Handle sorting by field (e.g., name, quantity, expiration)
    const handleSortByField = (field) => {
        setSortBy(field);
    };

    // Handle deleting an item
    const deleteItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    // Fetch product details when UPC is manually entered
    const handleUPCChange = async (e) => {
        const upcCode = e.target.value;
        setNewItem({ ...newItem, upc: upcCode });

        if (upcCode.length === 12 || upcCode.length === 13) {
            const productDetails = await fetchProductDetails(upcCode);

            // Automatically add the item with fetched product details
            const newProductItem = {
                name: productDetails.name,
                quantity: 1,
                expiration: productDetails.expiration,
                category: productDetails.category,
                upc: upcCode
            };

            addItem(newProductItem);
        }
    };

    // Initialize Quagga when scanning starts
    useEffect(() => {
        if (showScanner) {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: webcamRef.current.video, // Target the video stream from react-webcam
                    constraints: {
                        facingMode: "environment", // Use the back camera on mobile devices
                    },
                    frequency: 10 // Scan every 10 milliseconds
                },
                decoder: {
                    readers: ["upc_reader", "upc_e_reader", "ean_reader"] // Multiple barcode readers
                },
                locator: {
                    patchSize: "medium", // "x-small", "small", "medium", "large" or "x-large"
                    halfSample: true, // Reduces image size for faster performance
                },
                debug: true, // Enable debug mode to see how the barcode is being processed
            }, (err) => {
                if (err) {
                    console.error("Error initializing Quagga:", err);
                    return;
                }
                Quagga.start(); // Start the barcode scanner
            });

            // Listen for barcode detection
            Quagga.onDetected(async (data) => {
                if (data && data.codeResult && data.codeResult.code) {
                    const scannedUPCCode = data.codeResult.code;
                    setScannedUPC(scannedUPCCode); // Store the scanned UPC

                    // Fetch product details from Open Food Facts API
                    const productDetails = await fetchProductDetails(scannedUPCCode);

                    // Automatically add the scanned item to the inventory with product details
                    const scannedItem = {
                        name: productDetails.name, // Product name from API
                        quantity: 1, // Default quantity
                        expiration: productDetails.expiration, // Expiration from API or default
                        category: productDetails.category, // Category from API
                        upc: scannedUPCCode // The scanned UPC code
                    };
                    addItem(scannedItem); // Add the item to the inventory

                    Quagga.stop(); // Stop scanning after detection
                    setShowScanner(false); // Hide the scanner after scanning
                }
            });

            // Cleanup on component unmount or when scanner is stopped
            return () => {
                Quagga.stop(); // Stop Quagga when component unmounts or scanning stops
            };
        }
    }, [showScanner]);

    // Filter and sort items based on category and sorting field
    const filteredItems = sortCategory
        ? items.filter(item => item.category === sortCategory)
        : items;

    const sortedItems = filteredItems.sort((a, b) => {
        if (sortBy === 'name') {
            return a.name.localeCompare(b.name);
        } else if (sortBy === 'quantity') {
            return a.quantity - b.quantity;
        } else if (sortBy === 'expiration') {
            return new Date(a.expiration) - new Date(b.expiration);
        }
        return 0; // No sorting
    });

    return (
        <div className="inventory-page">
            <header>
                <h1>Dean's Food List</h1>
            </header>

            <nav>
                <a href="/inventory">Inventory</a>
                <a href="/list">List</a>
                <a href="/recipes">Recipes</a>
                <a href="/settings">Settings</a>
            </nav>

            <section id="content">
                <h2>Inventory</h2>
                <p>Manage your grocery inventory here. Add, edit, or delete items from your inventory list.</p>

                <div className="item-form">
                    <input
                        type="text"
                        placeholder="Item Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={newItem.quantity}
                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    />
                    <input
                        type="date"
                        placeholder="Expiration Date"
                        value={newItem.expiration}
                        onChange={(e) => setNewItem({ ...newItem, expiration: e.target.value })}
                    />
                    <select
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    >
                        <option value="">Select Category</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Produce">Produce</option>
                        <option value="Meat">Meat</option>
                        <option value="Beverages">Beverages</option>
                    </select>

                    {/* Manually Enter UPC Code */}
                    <input
                        type="text"
                        placeholder="UPC Code"
                        value={newItem.upc}
                        onChange={handleUPCChange} // Trigger fetch when UPC is manually entered
                    />
                    <button onClick={() => setShowScanner(true)}>Scan UPC</button>

                    <button onClick={() => addItem(newItem)}>Add Item</button>
                </div>

                {/* Webcam for UPC Scanning */}
                {showScanner && (
                    <div className="scanner">
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            width={640} // Set the resolution to 640x480 for better barcode detection
                            height={480}
                            videoConstraints={{
                                facingMode: "environment" // Use back camera
                            }}
                        />
                        <button onClick={() => setShowScanner(false)}>Close Scanner</button>
                    </div>
                )}

                <div className="sort-options">
                    <label>Sort by Category: </label>
                    <select onChange={(e) => handleSortCategory(e.target.value)}>
                        <option value="">All</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Produce">Produce</option>
                        <option value="Meat">Meat</option>
                        <option value="Beverages">Beverages</option>
                    </select>

                    <label>Sort by Field: </label>
                    <select onChange={(e) => handleSortByField(e.target.value)}>
                        <option value="">None</option>
                        <option value="name">Name</option>
                        <option value="quantity">Quantity</option>
                        <option value="expiration">Expiration Date</option>
                    </select>
                </div>

                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity</th>
                            <th>Expiration Date</th>
                            <th>Category</th>
                            <th>UPC Code</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedItems.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.expiration}</td>
                                <td>{item.category}</td>
                                <td>{item.upc}</td>
                                <td>
                                    <button onClick={() => deleteItem(index)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
}

export default InventoryPage;
