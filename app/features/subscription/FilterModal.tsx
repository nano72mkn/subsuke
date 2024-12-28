import { SlidersHorizontal } from "lucide-react"
import { useState, type FC } from "react"
import { useMediaQuery } from 'react-responsive'
import { Button } from "~/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "~/components/ui/drawer"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { billingCycleOptions } from "~/config/billingCycle"
import { categoryOptions, type Category } from "~/config/category"
import type { BillingCycle } from "~/types"

const title = "フィルター";

type Props = {
  searchQuery: string;
  filterCategory: Category | 'all';
  filterCycle: BillingCycle | 'all';
  setSearchQuery: (value: string) => void;
  setFilterCycle: (value: BillingCycle | 'all') => void;
  setFilterCategory: (value: Category | 'all') => void;
}

export const FilterModal: FC<Props> = ( props ) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery({ minWidth: 768 });

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <SlidersHorizontal />
            {title}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{ title }</DialogTitle>
          </DialogHeader>
          <Form {...props} />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">閉じる</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" aria-label="フィルター"><SlidersHorizontal /></Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{ title }</DrawerTitle>
        </DrawerHeader>
        <div className="p-4">
          <Form {...props} />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

const Form: FC<Props> = ({
  searchQuery,
  filterCategory,
  filterCycle,
  setSearchQuery,
  setFilterCycle,
  setFilterCategory
}) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="currency">サービス名</Label>
        <Input type="search" placeholder="例:Netflix" defaultValue={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">カテゴリ</Label>
        <Select onValueChange={v => setFilterCategory(v as Category | 'all')} defaultValue={filterCategory}>
          <SelectTrigger className="w-[180px]" id="billing-cycle">
            <SelectValue placeholder="カテゴリ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {
              categoryOptions.map((categoryOption) => (
                <SelectItem key={categoryOption.id} value={categoryOption.id}>{categoryOption.label}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="billing-cycle">支払間隔</Label>
        <Select onValueChange={v => setFilterCycle(v as BillingCycle | 'all')} defaultValue={filterCycle}>
          <SelectTrigger className="w-[180px]" id="billing-cycle">
            <SelectValue placeholder="支払間隔" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            {
              billingCycleOptions.map((billingCycleOption) => (
                <SelectItem key={billingCycleOption.id} value={billingCycleOption.id}>{billingCycleOption.label}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
