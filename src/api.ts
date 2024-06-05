"use server"


import {XMLParser} from "fast-xml-parser";

const MERCURY_API = 'https://uptime-mercury-api.azurewebsites.net/webparser';

// Fetch feed from input URL
export const fetchRSSFeed = async (rssUrl: string) => {
    try {
        const response = await fetch(rssUrl, {
            method: "GET",
            cache: "no-cache"
        });
        const parser = new XMLParser();
        const xml = parser.parse(await response.text());
        console.log(xml.channel.item);

        const channelElement = xml.channel.title;

        const items = xml.channel.item;

        // Create Array of articles with selected items from feed items
        const articles = Array.from(items).map(item => {
            const mediaContent = item.querySelector('media\\:content, content');
            const enclosure = item.querySelector('enclosure');
            const imageUrl = mediaContent?.getAttribute('url') || enclosure?.getAttribute('url') || '';
            return {
                feedTitle: channel,
                title: item.querySelector('title')?.textContent || 'No Title',
                description: item.querySelector('description')?.textContent || 'No Description',
                pubDate: new Date(item.querySelector('pubDate')?.textContent || Date.now()),
                categories: Array.from(item.querySelectorAll('category')).map(cat => cat.textContent),
                imageUrl
            };
        });

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
        const xml = parse(response.data);
        return !!(xml.querySelector('rss') || xml.querySelector('feed')); // Check for RSS or Atom feeds
    } catch (error) {
        return false;
    }
};

// Fetch cleaned content from article link using POST method
export const fetchArticleContent = async (articleUrl: string) => {
    try {
        const response = await fetch(MERCURY_API, { url: articleUrl }, {
            method: 'POST',
            cache: "no-cache",
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("LOÖ");
        console.log(articleUrl);
        console.log(response);
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error('Error fetching article content:', error);
        return 'Failed to fetch content';
    }
};

