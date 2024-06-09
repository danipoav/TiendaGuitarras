import { useState, useEffect, useMemo } from 'react'
import { db } from '../data/db'
import type { Guitar, CartItem } from '../types'

export const useCart = () => {
    const initialCart = (): CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }

    const [data] = useState(db)
    //Ponemos initialCart para ver si en el localStorage hay algo y sino nos da un arreglo vacio.
    const [cart, setCart] = useState(initialCart)

    const MAX_ITEMS = 5
    const MIN_ITEMS = 1
    //Uso useEffect porque localStorage es asincrono es decir se ejecuta directamente, y si le pongo la condicion useEffect se añadira cada vez que cart tenga un cambio.
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item: Guitar) {
        const itemExist = cart.findIndex(guitar => guitar.id === item.id)
        if (itemExist >= 0) {//existe el carrito y lo sumamos a quantity
            if (cart[itemExist].quantity >= MAX_ITEMS) return //Lo que hago es limitar a 5 guitarras es decir, si es mayor que 5 me devuelve nada.
            const updatedCart = [...cart]
            updatedCart[itemExist].quantity++
            setCart(updatedCart)
        } else {//no existe el carrito
            const newItem: CartItem = { ...item, quantity: 1 }
            setCart([...cart, newItem])
        }

    }

    function removeFromCart(id: Guitar['id']) {
        //Pongo el prevCart para que me guarden todos los valores.
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity(id: Guitar['id']) {

        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity < MAX_ITEMS) {
                return { ...item, quantity: item.quantity + 1 }
            } else {
                return item
            }
        })
        setCart(updatedCart)
    }

    function decreaseQuantity(id: Guitar['id']) {
        const updatedCart = cart.map(item => {
            if (item.id === id && item.quantity > MIN_ITEMS) {
                return { ...item, quantity: item.quantity - 1 }
            } else {
                return item
            }
        })
        setCart(updatedCart)
    }

    function cleanCart() {
        setCart([])
    }

    //Funcion que uso para ver si el cart esta vacio o hay algun Item.
    //UseMemo sirve para reenderizar la aplicacion es decir para que esa funcion solo se apliquen cambios cuando la condicion se de.
    const isEmpty = useMemo(() => cart.length === 0, [cart])
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cleanCart,
        isEmpty, cartTotal
    }
}

