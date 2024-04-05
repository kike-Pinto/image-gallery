import { useState } from 'react'
import './App.css'
import Header from './components/Header/Header'
import { initialImageData } from './data'
import ImageCard from './components/Cards/ImageCard'
import { ImageGallery } from './types/global.types'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import ImageOverlayCard from './components/Cards/ImageOverlayCard'
import AddImageCard from './components/Cards/AddImageCard'

function App() {
  const [galleryData, setGalleryData] = useState(initialImageData)

  // handleSelectImage
  const handleSelectImage = (id: string | number) => {
    // if gallery.isSelected === true then set to false and vice versa
    const newGalleryData = galleryData.map((imageItem) => {
      if (imageItem.id === id) {
        return {
          ...imageItem,
          isSelected: !imageItem.isSelected,
        }
      }
      return imageItem
    })
    setGalleryData(newGalleryData)
  }

  //
  const handleDelete = (selectedItems: ImageGallery[]) => {
    // if galleryData.isSelected === true then filter out the selected items ans return the rest
    const newGalleryData = galleryData.filter(
      (imageItem) => !selectedItems.includes(imageItem)
    )
    setGalleryData(newGalleryData)
  }

  // setActiveItem se utiliza para actualizar el estado del elemento activo en la app
  const [activeItem, setActiveItem] = useState<ImageGallery | null>(null)

  // dnd code stars here
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  )

  const handleDragStart = (e: DragStartEvent) => {
    const { id } = e.active
    if (!id) return

    // current item, representa el elemento que se esta arrastrando
    const currentItem = galleryData.find((item) => item.id === id)
    // se asegura que el estado 'activeItem' se actualize correctamente durante el inicio del arrastre
    setActiveItem(currentItem || null)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveItem(null)
    const { active, over } = e
    if (!over) return

    if (active.id !== over.id) {
      setGalleryData((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }
  // dnd code ends here

  return (
    <>
      <div className='min-h-screen'>
        <div className='container flex flex-col items-center'>
          <div className='bg-white my-8 rounded-lg shadow max-w-5xl grid divide-y'>
            <Header onDelete={handleDelete} galleryData={galleryData} />

            {/* dnd context */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className='grid grid-cols-2 md:grid-cols-5 gap-8 p-8'>
                <SortableContext
                  items={galleryData}
                  strategy={rectSortingStrategy}
                >
                  {galleryData.map((imageItem) => (
                    <ImageCard
                      key={imageItem.id}
                      id={imageItem.id}
                      isSelected={imageItem.isSelected}
                      slug={imageItem.slug}
                      onClick={handleSelectImage}
                    />
                  ))}
                </SortableContext>
                <AddImageCard setGalleryData={setGalleryData} />
                <DragOverlay adjustScale={true} wrapperElement='div'>
                  {activeItem ? (
                    <ImageOverlayCard
                      className='absolute z-50 h-full w-full'
                      slug={activeItem.slug}
                    />
                  ) : null}
                </DragOverlay>
              </div>
            </DndContext>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
