import './App.css'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/navigation/Navbar'
import Searchbar from './components/navigation/Searchbar'

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
      
      <Searchbar></Searchbar>
    </>
  )
}

export default App
