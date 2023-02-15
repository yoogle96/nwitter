import Nweet from "components/Nweet";
import { addDocService, collectionService, dbService } from "fbase";
import { query, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        const q = query(collectionService(dbService, "nweets"));
        onSnapshot(q, (snapshot) => {
            const nweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ref: doc.ref,
                ...doc.data(),
            }))
            setNweets(nweetArray)
        });
    }, [])

    const onSubmit = async(event) => {
        event.preventDefault();
        try {
            const docRef = await addDocService(collectionService(dbService, "nweets"), {
                text: nweet,
                createAt: Date.now(),
                creatorId: userObj.uid,
            });
            console.log("Document written with ID: ", docRef.id);
        } catch(error) {
            console.error("Error adding document: ", error)
        }

        setNweet("")
    };

    const onChange = (event) => {
        setNweet(event.target.value)
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}></input>
                <input type="submit" value="Nweet"></input>
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
                ))}
            </div>
        </div>
    )
}
export default Home