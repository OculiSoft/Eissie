import { useEffect, useState } from "react"

export default function MainForm() {
    const [duration, setDuration] = useState<number>(30);
    const [dataSource, setDataSource] = useState<string | null>(null);
    const [intervalId, setIntervalId] = useState<number | null>(null);

    useEffect(() => {
        if (intervalId !== null) {
            clearInterval(intervalId);
        }

        setInterval(updateImage, duration * 60);
        updateImage();
    }, [ duration ]);

    function updateImage() {

    }

    return <>
        <div className="container box">
            <input type="radio" id="duration-30" checked={duration == 30} onClick={() => setDuration(30)} />
            <label htmlFor="duration-30">30s</label>
            <input type="radio" id="duration-120" checked={duration == 120} onClick={() => setDuration(120)} />
            <label htmlFor="duration-120">2m</label>
            <input type="radio" id="duration-300" checked={duration == 300} onClick={() => setDuration(300)} />
            <label htmlFor="duration-300">5m</label>
            <input type="radio" id="duration-600" checked={duration == 600} onClick={() => setDuration(600)} />
            <label htmlFor="duration-600">10m</label>
            <br/>
            <input type="text" />
        </div>
        <div className="container box">
        </div>
    </> 
}