"use client"

import { useState, useEffect } from "react"
import { fetchRSSFeed, fetchArticleContent} from "@/services/fetcher"
import {useModal} from "@/hooks/useModal";

// @ts-ignore
const RSSFeed = ({ feedUrl, removeFeed }) => {
    const [articles, setArticles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    // @ts-ignore
    const [removedArticles, setRemovedArticles] = useState(JSON.parse(sessionStorage.getItem(`removedArticles_${feedUrl}`)) || []);
    const [currentArticleData, setCurrentArticleData] = useState({});
    const [feedTitle, setFeedTitle] = useState("Loading...");

    // fetch articles and set categories
    useEffect(() => {
        const getRSSFeed = async () => {
            const items = await fetchRSSFeed(feedUrl);
            if (items.length > 0) {
                // @ts-ignore
                setFeedTitle(items[0].feedTitle);
            }
            // @ts-ignore
            setArticles(items);

            // make categories list for filtering
            const uniqueCategories = Array.from(
                // @ts-ignore
                new Set(items.flatMap(item => item.categories))
            );
            // @ts-ignore
            setCategories(uniqueCategories);
        };

        getRSSFeed();
    }, [feedUrl]);

    // set removed articles item in session storage
    useEffect(() => {
        sessionStorage.setItem(`removedArticles_${feedUrl}`, JSON.stringify(removedArticles));
    }, [removedArticles, feedUrl]);

    // @ts-ignore
    const { modal, openModal, closeModal} = useModal({data: currentArticleData})

    // open modal to view articles
    const openModalUp = async (url: string) => {
        openModal({ title: 'Loading...', author: '', date_published: '', lead_image_url: '', content: '', url: url})
        const data = await fetchArticleContent(url);
        if (data === "Failed to fetch content" || null) {
            openModal({ title: "Could not fetch content", author: '', date_published: '', lead_image_url: '', content: '', url: url})
        } else {
            setCurrentArticleData(data);
            openModal(data)
        }
    };

    // remove article
    const removeArticle = (link: any) => {
        setRemovedArticles([...removedArticles, link]);
    };

    // filter out removed articles and articles with different categories than selected category
    const filteredItems = selectedCategory
        // @ts-ignore
        ? articles.filter(item => item.categories.includes(selectedCategory) && !removedArticles.includes(item.link))
        // @ts-ignore
        : articles.filter(item => !removedArticles.includes(item.link))

    return (
        <div>
            <div className="feedHeader">
                <h1 style={{color: "#171238"}}>{feedTitle}</h1>
                <div className="filter">
                    <label style={{color: "#171238"}}>Filter by Category:</label>
                    <select
                        className="categoryFilter"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
                <button id="removeFeedButton" onClick={() => removeFeed(feedUrl)}>Remove Feed</button>
            </div>
            <ul>
                {filteredItems.map((item, index) => (
                    <li key={index}>
                        <div className="article">

                            {// @ts-ignore
                                item.imageUrl && <img className="articleImage" src={item.imageUrl} alt={item.title} onClick={
                                    // @ts-ignore
                                    () => openModalUp(item.link)}/>}
                            <div className="articleContent">
                                <div className="textContent">
                                    <h4 className="articleTitle" onClick={// @ts-ignore
                                        () => openModalUp(item.link)}>{item.title}</h4>
                                    <p onClick={// @ts-ignore
                                        () => openModalUp(item.link)} style={{cursor: 'pointer', color: "#171238"}}>{item.description}</p>
                                </div>
                                <div className="articleFooter">
                                    <p><small>{// @ts-ignore
                                        item.pubDate.toLocaleDateString()}</small></p>
                                    <button onClick={// @ts-ignore
                                        () => removeArticle(item.link)}>Remove</button>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            {modal}
        </div>
    );
};

export default RSSFeed;