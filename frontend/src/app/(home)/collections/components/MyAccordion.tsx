"use client"

import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"

interface FilterAccordionItemProps {
  isDescription ?: boolean
  value?: string
  title: string
  children: React.ReactNode
}

const MyAccordion = ({ value, title, children, isDescription=false }: FilterAccordionItemProps) => {
  return (
    <AccordionItem value={value ?? title}>
      <AccordionTrigger className={cn(isDescription ? "font-semibold text-lg " : "")} >{title}</AccordionTrigger>
      <AccordionContent>
        {children}
      </AccordionContent>
    </AccordionItem>
  )
}

export default MyAccordion
