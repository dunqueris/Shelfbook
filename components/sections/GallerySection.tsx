import { Section } from '@/lib/types'

interface Props {
  section: Section
}

export default function GallerySection({ section }: Props) {
  const images = section.content.images || []

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif mb-6">{section.title}</h2>
      {images.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No images yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((image: any, index: number) => (
            <div key={index} className="overflow-hidden border border-gray-800 hover:border-gray-700 transition">
              <img
                src={image.url}
                alt={image.caption || `Gallery image ${index + 1}`}
                className="w-full h-48 object-cover hover:opacity-90 transition duration-300"
              />
              {image.caption && (
                <div className="p-3 bg-black border-t border-gray-800">
                  <p className="text-sm text-gray-400">{image.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
