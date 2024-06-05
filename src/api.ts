"use server"

import { parse } from 'node-html-parser';
export const testApi = async (rssUrl: string) => {


    try {
        const response = await fetch(rssUrl, {
            method: "GET"
        });
        const xml = parse(await response.text());

        const channelElement = xml.querySelector('channel > title');
        const channel = channelElement ? channelElement.textContent : 'No Channel Title';

        const items = xml.querySelectorAll('item');

        // Create Array of articles with selected items from feed items
        const articles = Array.from(items).map(item => {
            const mediaContent = item.querySelector('media\\:content, content');
            const enclosure = item.querySelector('enclosure');
            const imageUrl = mediaContent?.getAttribute('url') || enclosure?.getAttribute('url') || '';
            return {
                feedTitle: channel,
                title: item.querySelector('title')?.textContent || 'No Title',
                link: item.querySelector('link')?.textContent || 'No Link',
                description: item.querySelector('description')?.textContent || 'No Description',
                pubDate: new Date(item.querySelector('pubDate')?.textContent || Date.now()),
                categories: Array.from(item.querySelectorAll('category')).map(cat => cat.textContent),
                imageUrl
            };
        });

        // Sort articles by publish date latest to oldest
        articles.sort((a, b) => b.pubDate - a.pubDate);

        return articles;
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return [];
    }
}

