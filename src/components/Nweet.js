import { deleteDoc, updateDoc } from "firebase/firestore";

import { addDocService, collectionService, dbService, storageService } from "fbase";
import { ref, uploadString, getDownloadURL, deleteObject, refFromURL } from "firebase/storage"

import React, { useState } from "react";

const Nweet = ({nweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.text)
    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?");
        console.log(ok)
        if(ok) {
            await deleteDoc(nweetObj.ref)
            await deleteObject(ref(storageService, nweetObj.attachmentURL))
            // delete nweet
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev)
    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(nweetObj, newNweet);
        await updateDoc(nweetObj.ref, {
            text: newNweet
        });
        setEditing(false);
    }
    const onChange = (event) => {
        const {
            target:{value},
        } = event;
        setNewNweet(value)
    };
    return (
    <div>
        {editing ? (
            <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Edit your nweet" value={newNweet} required onChange={onChange
                }/>
                <input type="submit" value="Update Nweet"/>
            </form>
            <button onClick={toggleEditing}>Cancel</button></>
            ) : (
            <><h4>{nweetObj.text}</h4>
            {nweetObj.attachmentURL && <img src={nweetObj.attachmentURL} width="50px" height="50px"/>}
            {isOwner && (            
            <>
                <button onClick={onDeleteClick}>Delete Nweet</button>
                <button onClick={toggleEditing}>Edit Nweet</button>
            </>
        )}</>)   
        }
    </div>
    );
};

export default Nweet