import {testApi} from "@/api";

const TestComponent = async  () => {

    const DEFAULT_FEED = 'https://flipboard.com/@raimoseero/feed-nii8kd0sz.rss';
    const feeds = await testApi(DEFAULT_FEED);

    console.log(feeds)


    return (
        <div>
            {feeds.map((feed, index) => <div key={index}>{feed.title}</div>)}
        </div>
    )
}

export default TestComponent;