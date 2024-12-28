import { SlidersHorizontal } from "lucide-react"
import { type FC } from "react"
import { Modal } from "~/components/Modal"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { billingCycleOptions } from "~/config/billingCycle"
import { categoryOptions, type Category } from "~/config/category"
import type { BillingCycle } from "~/types"

type Props = {
  searchQuery: string;
  filterCategory: Category | 'all';
  filterCycle: BillingCycle | 'all';
  setSearchQuery: (value: string) => void;
  setFilterCycle: (value: BillingCycle | 'all') => void;
  setFilterCategory: (value: Category | 'all') => void;
}

export const FilterModal: FC<Props> = ({
  searchQuery,
  filterCategory,
  filterCycle,
  setSearchQuery,
  setFilterCycle,
  setFilterCategory
}) => {
  const clearFilters = () => {
    setSearchQuery('');
    setFilterCycle('all');
    setFilterCategory('all');
  }

  return (
    <Modal
      title="フィルター"
      description="サブスクリプションをフィルタリングします"
      trigger={
        <Button variant="outline">
          <SlidersHorizontal />
          <span className="max-md:sr-only">フィルター</span>
        </Button>
      }
      footer={<Button type="button" variant="ghost" onClick={clearFilters}>クリア</Button>}
    >
      {() => (
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
        </div>)}
    </Modal>
  )
}
