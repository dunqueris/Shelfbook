import { Section } from '@/lib/types'

interface Props {
  section: Section
}

export default function TextListSection({ section }: Props) {
  const items = section.content.items || []

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif mb-6">{section.title}</h2>
      <ul className="space-y-3">
        {items.map((item: string, index: number) => (
          <li key={index} className="flex items-start gap-4 p-4 border border-gray-800 hover:border-gray-700 transition">
            <span className="text-white font-bold mt-1">•</span>
            <span className="text-gray-300 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
