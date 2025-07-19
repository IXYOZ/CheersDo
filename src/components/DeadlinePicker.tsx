// components/DeadlinePicker.tsx
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DeadlinePickerProps {
  onChange: (dateString: string) => void;
}
const CustomDateInput = React.forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement>>(
  ({ value, onClick }, ref) => (
    <input
      readOnly
      onClick={onClick}
      value={value}
      ref={ref}
      placeholder="Select deadline"
      className="p-2 border rounded w-full text-sm text-black bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  )
);

CustomDateInput.displayName = "CustomDateInput";
export default function DeadlinePicker({ onChange }: DeadlinePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (selectedDate) {
      onChange(selectedDate.toISOString());
    }
  }, [selectedDate, onChange]);

  // สำหรับกำหนด minTime เฉพาะเมื่อเลือกวันนี้
  const now = new Date();
  const isToday = selectedDate
    ? selectedDate.toDateString() === now.toDateString()
    : true;

  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600">Deadline</label>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="Pp"
        minDate={now}
        minTime={isToday ? now : new Date(0, 0, 0, 0, 0)} // Not after at this time
        maxTime={new Date(0, 0, 0, 23, 45)}
        placeholderText="Select deadline"
        className="p-2 border rounded w-full text-sm text-black bg-gray-100 cursor-pointer"
        customInput={<CustomDateInput />}
      />
    </div>
  );
}
