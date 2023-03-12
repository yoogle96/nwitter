import { authService, collectionService, dbService } from "fbase";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { query, where, getDocs, orderBy } from "firebase/firestore";
import { useEffect } from "react";
import { updateProfile } from "firebase/auth";

export default ({ userObj }) => {
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        if (userObj.displayName !== newDisplayName) {
            await userObj.up
            updateProfile(userObj, {
                displayName: newDisplayName,
            })
        }
    }

    const navigate = useNavigate();
    const onLogOutClick = () => {
        authService.signOut();
        navigate("/");
    };

    const getMyNweets = async () => {
        const q = query(
            collectionService(dbService, "nweets"),
            where("creatorId", "==", userObj.uid),
            orderBy("createdAt")
        );
        // console.log(q)
        const querySnapshot = await getDocs(q);
        // console.log(querySnapshot)
        querySnapshot.forEach((doc) => {
            console.log(doc.id, "=>", doc.data());
        });
    };

    useEffect(() => {
        getMyNweets();
    }, []);

    return (
        <>
            <form onSubmit={onSubmit}>
                <input onChange={onChange} type="text" placeholder="Dispaly name" value={newDisplayName}/>
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};
