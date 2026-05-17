import { useEffect, useState } from "react"
import { getImageBaseUrl, getInfoEndpoint } from "./Configuration"


interface PocketBaseItem
{
    collectionId: string
    field?: string
    File?: string
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
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [apiLink, setApiLink] = useState(getInfoEndpoint());
    const [image, setImage] = useState<string | null>();

    function updateInterval() {
        if (intervalId !== null) {
            clearInterval(intervalId);
        }

        setIntervalId(setInterval(updateImage, duration * 1000));
        updateImage();
    }
    useEffect(updateInterval, [ duration, apiLink ]);

    function updateImage() {
        fetch(apiLink)
        .then(x => x.json())
        .then((json : PocketBaseInfo) => {
            const index = randInt(0, json.items.length - 1)
            const item = json.items[index];
            setImage(`${getImageBaseUrl()}${item.collectionId}/${item.id}/${item.field ?? item.File}`);
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
            <input type="text" onChange={e => setApiLink(e.target.value)} value={apiLink} />
            <br/>
            <button onClick={() => {
                if (intervalId === null) {
                    updateInterval();
                } else {
                    clearInterval(intervalId);
                    setIntervalId(null);
                }
            }}>{ intervalId === null ? "Resume" : "Pause" }</button>
            <button onClick={updateInterval}>Skip</button>
        </div>
        <div className="container box is-flex flex-center-hor" id="main-display">
            {
                image ? <div id="main-display-img-container"><img src={image} /></div> : <></> 
            }
        </div>
    </> 
}