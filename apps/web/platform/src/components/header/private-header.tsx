import Link from 'next/link';
import { NavUser } from '../sidebar/nav-user';

export default function PrivateHeader() {
  return (
    <header className="bg-transparent sticky top-0 z-50 w-full">
      <div className="flex px-2 sm:px-4 lg:px-6 xl:px-8 2xl:px-10 py-2.5">
        <Link href="/dashboard">Home</Link>
        <div className="ml-auto flex justify-center items-center flex-row gap-2">
          <NavUser isInSidebar={false} />
        </div>
      </div>
    </header>
  );
}
