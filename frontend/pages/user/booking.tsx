import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '../../components/core'
import { HotelPreview } from '../../components/hotel'
import { Layout, Loader } from '../../components/layout'
import { setBookings, deleteBookings } from '../../features/appSlice'
import { useDeleteBookingMutation, useFinalizeBookingMutation, useGetAllBookingQuery } from '../../services/bookingApi'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import withAuthentication from '../../components/withAuthentication'
import moment from "moment";
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { finalize, withdraw } from '../../utils/contract'
import { useGetAllUserQuery } from '../../services/userApi'

const ListBookingPage = () => {
    const { hotels } = useAppSelector((state) => state.persistedReducer.hotel)
    const users = useGetAllUserQuery({});
    const { data, isLoading, isSuccess } = useGetAllBookingQuery({})
    const anchorWallet = useAnchorWallet();
    const {connection} = useConnection();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isSuccess) dispatch(setBookings(data))
    }, [dispatch, data, isSuccess])

    const { bookings } = useAppSelector((state: any) => state.persistedReducer.app)
    const bookingListHotel: any[] = bookings?.map((booking: any) =>
        hotels?.filter((hotel: any) => booking.hotelId === hotel._id)
    )
    const [
        deleteBooking,
    ] = useDeleteBookingMutation()

    const [
        finalizeBooking,
    ] = useFinalizeBookingMutation()

    const handleDeleteBooking = async (index: number) => {
        if (!anchorWallet) {
            toast.error('Connect your wallet');
            return;
        }
        setLoading(true);
        const booking: any = bookings[index];
        const result = await withdraw(connection, anchorWallet, booking.price);
        if (result) {
            await deleteBooking(booking._id);
            dispatch(deleteBookings(booking._id));
            toast.success('Canceled booking successfully');
        }
        else {
            toast.error('Transaction error');
        }
        setLoading(false);
    }

    const handleFinalizeBooking = async (index: number) => {
        if (!anchorWallet) {
            toast.error('Connect your wallet');
            return;
        }
        const booking: any = bookings[index];
        const hotel = hotels.find((hotel: any) => hotel._id === booking.hotelId);
        if (!hotel) {
            toast.error('No hotel');
            return;
        }
        const user = users.data?.find((user: any) => user._id === hotel.user);
        if (!user) {
            toast.error('No Admin');
            return;
        }
        setLoading(true);
        const result = await finalize(connection, anchorWallet, user.wallet, booking.price);
        if (result) {
            await finalizeBooking(booking._id)
            toast.success("Finalized booking successfully");
            dispatch(setBookings(bookings.map((booking: any, i: number) => i === index ? ({
                ...booking,
                status: 2
            }): booking)))
        }
        else {
            toast.error('Transaction error');
        }
        setLoading(false);
    }

    if (isLoading || loading) {
        return (
            <div className="w-screen mt-20 flex items-center justify-center">
                <Loader />
            </div>
        )
    }
    return (
        <Layout
            metadata={{
                title: `Your booking - Booking`,
                description: `Booking`
            }}
        >
            <div
                className={
                    bookingListHotel && bookingListHotel.length > 0
                        ? `grid grid-cols-1 gap-4 md:grid-cols-2 p-2 mt-8 lg:grid-cols-2 justify-center mx-auto max-w-screen-xl overflow-hidden`
                        : `w-screen mt-20 flex items-center justify-center`
                }
            >
                {bookings && bookings.length > 0 ? (
                    <>
                        {bookings?.map((booking: any, index: number) => (
                            <div key={bookings[index]._id}>
                                <HotelPreview
                                    id={bookingListHotel[index][0]._id}
                                    image={bookingListHotel[index][0].photos[0]}
                                    name={bookingListHotel[index][0].name}
                                    title={bookingListHotel[index][0].title}
                                    large={true}
                                />

                                <div key={booking?._id} className="ml-2">
                                    <h3 className="font-bold text-xl">SOL {booking.price}</h3>
                                    <p>Checkin: {moment(booking.checkIn).format("LLL")}</p>
                                    <p>Checkout: {moment(booking.checkOut).format("LLL")}</p>

                                    {
                                        booking.status === 2 ?  <h3 className="font-bold text-xl">Finalized</h3> :(
                                        booking.status === 1 ? 
                                        <div onClick={() => handleFinalizeBooking(index)} className="mt-4">
                                            <Button
                                                text="Finalize"
                                                textColor="text-white"
                                                bgColor="bg-primary"
                                            />
                                        </div>:
                                        <div onClick={() => handleDeleteBooking(index)} className="mt-4">
                                            <Button
                                                text="Cancel"
                                                textColor="text-white"
                                                bgColor="bg-primary"
                                            />
                                        </div>)
                                    }
                                </div>  
                            </div>
                        ))}
                    </>
                ) : (
                    <h1 className="font-bold text-3xl">No room booking</h1>
                )}
            </div>
        </Layout>
    )
}

export default withAuthentication(ListBookingPage)
