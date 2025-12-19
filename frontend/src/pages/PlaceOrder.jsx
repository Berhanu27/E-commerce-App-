import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    getCartAmount,
    delivery_fee,
    products,
    setCartItems
  } = useContext(ShopContext)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  })

  const [phoneNumber, setPhoneNumber] = useState('') // For M-Pesa

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setFormData((data) => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      const orderItems = []

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find(
                (product) => product._id.toString() === items.toString()
              )
            )

            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch (method) {
        // COD API call
        case 'cod':
          const response = await axios.post(
            backendUrl + '/api/order/place',
            orderData,
            { headers: { token } }
          )

          if (response.data.success) {
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;

        
        
          case 'chapa':
            const responseChapa = await axios.post(backendUrl + '/api/order/chapa', orderData, {headers: {token}})
            if(responseChapa.data.success){
              const {checkout_url} = responseChapa.data
              window.location.replace(checkout_url)
            }else{
              toast.error(responseChapa.data.message)
            }
            break;

          case 'mpesa':
            if (!phoneNumber) {
              toast.error('Please enter your M-Pesa phone number');
              return;
            }
            
            const mpesaOrderData = {
              ...orderData,
              phoneNumber: phoneNumber
            };
            
            const responseMpesa = await axios.post(backendUrl + '/api/order/mpesa', mpesaOrderData, {headers: {token}})
            if(responseMpesa.data.success){
              toast.success(responseMpesa.data.message);
              // Optionally redirect to a status page or stay on current page
              navigate('/orders');
            }else{
              toast.error(responseMpesa.data.message)
            }
            break;

            default:
              break;
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Reusable payment option component
  const PaymentOption = ({ id, label, logo, logoHeight = 'h-7' }) => (
    <div
      onClick={() => setMethod(id)}
      className='flex items-center gap-3 border p-2 px-3 cursor-pointer'
    >
      <p
        className={`min-w-3.5 h-3.5 border rounded-full ${
          method === id ? 'bg-green-400' : ''
        }`}
      ></p>
      {logo && <img className={`${logoHeight} mx-3`} src={logo} alt={label} />}
      {label && <p className='text-gray-500 text-sm font-medium'>{label}</p>}
    </div>
  )

  return (
    <form
      onSubmit={onSubmitHandler}
      className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'
    >
      {/* Delivery Information */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className='flex gap-3'>
          <input
            required
            onChange={onChangeHandler}
            name='firstName'
            value={formData.firstName}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='First name'
          />
          <input
            required
            onChange={onChangeHandler}
            name='lastName'
            value={formData.lastName}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='Last name'
          />
        </div>

        <input
          required
          onChange={onChangeHandler}
          name='email'
          value={formData.email}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='email'
          placeholder='Email address'
        />
        <input
          required
          onChange={onChangeHandler}
          name='street'
          value={formData.street}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='text'
          placeholder='Street'
        />

        <div className='flex gap-3'>
          <input
            required
            onChange={onChangeHandler}
            name='city'
            value={formData.city}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='City'
          />
          <input
            required
            onChange={onChangeHandler}
            name='state'
            value={formData.state}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='State'
          />
        </div>

        <div className='flex gap-3'>
          <input
            required
            onChange={onChangeHandler}
            name='zipcode'
            value={formData.zipcode}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='number'
            placeholder='Zipcode'
          />
          <input
            required
            onChange={onChangeHandler}
            name='country'
            value={formData.country}
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='Country'
          />
        </div>

        <input
          required
          onChange={onChangeHandler}
          name='phone'
          value={formData.phone}
          className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
          type='number'
          placeholder='Phone'
        />
      </div>

      {/* Order Summary & Payment */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />

          {/* M-Pesa */}
          <PaymentOption
            id='mpesa'
            logo={assets.mpesa_icon}
            logoHeight='h-8'
            label='M-PESA'
          />

          {/* M-Pesa Phone Number Input */}
          {method === 'mpesa' && (
            <div className='mt-4 p-4 border border-gray-300 rounded'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                M-Pesa Phone Number
              </label>
              <input
                type='tel'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder='254700123456 or 0700123456'
                className='w-full border border-gray-300 rounded py-2 px-3'
                required={method === 'mpesa'}
              />
              <p className='text-xs text-gray-500 mt-1'>
                Enter your M-Pesa registered phone number
              </p>
            </div>
          )}

          {/* Chapa */}
          <PaymentOption
            id='chapa'
            logo={assets.chapa_logo}
            logoHeight='h-10'
            label='CHAPA'
          />

          {/* COD */}
          <PaymentOption id='cod' label='CASH ON DELIVERY' />
        </div>

        <div className='w-full text-end mt-8'>
          <button
            type='submit'
            className='bg-black text-white px-16 py-3 text-sm'
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
