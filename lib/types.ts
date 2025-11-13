export interface Profile {
  id: string
  user_id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  banner_url: string | null
  theme: string
  created_at: string
  updated_at: string
}

export interface Section {
  id: string
  profile_id: string
  title: string
  type: 'text_list' | 'links' | 'gallery'
  content: Record<string, any>
  position: number
  visible: boolean
  created_at: string
  updated_at: string
}

export interface TextListItem {
  text: string
}

export interface LinkItem {
  title: string
  url: string
  icon?: string
}

export interface GalleryImage {
  url: string
  caption?: string
}
