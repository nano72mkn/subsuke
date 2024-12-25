import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Subscription } from '@/types/subscription';
import { useState } from 'react';

type Props = {
  onAdd: (subscription: Omit<Subscription, 'id'>) => void;
};

export const AddSubscriptionDialog = ({ onAdd }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newSub, setNewSub] = useState({
    name: "",
    price: 0,
    cycle: "monthly" as const,
    category: "その他",
    paymentDate: 1,
    startDate: new Date()
  });

  const handleSubmit = () => {
    onAdd(newSub);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Add Subscription</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Subscription</DialogTitle>
          <DialogDescription>Fill in the details below to add a new subscription.</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            value={newSub.name} 
            onChange={(e) => setNewSub({ ...newSub, name: e.target.value })} 
          />
        </div>
        
        <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input 
              id="price" 
              type="number" 
              value={newSub.price} 
              onChange={(e) => setNewSub({ ...newSub, price: parseFloat(e.target.value) })} 
            />
          </div>
        
        <div className="grid grid-cols-2 gap-4">

          <div className="space-y-2">
            <Label htmlFor="cycle">Cycle</Label>
            <Select value={newSub.cycle} onValueChange={(value) => setNewSub({ ...newSub, cycle: value as typeof newSub.cycle })}>
              <SelectTrigger>
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={newSub.category} onValueChange={(value) => setNewSub({ ...newSub, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="その他">その他</SelectItem>
                <SelectItem value="エンターテインメント">エンターテインメント</SelectItem>
                <SelectItem value="教育">教育</SelectItem>
                <SelectItem value="健康">健康</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="startDate">Start Date</Label>
          <Calendar 
            mode="single" 
            selected={newSub.startDate} 
            onSelect={(date) => date && setNewSub({ ...newSub, startDate: date, paymentDate: date.getDate() })}
            className="w-full border rounded-md p-2" 
          />
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
