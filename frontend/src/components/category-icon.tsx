import { useExpenseStatic } from "@/context/expense-static";

interface Props {
  category: string,
  iconSize: string,
  circleDia: string,
}

export default function CategoryIcon({ 
  category, iconSize, circleDia
}: Props) {
  const expStatic = useExpenseStatic()
  const categories = expStatic.categories

  const IconObj = getIcon(category)
  const catColor = getColor(category)

  function getIcon(category: string) {
    const catObj = categories.find(cat => cat.name == category)
    return catObj?.iconObj
  }

  function getColor(category: string) {
    const catObj = categories.find(cat => cat.name == category)
    const color = `hsl(${catObj?.hue} 100% 55%)`
    return color
  }

  return (
    <>
      <div style={{
          borderRadius: '50%', 
          width: circleDia, 
          height: circleDia, 
          backgroundColor: catColor
        }}
        className="flex flex-row justify-center items-center"
      >
        {IconObj ? <IconObj className={iconSize} /> : null}
      </div>
    </>
  )
}