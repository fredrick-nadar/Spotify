import React from 'react'
import '../dist/style.css'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import Player from './components/Player'
import Navbar from './components/Navbar'
import { MusicProvider } from './context/MusicContext'

const App = () => {
  return (
    <MusicProvider>
      <div className="flex flex-col h-screen bg-[#121212]">
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Navbar />
            <MainContent />
          </div>
        </div>
        <Player />
      </div>
    </MusicProvider>
  )
}

export default App