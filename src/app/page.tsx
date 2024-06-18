"use client"

import { useState, useEffect, Key} from "react";
import RSSFeed from "@/components/RSSFeed";
import DOMPurify from "dompurify";
import {validateRSSFeed} from "@/services/fetcher";

const DEFAULT_FEED = 'https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss';

export default function Home() {
    const [feeds, setFeeds] = useState([]);
    const [newFeed, setNewFeed] = useState('');

    // manage session storage
    useEffect(() => {
        // @ts-ignore
        const storedFeeds = JSON.parse(sessionStorage.getItem('feeds')) || [];
        const isInitialized = sessionStorage.getItem('isInitialized');

        if (!isInitialized) {
            // Initialize with DEFAULT_FEED if it's a new session
            // @ts-ignore
            setFeeds([DEFAULT_FEED]);
            sessionStorage.setItem('feeds', JSON.stringify([DEFAULT_FEED]));
            sessionStorage.setItem('isInitialized', 'true');
        } else if (storedFeeds){
            // Load the stored feeds
            setFeeds(storedFeeds);
        }
    }, []);

    useEffect(() => {
        if (feeds.length > 0) {
            sessionStorage.setItem('feeds', JSON.stringify(feeds));
        }
    }, [feeds]);

    // add new feed
    const addFeed = async () => {
        // @ts-ignore
        if (newFeed && !feeds.includes(newFeed)) {
            const isValid = await validateRSSFeed(newFeed);
            if (isValid) {
                // @ts-ignore
                setFeeds([newFeed, ...feeds]);
                setNewFeed('');
            } else {
                alert('Invalid RSS feed URL');
            }
        }
    };

    //remove feed
    const removeFeed = (feed: any) => {
        const updatedFeeds = feeds.filter(f => f !== feed);
        setFeeds(updatedFeeds);
        sessionStorage.removeItem(`removedArticles_${feed}`);
        if (updatedFeeds.length === 0) {
            sessionStorage.removeItem('feeds');
        }
    };

    return (
        <div className="App">
            <div className="menuBar">
                <h1 onClick={() => window.scrollTo({top: 0, left: 0, behavior: "smooth"})}>Lolo v5</h1>
                <div className="feedInput">
                    <input
                        id="rssInput"
                        type="text"
                        value={newFeed}
                        onChange={(e) => setNewFeed(e.target.value)}
                        placeholder="Add new RSS feed URL"
                    />
                    <button id="addFeedButton" onClick={addFeed}>Add Feed</button>
                </div>
            </div>
            <div>
                {feeds.length === 0 ? (
                    <p style={{marginTop: '100px', marginLeft: '15px', color: '#171238'}}>Add a new feed to get started.</p>
                ) : (
                    feeds.map((feed: any, index: Key | null | undefined) => (
                        <div key={index} className="feedContainer">
                            <RSSFeed feedUrl={feed} removeFeed={removeFeed}/>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
