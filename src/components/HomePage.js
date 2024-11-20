import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HomePage.css';

//I believe this is, similar to todo, is how we can check items and remove them.
//When a button is pressed, call this func. This func will remove items from UI and call a query to remove item from database.
function checklistItem() {
    
}

export default function HomePage() {
    console.log("on homepage");
    const [inputText, setInputText] = useState([]);
    const [newItems, setNewItems] = useState([]);


    //Fetch items from the database. useEffect func will do this when the HomePage is loaded
    useEffect(() => {
        const token = localStorage.getItem('token');

        //If there is a token, fetch ShoppingList items
        if(token) {
            const fetchItems = async () => {
                try {
                    const items = await axios.get("http://localhost:3001/items", {
                        headers: {Authorization: `Bearer ${token}`}
                    });
                    setNewItems(items.data); //Store the detched items
                } catch (error) {
                    console.error('Error fetching items: ', error);
                }
            };
            fetchItems(); //Function created. Now, fetch shopping list items
        } else {
            console.error('No token found, so no items fetched && redirecting to login.');
        }
    }, []);

    //Add an item to shopping list
    const addItem = async () => {
        if(!inputText.trim()) { //Check if input is empty
            alert('Please enter an item.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:3001/items', {ListItem: inputText}, { //calls to database, at port 3001, that it wants items
                headers: {Authorization: `Bearer ${token}`} //Add Bearer before token for POST request
            });

            setNewItems([...newItems, response.data]);
            setInputText(''); // Clear the input field
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    //Remove an item from the shopping list
        //code goes here

    return(
        <div>
            <header>
                <h1>Dean's Food List</h1>
            </header>

            <nav>
            </nav>

            <section id="content">
                <p>Welcome to Dean's List!</p>
                
                <div className="quick-entry">
                    <input 
                        type="text" 
                        id="new-item" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)} // Update inputText on change
                        placeholder="Add a new item"
                    />

                    <button id="add-button" onClick={addItem}>Add</button>
                    
                    <ul>
                        {newItems.map((item, index) => (
                            <li key={index}>{item.ListItem}</li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
}