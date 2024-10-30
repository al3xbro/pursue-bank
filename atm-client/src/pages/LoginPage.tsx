import NavBar from '../organisms/NavBar';
import LoginMenu from '../organisms/LoginMenu';

export default function LoginPage() {

  return (
    <>
      <NavBar />
      <div className='flex flex-col w-full h-[calc(100%-48px)] justify-center items-center'>
        <LoginMenu />
      </div>
    </>
  )
} 