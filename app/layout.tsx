'use client'
import './globals.css'

import Image from 'next/image'
import Link from 'next/link'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  weight: '700',
  subsets: ['latin'],
  style: 'normal',
})
const montserratItalic = Montserrat({
  weight: '400',
  subsets: ['latin'],
  style: 'italic',
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <NavBar />

        {children}
        <Footer />
      </body>
    </html>
  )
}

function NavBar() {
  return <nav className='flex'>
    <div className='w-20 h-16 flex items-center justify-center bg-white border-black border-[1px]'><Image src="/nintendo-switch.png" alt="Nintendo Switch" width={50} height={50}></Image></div>
    <div className='h-16 w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-500 border-black border-b-[1px] p-5 flex justify-between text-white items-center'>
      <div className={`${montserrat.className} text-2xl`}>PS GameShop</div>
      <div className='flex flex-row items-center '>
        <div className='flex items-center'>
          <Link href={"https://www.facebook.com/psgameshop.ph"} target={"_blank"}>
            <Image src={"/facebook.png"} alt="facebook" width={35} height={35} />
          </Link>
        </div>
        <div className='p-2'></div>
        <div className='flex items-center'>
          <Image src={"/super-mario.png"} alt="facebook" width={35} height={35} />
        </div>
      </div>
    </div>
  </nav>
}

function Footer() {
  const today = new Date();
  return <footer className='h-32 bg-gray-800 flex justify-center items-center'>
    <div className='text-white'>
      <span className={montserratItalic.className}> ©{today.getFullYear()} - NintendoShopGame.ph </span>
    </div>
  </footer>
}