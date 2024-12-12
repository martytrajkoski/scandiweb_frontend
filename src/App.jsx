import React from 'react'
import AppRoutes from './routes/AppRoutes'
import "./style/main.scss"
import { CartProvider } from './context/CartContext'

function App() {

  return (
    <>
      <React.StrictMode>
        <CartProvider>
          <AppRoutes/>
        </CartProvider>
      </React.StrictMode>
    </>
  )
}

export default App
