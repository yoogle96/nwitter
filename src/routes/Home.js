import Nweet from "components/Nweet";
import { addDocService, collectionService, dbService, storageService } from "fbase";
import { query, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ref, uploadString, getDownloadURL } from "firebase/storage"
import { uuidv4 } from "@firebase/util";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState()

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
        let attachmentURL = "";
        console.log(attachment)
        if (attachment != undefined) {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");
            attachmentURL = await getDownloadURL(response.ref)
        };
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentURL
        };
        await addDocService(collectionService(dbService, "nweets"), nweetObj);
        setNweet("");
        setAttachment("");
    };

    const onChange = (event) => { 
        setNweet(event.target.value)
    }

    const onFileChange = (event) => {
        const {
            target: { files }
        } = event
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: {result}
            } = finishedEvent
            setAttachment(result)
        }
        reader.readAsDataURL(theFile);
    }

    const onClearAttachment = () => setAttachment(null)

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input type="file" accept="image/*" onChange={onFileChange}></input>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120}></input>
                <input type="submit" value="Nweet"></input>
                {attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
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