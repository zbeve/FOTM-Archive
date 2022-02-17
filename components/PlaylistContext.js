import { createContext, useState, useContext } from "react";

export const PlaylistContext = createContext();

// This context provider is passed to any component requiring the context
export function PlaylistWrapper({ children }) {
    const [playlistList, setPlaylistList] = useState([])

    return (
        <PlaylistContext.Provider value={{ playlistList, setPlaylistList }}>
            { children }
        </PlaylistContext.Provider>
    )
}

export function usePlaylistContext() {
    return useContext(PlaylistContext);
}