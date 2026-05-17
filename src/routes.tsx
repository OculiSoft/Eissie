import { createRoot } from 'react-dom/client'
import "../css/index.css"
import { BrowserRouter, Route, Routes } from 'react-router'
import MainForm from './MainForm'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path='/' element={<MainForm/>} />
        </Routes>
    </BrowserRouter>
)