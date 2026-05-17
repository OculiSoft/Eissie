import { useEffect, useState } from "react"
import { getImageBaseUrl, getInfoEndpoint } from "./Configuration"


interface PocketBaseItem
{
    collectionId: string
    field: string
    id: string
}
interface PocketBaseInfo
{
    items: PocketBaseItem[]
}

function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function MainForm() {
    const [duration, setDuration] = useState<number>(30);
    const [dataSource, setDataSource] = useState<string | null>(null);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [image, setImage] = useState<string | null>();

    useEffect(() => {
        if (intervalId !== null) {
            clearInterval(intervalId);
        }

        setIntervalId(setInterval(updateImage, duration * 1000));
        updateImage();
    }, [ duration ]);

    function updateImage() {
        fetch(getInfoEndpoint())
        .then(x => x.json())
        .then((json : PocketBaseInfo) => {
            const index = randInt(0, json.items.length - 1)
            const item = json.items[index];
            setImage(`${getImageBaseUrl()}${item.collectionId}/${item.id}/${item.field}`);
        });
    }

    return <>
        <div className="container box" id="settings">
            <input type="radio" id="duration-30" checked={duration == 30} onChange={() => setDuration(30)} />
            <label htmlFor="duration-30">30s</label>
            <input type="radio" id="duration-120" checked={duration == 120} onChange={() => setDuration(120)} />
            <label htmlFor="duration-120">2m</label>
            <input type="radio" id="duration-300" checked={duration == 300} onChange={() => setDuration(300)} />
            <label htmlFor="duration-300">5m</label>
            <input type="radio" id="duration-600" checked={duration == 600} onChange={() => setDuration(600)} />
            <label htmlFor="duration-600">10m</label>
            <br/>
            <input type="text" />
        </div>
        <div className="container box is-flex flex-center-hor" id="main-display">
            {
                image ? <div id="main-display-img-container"><img src={image} /></div> : <></> 
            }
        </div>
    </> 
}