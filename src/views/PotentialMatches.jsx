"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Heart, X, MapPin, Calendar, User, Camera } from "lucide-react";
import { getPotentialMatches } from "../api/usersservice";
import { recordSwipe } from "../api/swipesservice";

const SwipeAction = {
    LIKE: "like",
    DISLIKE: "dislike"
};

export default function PotentialMatches() {
    const [users, setUsers] = useState([]);
    const [currentUserIndex, setCurrentUserIndex] = useState(0);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [swipes, setSwipes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchMatches = async () => {
            setLoading(true);
            try {
                const data = await getPotentialMatches();
                setUsers(data.data.users || []);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, []);

    const currentUser = users[currentUserIndex];

    const handleSwipe = async (swipeType) => {
        if (!currentUser) return;

        const newSwipe = {
            targetUserId: String(currentUser.id),
            swipeType,
        };

        try {
            await recordSwipe(newSwipe);

            setSwipes((prev) => [...prev, newSwipe]);

            if (currentUserIndex < users.length - 1) {
                setCurrentUserIndex((prev) => prev + 1);
                setCurrentPhotoIndex(0);
            } else {
                setCurrentUserIndex(0);
                setCurrentPhotoIndex(0);
            }
        } catch (error) {
            console.error("Failed to send swipe data", error);
        }
    };

    const nextPhoto = () => {
        if (currentUser && currentPhotoIndex < currentUser.additionalPhotos.length) {
            setCurrentPhotoIndex((prev) => prev + 1);
        }
    };

    const prevPhoto = () => {
        if (currentPhotoIndex > 0) {
            setCurrentPhotoIndex((prev) => prev - 1);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200">
                <p>Loading potential matches...</p>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center max-w-md mx-4">
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">No more potential matches!</h2>
                    <p className="text-gray-400">Check back later for new profiles.</p>
                </div>
            </div>
        );
    }

    const allPhotos = [currentUser.profilePhoto, ...(currentUser.additionalPhotos || [])];
    const currentPhoto = allPhotos[currentPhotoIndex];

    return (
        <div className="min-h-screen p-4 bg-gray-900 text-gray-100">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold mb-2">Discover</h1>
                    <p className="text-gray-400">Find your perfect match</p>
                </div>

                <div className="bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
                    <div className="relative">
                        <div className="relative h-96 overflow-hidden">
                            <img
                                src={currentPhoto || "/placeholder.svg"}
                                alt={`${currentUser.name}'s photo`}
                                className="w-full h-full object-cover"
                            />

                            {allPhotos.length > 1 && (
                                <div className="absolute top-4 left-4 right-4 flex gap-1">
                                    {allPhotos.map((_, index) => (
                                        <div
                                            key={index}
                                            className={`flex-1 h-1 rounded-full ${index === currentPhotoIndex ? "bg-white" : "bg-white/30"
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}

                            <div className="absolute inset-0 flex">
                                <button onClick={prevPhoto} className="flex-1 bg-transparent" disabled={currentPhotoIndex === 0} />
                                <button
                                    onClick={nextPhoto}
                                    className="flex-1 bg-transparent"
                                    disabled={currentPhotoIndex === allPhotos.length - 1}
                                />
                            </div>

                            <div className="absolute top-4 right-4">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white">
                                    <Camera className="w-3 h-3 mr-1" />
                                    {allPhotos.length}
                                </span>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {currentUser.age}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 text-sm opacity-90 mb-2">
                                <MapPin className="w-4 h-4" />
                                <span>
                                    {currentUser.location.city}, {currentUser.location.country}
                                </span>
                            </div>

                            <div className="flex items-center gap-1 text-sm opacity-90">
                                <User className="w-4 h-4" />
                                <span>{currentUser.gender}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Bio */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-100 mb-2">About</h3>
                            <p className="text-gray-300 leading-relaxed">{currentUser.bio}</p>
                        </div>

                        {/* Preferences */}
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-100 mb-2">Looking for</h3>
                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-200 border border-gray-600">
                                    {currentUser.preferences.interestedInGender}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-200 border border-gray-600">
                                    Ages {currentUser.preferences.minAge}-{currentUser.preferences.maxAge}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-700 text-gray-200 border border-gray-600">
                                    Within {currentUser.preferences.maxDistance}km
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleSwipe(SwipeAction.DISLIKE)}
                                className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-gray-600 bg-gray-700 hover:border-red-500 hover:bg-red-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-600"
                            >
                                <X className="w-6 h-6 text-gray-300 hover:text-red-500" />
                            </button>

                            {/* <button
                                onClick={() => handleSwipe(SwipeAction.SUPER_LIKE)}
                                className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-blue-600 bg-gray-700 hover:border-blue-700 hover:bg-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            >
                                <div className="w-6 h-6 bg-gradient-to-t from-blue-500 to-blue-700 rounded-sm flex items-center justify-center">
                                    <div className="w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-white" />
                                </div>
                            </button> */}

                            <button
                                onClick={() => handleSwipe(SwipeAction.LIKE)}
                                className="flex items-center justify-center w-16 h-16 rounded-full border-2 border-green-600 bg-gray-700 hover:border-green-700 hover:bg-green-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-600"
                            >
                                <Heart className="w-6 h-6 text-gray-300 hover:text-green-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
