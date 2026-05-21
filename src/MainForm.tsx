import { useEffect, useRef, useState } from "react"
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
    totalItems: number
    perPage: number
}

function randInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export default function MainForm() {
    const [duration, setDuration] = useState<number>(30); // Time between 2 images
    const intervalRef = useRef<number | null>(null); // setInterval to display the next image
    const timerRef = useRef<number | null>(null); // setInterval related to intervalRef, to display the progression of the timer
    const [apiLink, setApiLink] = useState(getInfoEndpoint()); // Endpoint used for fetch
    const [image, setImage] = useState<string | null>(null); // Image displayed
    const [timer, setTimer] = useState<number>(100); // Time of the timer between 0 and 100
    const [paused, setPaused] = useState(false); // Is the timer paused

    function updateInterval() {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(updateImage, duration * 1000);
        updateImage();
        setPaused(false);
    }

    function resume() {
        const timeLeft = duration - timer;
        intervalRef.current = setInterval(updateImage, timeLeft * 1000);
        timerRef.current = setInterval(() => { setTimer(x => x + 1) }, 1000);
    }

    useEffect(updateInterval, [ duration, apiLink ]);

    function updateImage() {
        fetch(apiLink)
        .then(x => x.json())
        .then((json : PocketBaseInfo) => {
            const item = randInt(0, json.totalItems - 1);
            const page = Math.floor(item / json.perPage) + 1;
            fetch(`${apiLink}?page=${page}`)
            .then(x => x.json())
            .then(json => {
                const index = item % json.perPage
                const elem = json.items[index];
                setImage(`${getImageBaseUrl()}${elem.collectionId}/${elem.id}/${elem.field ?? elem.File}`);
                setTimer(0);
                if (timerRef.current !== null) clearInterval(timerRef.current);
                timerRef.current = setInterval(() => { setTimer(x => x + 1) }, 1000);
            })
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
                if (paused) {
                    resume();
                    setPaused(false);
                } else {
                    clearInterval(intervalRef.current!);
                    clearInterval(timerRef.current!);
                    intervalRef.current = null;
                    timerRef.current = null;
                    setPaused(true);
                }
            }}>{ paused ? "Resume" : "Pause" }</button>
            <button onClick={updateInterval}>Skip</button>
        </div>
        <div className="container box is-flex flex-center-hor" id="main-display">
            {
                image ? <div id="main-display-img-container"><img src={image} /></div> : <></> 
            }
            <div id="timer" style={{
                width: (1 - timer / duration) * 100 + "%"
            }}></div>
        </div>
    </> 
}