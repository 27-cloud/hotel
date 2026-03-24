import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className='z-10 text-xl'>
      <ul className='flex gap-16 '>
        <li>
          <Link
            href='/cabins'
            className='hover:text-accent-400 transition-colors'
          >
            Cabins
          </Link>
        </li>
        <li>
          <Link
            href='/account'
            className='hover:text-accent-400 transition-colors'
          >
            Guest area
          </Link>
        </li>
      </ul>
    </nav>
  );
}
