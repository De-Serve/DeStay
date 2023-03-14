import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '../../../../components/core'
import { HotelPreview } from '../../../../components/hotel'
import { Layout, Loader } from '../../../../components/layout'
import { deleteBookings, setBookings } from '../../../../features/appSlice'
import { useDeleteBookingMutation, useAcceptBookingMutation, useGetBookingToMeQuery } from '../../../../services/bookingApi'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import withAuthentication from '../../../../components/withAuthentication'
import moment from "moment";
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { reject, withdraw } from '../../../../utils/contract'
import { useGetAllUserQuery } from '../../../../services/userApi'
import { useRouter } from 'next/router'

const BookingRequestPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const { hotels } = useAppSelector((state) => state.persistedReducer.hotel)
    const users = useGetAllUserQuery({});
    const { data, isLoading, isSuccess } = useGetBookingToMeQuery(id)
    const anchorWallet = useAnchorWallet();
    const {connection} = useConnection();
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isSuccess) dispatch(setBookings(data))
    }, [dispatch, data, isSuccess])

    const { bookings } = useAppSelector((state) => state.persistedReducer.app)

    const bookingListHotel: any[] = bookings?.map((booking: any) =>
        hotels?.filter((hotel) => booking.hotelId === hotel._id)
    )

    const [
        deleteBooking,
    ] = useDeleteBookingMutation()

    const [
        acceptBooking,
    ] = useAcceptBookingMutation()

    const handleAcceptBooking = async (index: number) => {
        setLoading(true);
        const booking: any = bookings[index];
        await acceptBooking(booking._id)
        dispatch(setBookings(bookings.map((booking: any, i: number) => i === index ? ({
            ...booking,
            status: 1
        }): booking)))
        toast.success('Accepted booking successfully');
        setLoading(false);
    }

    const handleRejectBooking = async (index: number) => {
        if (!anchorWallet) {
            toast.error('Connect your wallet');
            return;
        }
        setLoading(true);
        const booking: any = bookings[index];
        const user = users.data?.find((item: any) => item._id === booking.user);
        if (!user) {
            toast.error('No Booking owner');
            return;
        }
        const result = await reject(connection, anchorWallet, user.wallet, booking.price);
        if (result) {
            await deleteBooking(booking._id);
            toast.success('Rejected booking successfully');
            dispatch(deleteBookings(booking._id));
        }
        else {
            toast.error('Transaction Error');
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
                {bookings && bookings.length > 0 && bookingListHotel && bookingListHotel.length> 0 ? (
                    <>
                        {bookings?.map((booking: any, index: number) => (
                            <div key={booking._id}>
                                <HotelPreview
                                    id={bookingListHotel[index][0]._id}
                                    image={bookingListHotel[index][0].photos[0]}
                                    name={bookingListHotel[index][0].name}
                                    title={bookingListHotel[index][0].title}
                                    large={true}
                                />

                                <div className="ml-2">
                                    <h3 className="font-bold text-xl">SOL {booking.price}</h3>
                                    <p>Checkin: {moment(booking.checkIn).format("LLL")}</p>
                                    <p>Checkout: {moment(booking.checkOut).format("LLL")}</p>
                                    <p>Quantity: {booking.quantity}</p>
                                    {
                                        booking.status === 2 ? <h2 className="font-bold text-xl">Finalized</h2> :  (
                                        booking.status === 1 ? <h2 className="font-bold text-xl">Accepted</h2> : 
                                        <div className='flex'>
                                            <div onClick={() => handleAcceptBooking(index)} className="mt-4">
                                                <Button
                                                    text="Accept"
                                                    textColor="text-white"
                                                    bgColor="bg-primary"
                                                />
                                            </div>

                                            <div onClick={() => handleRejectBooking(index)} className="mt-4">
                                                <Button
                                                    text="Reject"
                                                    textColor="text-white"
                                                    bgColor="bg-primary"
                                                />
                                            </div>
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

export default withAuthentication(BookingRequestPage)
