import { ImageGallery } from '../../types/global.types'
import { twMerge } from 'tailwind-merge'

interface ImageCard extends Partial<ImageGallery> {
  className?: string
  onClick?: (id: string | number) => void
}

const ImageOverlayCard = ({ slug, className = '' }: ImageCard) => {
  return (
    <div
      className={twMerge(
        'rounded-lg overflow-hidden border border-gray-300 group flex items-center justify-center h-full',
        className
      )}
    >
      <img
        src={slug || '/assets/images/image-1.webp'}
        alt={slug}
        className='block h-full w-full object-cover'
      />
    </div>
  )
}

export default ImageOverlayCard
