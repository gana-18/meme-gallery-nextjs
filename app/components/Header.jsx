import React from 'react'
import Image from 'next/image'
function Header() {
  return (
    <>
      <div className="navbar">
        <div className="doge">
            <Image src="/dog meme.webp" alt="logo" width={60} height={60} />
          <h1>MEME GALLERY</h1>
        </div>
      </div>
    </>
  )
}

export default Header