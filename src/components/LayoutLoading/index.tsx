import  svgLoading  from 'images/loading.svg'

interface InputProps {
  show: boolean
}

export function LayoutLoading({ show }: InputProps) {
  if (!show) return null
  return (
    <div className="absolute left-0 top-0 right-0 bottom-0 bg-white/50 place-items-center flex z-50">
      <div className="flex flex-col w-full place-items-center">
        <img src={svgLoading} className="inline w-6 h-6 text-white animate-spin" />
      </div>
    </div>
  )
}
