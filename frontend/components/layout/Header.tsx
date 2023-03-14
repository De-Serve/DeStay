import Link from 'next/link'
import React from 'react'
import {
	HiUser,
	AiOutlineUser,
	RiSuitcaseLine,
	AiOutlineWallet,
	AiOutlineHeart,
	VscSignOut,
	BiBed,
	MdOutlineAirplaneTicket,
	GiEarthAsiaOceania,
	AiOutlineCar,
	MdOutlineAttractions,
	RiTaxiWifiLine
} from '../../utils/icons'
import { Button } from '../core'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { logout } from '../../features/authSlice'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { setBookings, setHotelWishList } from '../../features/appSlice'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react'
import { beautifyAddress } from '../../utils'

const Header = () => {
	const router = useRouter()
	const { user } = useAppSelector((state: any) => state.persistedReducer.auth)
	const wallet = useWallet();

	const dispatch = useAppDispatch()

	const handleLogout = async () => {
		dispatch(logout())
		dispatch(setHotelWishList([]))
		dispatch(setBookings([]))
		toast.success('User logged out...')
		await router.push('/auth')
	}

	const accountMenu = [
		{
			icon: <AiOutlineUser />,
			name: 'Manage account',
			link: '/user'
		},
		{
			icon: <RiSuitcaseLine />,
			name: 'Bookings & Trips',
			link: '/user/booking'
		},
		{
			icon: <AiOutlineWallet />,
			name: 'Reward & Wallet',
			link: '/'
		},
		{
			icon: <AiOutlineHeart />,
			name: 'Saved',
			link: '/user/wishlist'
		}
	]
	const menu = [
		{
			icon: <BiBed />,
			name: 'Stays',
			link: '/'
		},
		{
			icon: <MdOutlineAirplaneTicket />,
			name: 'Flights',
			link: '/'
		},
		{
			icon: <GiEarthAsiaOceania />,
			name: 'Flight + Hotel',
			link: '/'
		},
		{
			icon: <AiOutlineCar />,
			name: 'Car rentals',
			link: '/'
		},
		{
			icon: <MdOutlineAttractions />,
			name: 'Attractions',
			link: '/'
		},
		{
			icon: <RiTaxiWifiLine />,
			name: 'Airport taxis',
			link: '/'
		}
	]

	const handleWallet = async () => {
		if (!wallet.publicKey) {
			// console.log('wallets', wallet.wallets[0])
			const walletName: any = 'Phantom';
			wallet.select(walletName);
			// await wallet.wallets[0].adapter.connect();
		}
		else {
			await wallet.disconnect();
		}
	}
	return <header className="w-full bg-primary header-section ">
		<nav className="">
			<div className="flex flex-wrap justify-between items-center gap-2.5 mx-auto  py-2.5 ">
				<Link href="/">
					<img
						src='/assets/images/logo.png'
					/>
				</Link>
				<div className=" flex flex-end items-center gap-2 sm:gap-4">
					{user
						? <>
							<div
								className="group inline-block relative">
								<button
									className=" w-full px-2 flex items-center text-white gap-1 ">
									<div
										className="w-8 h-8 border-2 border-orange-500 rounded-full
                                            flex items-center justify-center
                                            overflow-hidden">
										<HiUser size={30} />
									</div>
									<span className="hidden md:block">Your account</span>
								</button>
								<ul className="w-max absolute z-50 right-0 hidden text-primary pt-2 group-hover:block">
									{accountMenu.map(item =>
										<li key={item.name}
											className="bg-white hover:bg-gray-300 block whitespace-no-wrap">
											<Link href={`${item.link}`}
												className="flex items-center py-2 px-4 gap-x-2.5 ">
												{item.icon}
												<span>{item.name}</span>
											</Link>
										</li>
									)}
									<li
										className="bg-white hover:bg-gray-300 block whitespace-no-wrap">
										<div onClick={() => handleLogout()}
											className="flex items-center py-2 px-4 gap-x-2.5 cursor-pointer">
											<VscSignOut />
											<span>Sign out</span>
										</div>
									</li>
								</ul>
							</div>
						</>
						: <>
							<Link href="/auth">
								<Button text="Sign In" textColor="text-[#F0BC00] font-family-daggersquare " bgColor="bg-transparent border-[2px] border-[solid] border-[#F0BC00] rounded-[6px] " />
							</Link>
						</>}
					<Link href="/join">
						<Button text="List your property" textColor="text-[#F0BC00] font-family-daggersquare " bgColor="bg-transparent border-[2px] border-[solid] border-[#F0BC00] rounded-[6px] " />
					</Link>
					<div onClick={handleWallet}>
						<Button text={wallet.publicKey ? beautifyAddress(wallet.publicKey.toString()) : 'Connect Wallet'} textColor="text-[white] font-family-daggersquare " bgColor="bg-[#F0BC00] border-[2px] border-[solid] border-[#F0BC00] rounded-[6px] " />
					</div>
					<div className='bg-[#F0BC00] rounded-[50%] p-[13px] ' >
						<img
							src='/assets/images/twitter.png'
						/>
					</div>
				</div>
			</div>
		</nav>
	</header>
}

export default Header
