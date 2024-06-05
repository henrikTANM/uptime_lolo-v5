"use client"

import { useState, useEffect } from "react";
import RSSFeed from "@/RSSFeed";
import DOMPurify from 'dompurify';
import { validateRSSFeed } from "@/api";
// @ts-ignore
export const dynamic = "force-dynamic";

const DEFAULT_FEED = 'https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss';

export default function Home() {
    //const storedFeeds = JSON.parse(sessionStorage.getItem('feeds')) || [];
    const [feeds, setFeeds] = useState([]);
    const [newFeed, setNewFeed] = useState('');

    // initialize default feed if session is open for the first time and is not changed
    useEffect(() => {
        /*
        const isInitialized = sessionStorage.getItem('isInitialized');
        if (!isInitialized && storedFeeds.length === 0) {
            setFeeds([DEFAULT_FEED]);
            sessionStorage.setItem('feeds', JSON.stringify([DEFAULT_FEED]));
        }
        */
        setFeeds([DEFAULT_FEED]);
    }, []);

    // handle feeds in session storage'
    /*
    useEffect(() => {
        if (feeds.length === 0) {
            sessionStorage.removeItem('feeds');
        } else {
            sessionStorage.setItem('feeds', JSON.stringify(feeds));
        }
    }, [feeds]);
    */

    // add feed
    const addFeed = async () => {
        const goodRssURL = true//await validateRSSFeed(newFeed);
        console.log(goodRssURL);
        if (goodRssURL) {
            const sanitizedFeed = DOMPurify.sanitize(newFeed);
            if (sanitizedFeed && !feeds.includes(sanitizedFeed)) {
                setFeeds([sanitizedFeed, ...feeds]);
                setNewFeed('');
            }
        }
        //sessionStorage.setItem('isInitialized', 'true');
    };

    // remove feed
    const removeFeed = (feed) => {
        const updatedFeeds = feeds.filter(f => f !== feed);
        setFeeds(updatedFeeds);
        //sessionStorage.setItem('isInitialized', 'true');
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
            {feeds.length === 0 ? (
                <p style={{ marginTop: '100px', marginLeft: '15px', color: '#171238' }}>Add a new feed to get started.</p>
            ) : (
                feeds.map((feed, index) => (
                    <div key={index} className="feedContainer">
                        <RSSFeed feedUrl={feed} removeFeed={removeFeed}/>
                    </div>
                ))
            )}
        </div>
    );
};
