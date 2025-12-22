import { type ExpenseCategory } from "@/services/expenses";

interface Props {
  category: string,
  categories: ExpenseCategory[]
}

export default function CategoryIcon({ category, categories }: Props) {
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