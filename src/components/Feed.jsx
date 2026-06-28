import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // 🚀 Tumhaare backend ka exact /post route
                const response = await axios.get('http://localhost:3000/post');
                console.log("Database se aaye posts 📸:", response.data);
                
                // Tumhaare backend se { posts: [...] } aa raha hai, isiliye response.data.posts pakda
                setPosts(response.data.posts || []); 
                setLoading(false);
            } catch (error) {
                console.error("Feed Fetch Error ❌:", error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div className="loading">Loading Feed... ⏳</div>;
    }

    return (
        <div className="feed-container">
            <h2>Explore Feed</h2>
            
            {posts.length === 0 ? (
                <p className="no-posts">Bhai abhi tak koi post nahi hai. Pehle upload karo!</p>
            ) : (
                <div className="feed-grid">
                    {posts.map((singlePost) => (
                        <div key={singlePost._id} className="post-card">
                            {/* Backend ke schema mein 'image' field hai */}
                            <img src={singlePost.image} alt="Post" className="post-image" />
                            <p>{singlePost.caption}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Feed;