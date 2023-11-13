"use client";
import { useState } from 'react';

export default function Temp() {
    const [file, setFile] = useState<File | null>(null);

    const onClick = () => {
        if(!file) return;

        const formData = new FormData();
        formData.append('image', file);

        fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/veckans-deal`, {
            method: 'POST',
            body: formData,
        }).then(res => res.json()).then(console.log).catch(console.error);
    }
    return(
        <>
            <h1 className="text-4xl uppercase font-bold text-light">
                Åhlens Outlet
            </h1>
            <button onClick={onClick}>
                test
            </button>
            <input type="file" onChange={e => setFile((e.target.files || [])[0])} />
        </>
    )
}