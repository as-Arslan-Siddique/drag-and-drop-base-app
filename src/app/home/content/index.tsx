"use client";
import React, { useEffect, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Data structure for metric data
interface Metric {
  name: string;
  prefix: string;
  value: number;
  changePercentage: number;
  isIncrease: boolean;
  level: string;
}

interface Item {
  id: string;
  metric: Metric;
}

// Generate random metric data
const generateRandomMetric = (): Metric => {
  const value = Math.floor(Math.random() * 1000) + 1;
  const changePercentage = (Math.random() * 20).toFixed(2);
  const isIncrease = Math.random() > 0.5;
  const level = isIncrease ? "previous month" : "last quarter";
  return {
    name: "Metric Name",
    prefix: "$",
    value,
    changePercentage: parseFloat(changePercentage),
    isIncrease,
    level,
  };
};

export default function DragAndDropList() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // Generate 16 random items on the client side
    const initialItems: Item[] = Array.from({ length: 16 }, (_, index) => ({
      id: (index + 1).toString(),
      metric: generateRandomMetric(),
    }));
    setItems(initialItems);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-4 gap-4 p-4 max-w-screen-2xl mx-auto">
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id} metric={item.metric} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id, metric }: { id: string; metric: Metric }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-muted rounded-xl shadow-md cursor-grab"
    >
      <Card>
        <CardHeader>
          <span className="text-sm">{metric.name}</span>
          <h1 className="text-4xl font-bold">
            {metric.prefix}
            {metric.value}
          </h1>
          <div className="flex flex-row space-x-1 text-xs text-muted-foreground">
            <span>
              {metric.isIncrease ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
            </span>
            <span>
              {metric.changePercentage}% from {metric.level}
            </span>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
