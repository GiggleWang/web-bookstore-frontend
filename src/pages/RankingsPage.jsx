import React from 'react';
import AdminRankings from "../components/AdminRankings";

export default function RankingsPage(){
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    return(
        isAdmin?(
            <AdminRankings/>
        ):(
            <h1>rankingspage</h1>
        )
    )
}