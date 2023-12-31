import { cn } from '@/lib/utils';
import Menu from './menu';
import { responsiveWidth } from '@/app/page';

export default function Header() {
  return (
    <div className="w-screen max-w-screen border-b sticky top-0 z-50 flex justify-center backdrop-blur-sm">
      <div className={cn('flex justify-between items-center py-2 px-4', responsiveWidth)}>
        <div><a href="/" className='font-bold text-lg sm:text-xl text-primary drop-shadow-white'>T & T</a></div>
        <div>
          <Menu />
        </div>
      </div>
    </div>
  )
}