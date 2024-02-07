import React, { useEffect, useState } from "react";

const Rank = ({firstname, entries}) => {
    const [emoji, setEmoji] = useState('');

    const fetchEmoji = (rank) => {
        fetch(`${process.env.REACT_APP_LAMBDA_URL}?rank=${rank}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.input){
                    setEmoji(data.input);
                } else {
                    throw new Error('error fetching an emojii: ', data);
                }
            })
            .catch(err => console.log('Error fetching an emojii: ', err));
    }

    useEffect(() => {
        fetchEmoji(entries)
    }, [entries])

    return (
        <div>
            <div className="white f3">
            { firstname + ', your current rank is ...' }
            </div>
            <div className="white f1">
            { entries }
            </div>
            <div className="white f3">
            { `Rank Badge: ${emoji}` }
            </div>
        </div>
    );
}

export default Rank;