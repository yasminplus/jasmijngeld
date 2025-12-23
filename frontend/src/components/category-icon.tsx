import { useExpenseStatic } from "@/context/expense-static";

interface Props {
  category: string,
}

export default function CategoryIcon({ category }: Props) {
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
          borderRadius: '50%', width: '43px', height: '43px', 
          backgroundColor: catColor,
          paddingLeft: '7.3px', 
          paddingTop: '7.3px', 
        }}
      >
        {IconObj ? <IconObj className="size-7" /> : null}
      </div>
    </>
  )
}