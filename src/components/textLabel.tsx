interface TextLabelProps {
  text: string
  fontSize: 'HeroTitle-60' | 'Text-20' | 'Text-18' | 'Titles-36' | 'Titles-30' | 'Title-Light'
  color: 'Green' | 'Yellow' | 'White' | 'Gray-200' | 'Gray-600' | 'Gray-800' | 'Gray-900' 
}

const fontSizeClasses = {
  'HeroTitle-60': 'text-6xl font-montserrat font-bold',
  'Text-20': 'text-xl font-lato font-normal',
  'Text-18': 'text-lg font-lato font-normal',
  'Titles-36': 'text-4xl font-montserrat font-bold',
  'Titles-30': 'text-3xl font-montserrat font-bold',
  'Title-Light': 'text-4xl font-montserrat font-light',
}

const colorClasses = {
  'Green': 'text-green',
  'Yellow': 'text-yellow',
  'White': 'text-white',
  'Gray-200': 'text-gray-200',
  'Gray-600': 'text-gray-600',
  'Gray-800': 'text-gray-800',
  'Gray-900': 'text-gray-900',
}

export function TextLabel({ text, fontSize, color }: TextLabelProps) {
  return (
    <p className={`flex w-auto antialiased ${fontSizeClasses[fontSize]} ${colorClasses[color]}`}>
      {text}
    </p>
  )
}
