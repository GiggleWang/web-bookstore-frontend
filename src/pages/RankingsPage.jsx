import React from 'react';
import AdminRankings from "../components/AdminRankings";
import UserRanking from "../components/UserRanking";

export default function RankingsPage(){
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    return(
        isAdmin?(
            <AdminRankings/>
        ):(
            <UserRanking/>
        )
    )
}