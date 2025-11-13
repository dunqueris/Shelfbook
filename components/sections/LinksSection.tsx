import { Section } from '@/lib/types'
import { ExternalLink } from 'lucide-react'

interface Props {
  section: Section
}

export default function LinksSection({ section }: Props) {
  const links = section.content.links || []

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-serif mb-6">{section.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {links.map((link: any, index: number) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 border border-gray-800 hover:border-white transition group"
          >
            <span className="font-medium text-white group-hover:text-gray-300">
              {link.title}
            </span>
            <ExternalLink size={16} className="text-gray-500 group-hover:text-white transition" />
          </a>
        ))}
      </div>
    </div>
  )
}
