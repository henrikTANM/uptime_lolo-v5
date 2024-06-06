"use server"

import {XMLParser} from "fast-xml-parser";

const MERCURY_API = 'https://uptime-mercury-api.azurewebsites.net/webparser';
const Parser = new XMLParser({ ignoreAttributes : false, attributeNamePrefix : "@_", allowBooleanAttributes: true });

// Fetch feed from input URL
export const fetchRSSFeed = async (rssUrl: string) => {
    try {
        const response = await fetch(rssUrl, {
            method: "GET",
            cache: "no-cache"
        });
        const json = Parser.parse(await response.text());
        const channel = json.rss.channel
        const feedTitle = channel.title;
        const items = channel.item;

        // Create Array of articles with selected items from feed items
        // @ts-ignore
        const articles = Array.from(items.map(item => {
            const imageUrl = item['media:content']?.['@_url'] || item.enclosure?.['@_url'] || '';
            return {
                feedTitle: feedTitle,
                title: item.title,
                link: item.link,
                description: item.description,
                pubDate: new Date(item.pubDate),
                categories: item.categories,
                imageUrl: imageUrl,
            };
        }));

        // Sort articles by publish date latest to oldest
        // @ts-ignore
        articles.sort((a, b) => b.pubDate - a.pubDate);

        return articles;
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return [];
    }
}

// Validate input URL
export const validateRSSFeed = async (rssUrl: string) => {
    try {
        const response = await fetch(rssUrl,{
            method: "GET",
            cache: "no-cache"
        });
        const json = Parser.parse(await response.text());
        return json.rss ? true : false; // Check for RSS or Atom feeds
    } catch (error) {
        console.error('Error validating RSS feed:', error);
        return false;
    }
};

// Fetch cleaned content from article link using POST method
export const fetchArticleContent = async (articleUrl: string) => {
    try {
        const response = await fetch(MERCURY_API, {
            method: 'POST',
            cache: "no-cache",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: articleUrl })
        });
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error('Error fetching article content:', error);
        return 'Failed to fetch content';
    }
};

