"use client"

// @ts-ignore
import {useEffect, useState} from "react";

// @ts-ignore
export const Article = ({item, openModal, removeArticle}) => {

    const [categories, setCategories] = useState("")

    useEffect(() => {
        item.categories && setCategories(item.categories[0])
    }, [item]);

    const onEnter = () => {
        item.categories && setCategories(item.categories.join("; "))
        console.log(categories)
    }

    const onExit = () => {
        item.categories && setCategories(item.categories[0])
    }

    return (
        <div className="article">
            <div className="articleImageAndCategoryContainer">
                {categories !== "" && <p className="articleCategory" onMouseEnter={onEnter} onMouseLeave={onExit}>{categories && categories}</p>}
                {// @ts-ignore
                    item.imageUrl && <img className="articleImage" src={item.imageUrl} alt={item.title} onClick={
                        // @ts-ignore
                        () => openModal(item.link)}/>}
            </div>
            <div className="articleContent">
                <div className="textContent">
                    <h4 className="articleTitle" onClick={// @ts-ignore
                        () => openModal(item.link)}>{item.title}</h4>
                    <p onClick={// @ts-ignore
                        () => openModal(item.link)}
                       style={{cursor: 'pointer', color: "#171238"}}>{item.description}</p>
                </div>
                <div className="articleFooter">
                    <p><small>{// @ts-ignore
                        item.pubDate.toLocaleDateString()}</small></p>
                    <p><small>{// @ts-ignore
                        item.author && item.author}</small></p>
                    <button onClick={// @ts-ignore
                        () => removeArticle(item.link)}>Remove
                    </button>
                </div>
            </div>
        </div>
    )
}