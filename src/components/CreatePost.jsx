import React, { useState } from 'react';
import axios from 'axios';

function CreatePost() {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Bhai, pehle ek photo toh select kar le!");
            return;
        }

        const formData = new FormData();
        formData.append('image', file); 
        formData.append('caption', caption);

        try {
            alert("Uploading... Thoda sabr rakho bhai! ⏳");

            // 🔥 DHUAN DHUAN URL: Backend mein app.post('/create-post') hai, isiliye yahan exact yahi hona chahiye!
            const response = await axios.post('http://localhost:3000/create-post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log("Backend Response 🔥:", response.data);
            alert("Post successfully upload ho gaya bhai! 🎉");
            
            // Form Reset
            setFile(null);
            setCaption("");
            
            // Page refresh taaki naya post feed mein turant dikhe
            window.location.reload();
        } catch (error) {
            console.error("Frontend Upload Error ❌:", error);
            alert("Kuch jhol ho gaya upload me!");
        }
    };

    return (
        <div className="upload-container">
            <h2>Create New Post</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Select Image:</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>

                <div className="form-group">
                    <label>Caption:</label>
                    <input 
                        type="text" 
                        placeholder="Write a moody caption... 🖤" 
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                    />
                </div>

                <button type="submit">Share Post</button>
            </form>
        </div>
    );
}

export default CreatePost;