"use client"

import { useState, useEffect } from "react"
import { fetchRSSFeed, fetchArticleContent} from "@/services/fetcher"
import {useModal} from "@/hooks/useModal";
import {Article} from "@/components/Article";

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
    const { modal, showModal, closeModal} = useModal({data: currentArticleData})

    // open modal to view articles
    const openModal = async (url: string) => {
        showModal({ title: 'Loading...', author: '', date_published: '', lead_image_url: '', content: '', url: url})
        const data = await fetchArticleContent(url);
        if (data === "Failed to fetch content" || null) {
            showModal({ title: "Could not fetch content", author: '', date_published: '', lead_image_url: '', content: '', url: url})
        } else {
            setCurrentArticleData(data);
            showModal(data)
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
                    <label style={{color: "#171238", fontWeight: "bold"}}>Filter by Category:</label>
                    <div className="selectContainer">
                        <select
                            className="selectBox"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option className="option" value="">All</option>
                            {categories.map((category, index) => (
                                <option className="option" key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button id="removeFeedButton" onClick={() => removeFeed(feedUrl)}>Remove Feed</button>
            </div>
            <ul>
                {filteredItems.map((item, index) => (
                    <li key={index}>
                        <Article item={item} openModal={openModal} removeArticle={removeArticle}></Article>
                    </li>
                ))}
            </ul>
            {modal}
        </div>
    );
};

export default RSSFeed;